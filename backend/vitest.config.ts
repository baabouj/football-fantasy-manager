import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    env: {
      NODE_ENV: "test",
    },
    globalSetup: "./tests/utils/setup.ts",
  },
});
