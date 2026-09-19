import path from "path";
import fs from "fs";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function cardImagesManifestPlugin(): Plugin {
  const cardsDir = path.resolve(__dirname, "public/images/cards");
  const targetJsonPath = path.resolve(
    __dirname,
    "src/features/tarot/data/card-images.json"
  );
  const FORMAT_PRIORITY = [".webp", ".avif", ".png", ".jpg", ".jpeg", ".svg"];

  function generateManifest() {
    if (!fs.existsSync(cardsDir)) return;
    const files = fs.readdirSync(cardsDir);
    const map: Record<string, string> = {};

    for (const file of files) {
      if (file.startsWith(".") || file === "old" || file.endsWith(".md")) continue;
      const ext = path.extname(file).toLowerCase();
      const priorityIndex = FORMAT_PRIORITY.indexOf(ext);
      if (priorityIndex === -1) continue;

      const stem = path.basename(file, ext);
      if (!map[stem]) {
        map[stem] = file;
      } else {
        const existingExt = path.extname(map[stem]).toLowerCase();
        const existingPriority = FORMAT_PRIORITY.indexOf(existingExt);
        if (priorityIndex < existingPriority) {
          map[stem] = file;
        }
      }
    }

    const sortedMap = Object.keys(map)
      .sort()
      .reduce((acc, key) => {
        acc[key] = map[key];
        return acc;
      }, {} as Record<string, string>);

    const newContent = JSON.stringify(sortedMap, null, 2) + "\n";
    if (
      !fs.existsSync(targetJsonPath) ||
      fs.readFileSync(targetJsonPath, "utf-8") !== newContent
    ) {
      fs.mkdirSync(path.dirname(targetJsonPath), { recursive: true });
      fs.writeFileSync(targetJsonPath, newContent, "utf-8");
    }
  }

  // Ensure initial generation before any module evaluation
  generateManifest();

  return {
    name: "card-images-manifest",
    buildStart() {
      generateManifest();
    },
    configureServer(server) {
      server.watcher.add(cardsDir);
      server.watcher.on("all", (_event, filePath) => {
        if (filePath.startsWith(cardsDir)) {
          generateManifest();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    base: "/frank-tarot/",
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react(), tailwindcss(), cardImagesManifestPlugin()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
