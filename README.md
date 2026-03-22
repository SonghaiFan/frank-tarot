# Frank Tarot | 命运塔罗

<div align="center">
  <img src="docs/teaser.png" alt="Frank Tarot teaser" width="100%" />
  <p><em>An immersive AI tarot reading ritual for the web.</em></p>
</div>

Frank Tarot is a bilingual tarot reading experience built with React, Vite, and Google Gemini. It combines cinematic presentation, guided card selection, spoken readings, and spread-aware interpretation to turn a simple prompt into a ritual-style session.

The app supports English and Simplified Chinese, adapts across desktop and mobile, and is structured as a static site that can be deployed to GitHub Pages.

## Live Site

https://songhaifan.github.io/frank-tarot/

## Highlights

- AI-generated tarot readings shaped by the selected spread, card positions, and upright or reversed orientation
- Voice-guided ritual flow with ambient audio and generated speech for the final reading
- Multiple spreads, including single-card, three-card, clarity, relationship, and other themed layouts
- Bilingual interface with English and Simplified Chinese content
- Printable reading output for saving or sharing a session
- Responsive presentation designed for both mobile and desktop use

## Tech Stack

- React 19
- Vite 7
- TypeScript
- Tailwind CSS 4
- Motion
- Google GenAI SDK
- i18next

## Project Structure

```text
src/
  app/                  App shell, layout, and global UI
  features/tarot/       Tarot spreads, cards, reading flow, Gemini services
  i18n/                 Localization setup and translations
public/
  audio/                Ritual and fallback audio assets
  images/cards/         Card artwork
  og/                   Social preview assets
scripts/
  export_ground_truth.py
  rectify_cards.py
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/SonghaiFan/frank-tarot.git
cd frank-tarot
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

### Run Locally

```bash
npm run dev
```

The app runs on `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Deployment Notes

This project is configured for GitHub Pages and currently uses:

- Vite base path: `/frank-tarot/`
- Canonical site URL: `https://songhaifan.github.io/frank-tarot/`

If you deploy under a different repository name or custom domain, update the base path and public metadata accordingly.

## How It Works

1. The seeker enters a question or leaves it open for general guidance.
2. The app selects or predicts an appropriate spread.
3. Cards are drawn from spread-specific pools and can appear upright or reversed.
4. Gemini generates a synthesized reading based on spread context and card meaning hints.
5. The reading can be spoken aloud and printed from the browser.

## License

MIT
