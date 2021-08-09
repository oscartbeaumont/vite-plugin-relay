import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import relay from "vite-plugin-relay";

export default defineConfig({
  plugins: [reactRefresh(), relay],
});
