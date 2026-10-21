import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRelayPlugin } from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createRelayPlugin({
      artifactDirectory: "./src/__generated__",
      eagerEsModules: true,
    }),
    react(),
  ],
});
