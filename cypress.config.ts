/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "cypress";
import { loadEnvConfig } from "@next/env";

const { combinedEnv } = loadEnvConfig(process.cwd());
export default defineConfig({
  env: combinedEnv,
  e2e: {
    baseUrl: "http://localhost:3000",
    retries: {
      runMode: 3,
    },
    viewportHeight: 1080,
    viewportWidth: 1920,
    video: false,
    screenshotOnRunFailure: false,
  },
});
