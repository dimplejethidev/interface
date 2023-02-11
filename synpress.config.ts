// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "cypress";

const getSynpressPath = () => "./node_modules/@synthetixio/synpress";
// eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires
const importedSetupNodeEvents = require(`${getSynpressPath()}/plugins/index`);

export default defineConfig({
    userAgent: "synpress",
    retries: {
        // Configure retry attempts for `cypress run`
        // Default is 0
        runMode: 0,
        openMode: 0,
    },
    screenshotsFolder: "screenshots",
    videosFolder: "videos",
    video: false,
    chromeWebSecurity: true,
    viewportWidth: 1366,
    viewportHeight: 850,
    env: {
        coverage: false,
    },
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 30000,
    requestTimeout: 30000,
    e2e: {
        setupNodeEvents(on, config) {
            // cypressLocalStoragePlugin(on, config);
            importedSetupNodeEvents(on, config);
            return config;
        },
        baseUrl: "http://localhost:3000",
        specPattern: "tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "tests/e2e/support.ts",
    },
});
