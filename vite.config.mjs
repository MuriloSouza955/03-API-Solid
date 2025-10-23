import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "./src/use-case",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          dir: "./src/http/controllers",
          environment: "./prisma/vitest-enviroment-prisma/prisma-test-enviroment.ts",
        },
      },
    ],
  },
});
