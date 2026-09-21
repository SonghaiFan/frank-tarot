import { GoogleGenAI } from "@google/genai";
import { Locale } from "@/features/tarot/types";
import {
  generateTarotReading,
  predictBestSpread,
  hasApiKey as hasAiKey,
  getApiKey,
} from "@/core";
import {
  base64ToBytes,
  pcmToAudioBuffer,
  loadLocalAudio,
  getStaticAudioFilename,
} from "./audio";

export { generateTarotReading, predictBestSpread, hasAiKey };

const getAiClient = () =>
  new GoogleGenAI({
    apiKey: getApiKey(),
  });

export const generateSpeech = async (
  text: string,
  audioContext: AudioContext,
  staticKey?: string,
  locale: Locale = "zh-CN"
): Promise<AudioBuffer | null> => {
  if (!text) return null;

  // 1. 本地静态预制音频
  if (staticKey) {
    const localAudio = await loadLocalAudio(
      getStaticAudioFilename(staticKey, locale),
      audioContext
    );
    if (localAudio) {
      return localAudio;
    }
    console.warn(`本地音频不可用: ${staticKey} (${locale})`);
  }

  if (!hasAiKey()) return null;

  // 2. Gemini TTS
  try {
    const ai = getAiClient();
    console.log("Gemini TTS text:", text);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [
            {
              text:
                locale === "en"
                  ? "Use a deep, mystical, empathetic English voice suitable for an ancient sage/tarot master. Speak in English and deliver the following reading with wisdom and calm presence: " + text
                  : "使用深沉、神秘、富有同理心的中文声音，模拟古老智者/塔罗大师的风格。请用普通话流畅地诵读以下解读，传递智慧和沉静的气场：" + text,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Enceladus" },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      const pcmBytes = base64ToBytes(base64Audio);
      return pcmToAudioBuffer(pcmBytes, audioContext, 24000);
    }
    console.warn("No audio data in response");
    return null;
  } catch (error) {
    console.warn(
      "Gemini TTS unavailable (quota or server busy). Staying silent.",
      error
    );
    return null;
  }
};
