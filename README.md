# Frank Tarot | 命运塔罗

<div align="center">
  <img src="docs/teaser.png" alt="Frank Tarot Teaser" width="100%" />
  <p>
    <em>An immersive, AI-powered Tarot reading experience.</em>
  </p>
</div>

## ✨ Features

- **🔮 AI-Powered Readings**: Leverages Google's Gemini AI to provide deep, personalized interpretations of your Tarot spreads.
- **🌌 Immersive Atmosphere**: Features cosmic particle effects that react to game stages, ambient background music, and a "breathing" ritual glow for a mystical experience.
- **🃏 Diverse Spreads**:
  - **Single Card Oracle**: For quick daily guidance.
  - **Three Card Spread**: Past, Present, Future.
  - **Four Card Clarity**: Situation, Obstacles, Advice, Outcome.
  - **Five Dimensions**: A holistic scan of Romance, Finance, Mental, Career, and Spirit.
  - **Relationship Mirror**: Deep dive into connection dynamics.
  - **Court Card Spread**: Focus on personalities and archetypes.
- **🎴 Smart Deck Logic**: Advanced card pooling ensures specific spreads draw from appropriate subsets (e.g., only Major Arcana for spiritual positions, specific suits for elemental positions).
- **🗣️ Voice Synthesis**: Listen to your reading with integrated text-to-speech capabilities.
- **📱 Fully Responsive**: Optimized for both desktop and mobile devices, ensuring a seamless ritual anywhere.
- **⚡ Modern Tech Stack**: Built with React 19, Vite, Tailwind CSS, and Framer Motion for smooth, responsive performance.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SonghaiFan/frank-tarot.git
   cd frank-tarot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file in the root directory and add your Gemini API key:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 🛠️ Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build locally.

## 🧩 Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📄 License

This project is licensed under the MIT License.
