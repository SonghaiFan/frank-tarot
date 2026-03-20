import { getCardImageUrl } from "../constants/cards";
import { getLocalizedSpread } from "../constants/spreads";
import { Locale } from "../types";
import { UI_TEXT } from "../constants/i18n";

export default function printTheReading(
  question: any,
  spread: any,
  pickedCards: any,
  readingText: any,
  locale: Locale
) {
  return async () => {
    try {
      const { toPng } = await import("html-to-image");
      const ui = UI_TEXT[locale];
      const spreadConfig = getLocalizedSpread(spread, locale);

      // 创建一个精美的卡牌解读图片
      const container = document.createElement("div");
      container.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        background: #0f0f0f;
        color: #e5e5e5;
        padding: 60px 50px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        width: 1000px;
        box-sizing: border-box;
        z-index: -1;
        opacity: 1;
        pointer-events: none;
      `;

      // 顶部标题
      const headerDiv = document.createElement("div");
      headerDiv.style.cssText = `
        text-align: center;
        margin-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 30px;
      `;

      const titleDiv = document.createElement("div");
      titleDiv.style.cssText = `
        font-size: 28px;
        letter-spacing: 8px;
        color: #fff;
        margin-bottom: 12px;
        font-weight: 300;
      `;
      titleDiv.textContent = ui.print.title;

      const subtitleDiv = document.createElement("div");
      subtitleDiv.style.cssText = `
        font-size: 10px;
        letter-spacing: 4px;
        color: #666;
        text-transform: uppercase;
      `;
      subtitleDiv.textContent = ui.print.subtitle;

      headerDiv.appendChild(titleDiv);
      headerDiv.appendChild(subtitleDiv);
      container.appendChild(headerDiv);

      // 问题部分
      if (question) {
        const questionSection = document.createElement("div");
        questionSection.style.cssText = `
          margin-bottom: 40px;
          text-align: center;
        `;

        const questionLabel = document.createElement("div");
        questionLabel.style.cssText = `
          font-size: 10px;
          letter-spacing: 3px;
          color: #666;
          margin-bottom: 12px;
          text-transform: uppercase;
        `;
        questionLabel.textContent = ui.print.questionLabel;

        const questionText = document.createElement("div");
        questionText.style.cssText = `
          font-size: 16px;
          color: #b8b8b8;
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        `;
        questionText.textContent = `"${question}"`;

        questionSection.appendChild(questionLabel);
        questionSection.appendChild(questionText);
        container.appendChild(questionSection);
      }

      // 卡牌区域
      const cardsSection = document.createElement("div");
      cardsSection.style.cssText = `
        margin-bottom: 50px;
      `;

      const cardsLabel = document.createElement("div");
      cardsLabel.style.cssText = `
        font-size: 10px;
        letter-spacing: 3px;
        color: #666;
        margin-bottom: 20px;
        text-align: center;
        text-transform: uppercase;
      `;
      cardsLabel.textContent = spreadConfig.name;
      cardsSection.appendChild(cardsLabel);

      const cardsContainer = document.createElement("div");
      cardsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 30px;
        align-items: flex-start;
        flex-wrap: wrap;
      `;

      pickedCards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.style.cssText = `
          width: ${spread === "SINGLE" ? "280px" : "200px"};
          text-align: center;
        `;

        // 卡牌图片
        const img = document.createElement("img");
        img.src = getCardImageUrl(card.image);
        img.crossOrigin = "anonymous";
        img.style.cssText = `
          width: 100%;
          height: auto;
          border: 1px solid rgba(255,255,255,0.15);
          filter: grayscale(100%) contrast(1.2) brightness(0.9);
          margin-bottom: 16px;
        `;

        // 卡牌名称
        const nameDiv = document.createElement("div");
        nameDiv.style.cssText = `
          font-size: 14px;
          color: #e5e5e5;
          letter-spacing: 1px;
          margin-bottom: 6px;
        `;
        nameDiv.textContent = locale === "en" ? card.nameEn : card.nameCn;

        // 英文名和逆位标识
        const enNameDiv = document.createElement("div");
        enNameDiv.style.cssText = `
          font-size: 10px;
          color: #888;
          letter-spacing: 1px;
          margin-bottom: 12px;
        `;
        enNameDiv.textContent =
          locale === "en"
            ? card.nameCn
            : card.isReversed
              ? `${card.nameEn} (Reversed)`
              : card.nameEn;

        // 关键词
        const keywordsDiv = document.createElement("div");
        keywordsDiv.style.cssText = `
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        `;

        if (locale === "zh-CN") {
          card.keywords.slice(0, 4).forEach((keyword) => {
            const keywordSpan = document.createElement("span");
            keywordSpan.style.cssText = `
              font-size: 9px;
              color: #999;
              padding: 4px 8px;
              border: 1px solid rgba(255,255,255,0.08);
              background: rgba(255,255,255,0.03);
              letter-spacing: 1px;
            `;
            keywordSpan.textContent = keyword;
            keywordsDiv.appendChild(keywordSpan);
          });
        }

        cardDiv.appendChild(img);
        cardDiv.appendChild(nameDiv);
        cardDiv.appendChild(enNameDiv);
        cardDiv.appendChild(keywordsDiv);
        cardsContainer.appendChild(cardDiv);
      });

      cardsSection.appendChild(cardsContainer);
      container.appendChild(cardsSection);

      // 解读内容部分
      const readingSection = document.createElement("div");
      readingSection.style.cssText = `
        margin-top: 50px;
        padding-top: 40px;
        border-top: 1px solid rgba(255,255,255,0.1);
      `;

      const readingLabel = document.createElement("div");
      readingLabel.style.cssText = `
        font-size: 10px;
        letter-spacing: 3px;
        color: #666;
        margin-bottom: 20px;
        text-align: center;
        text-transform: uppercase;
      `;
      readingLabel.textContent = ui.print.interpretationLabel;

      const textDiv = document.createElement("div");
      textDiv.style.cssText = `
        font-size: 16px;
        line-height: 2.2;
        color: #d0d0d0;
        text-align: justify;
        max-width: 850px;
        margin: 0 auto;
        font-weight: 300;
        text-indent: 2em;
      `;
      textDiv.textContent = readingText;

      readingSection.appendChild(readingLabel);
      readingSection.appendChild(textDiv);
      container.appendChild(readingSection);

      // 底部时间戳
      const footerDiv = document.createElement("div");
      footerDiv.style.cssText = `
        margin-top: 50px;
        text-align: center;
        font-size: 9px;
        color: #444;
        letter-spacing: 2px;
      `;
      const now = new Date();
      footerDiv.textContent = now.toLocaleString(ui.print.dateLocale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      container.appendChild(footerDiv);

      document.body.appendChild(container);

      // 等待图片加载
      const images = container.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve(null);
              else {
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
              }
            })
        )
      );

      // 等待一小段时间确保渲染完成
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 生成图片
      const dataUrl = await toPng(container, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
        // Avoid reading cross-origin stylesheets (e.g., Google Fonts) to prevent SecurityError
        skipFonts: true,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      // 清理
      document.body.removeChild(container);

      // 下载
      const link = document.createElement("a");
      link.download = `${ui.print.filename}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("下载失败:", error);
    }
  };
}
