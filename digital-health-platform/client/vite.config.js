import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Important for Vercel SSR auto-detection
  server: {
    port: 5173,
    strictPort: true,
  },

  // Ensures correct asset paths after build
  base: "/",
});
