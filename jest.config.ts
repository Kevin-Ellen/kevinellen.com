import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.ts"],

  transform: {
    ...tsJestTransformCfg,
  },

  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],

  moduleNameMapper: {
    "\\.css\\?raw$": "<rootDir>/tests/mocks/rawCss.mock.ts",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^@request/(.*)$": "<rootDir>/src/request/$1",
    "^@app-state/(.*)$": "<rootDir>/src/app-state/$1",
    "^@app-context/(.*)$": "<rootDir>/src/app-context/$1",
    "^@app-render-context/(.*)$": "<rootDir>/src/app-render-context/$1",
    "^@rendering/(.*)$": "<rootDir>/src/rendering/$1",
    "^@shared-types/(.*)$": "<rootDir>/shared-types/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@generated/(.*)\\?raw$": "<rootDir>/tests/stubs/rawText.stub.ts",
  },

  moduleFileExtensions: ["ts", "js", "json"],

  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};

export default config;
