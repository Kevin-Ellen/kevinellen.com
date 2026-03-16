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
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@system/(.*)$": "<rootDir>/src/system/$1",
    "^@resources/(.*)$": "<rootDir>/src/resources/$1",
    "^@config/(.*)$": "<rootDir>/src/app/config/$1",
    "^@types-src/(.*)$": "<rootDir>/src/types/$1",
    "^@generated/(.*)\\?raw$": "<rootDir>/tests/stubs/rawText.stub.ts",
  },

  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;
