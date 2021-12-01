import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "yarn dev",
    port: 3000,
  },
};
export default config;
