import { Locale } from "@/i18n/types";

// Decode Base64 string to Uint8Array
export const base64ToBytes = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Convert raw PCM (Int16) to AudioBuffer
// Gemini 2.5 Flash TTS returns raw PCM 16-bit mono at 24kHz
export const pcmToAudioBuffer = (
  pcmData: Uint8Array,
  audioContext: AudioContext,
  sampleRate: number = 24000
): AudioBuffer => {
  const float32Data = new Float32Array(pcmData.length / 2);
  const dataView = new DataView(pcmData.buffer);

  for (let i = 0; i < pcmData.length / 2; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    float32Data[i] = int16 / 32768;
  }

  const audioBuffer = audioContext.createBuffer(
    1,
    float32Data.length,
    sampleRate
  );
  audioBuffer.getChannelData(0).set(float32Data);
  return audioBuffer;
};

// Load pre-generated MP3 audio from local file
export const loadLocalAudio = async (
  filename: string,
  audioContext: AudioContext
): Promise<AudioBuffer | null> => {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}audio/${filename}`);
    if (!response.ok) {
      console.warn(`本地音频文件不存在: ${filename}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.warn(`加载本地音频失败: ${filename}`, error);
    return null;
  }
};

export const getStaticAudioFilename = (
  staticKey: string,
  locale: Locale
): string => (locale === "zh-CN" ? `${staticKey}_cn.mp3` : `${staticKey}.mp3`);
