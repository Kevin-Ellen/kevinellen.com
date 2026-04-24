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
    // "^@config/(.*)$": "<rootDir>/src/config/$1",
    // "^@src/(.*)$": "<rootDir>/src/$1",

    // "^@app/(.*)$": "<rootDir>/src/app/$1",
    // "^@system/(.*)$": "<rootDir>/src/system/$1",
    // "^@resources/(.*)$": "<rootDir>/src/resources/$1",
    // "^@types-src/(.*)$": "<rootDir>/src/types/$1",
    "^@generated/(.*)\\?raw$": "<rootDir>/tests/stubs/rawText.stub.ts",
  },

  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;
