// jest.config.ts

import type { Config } from "jest";

import { createDefaultPreset } from "ts-jest";

const collectCoverageFrom = [
  // Include source
  "src/**/*.{ts,tsx}",

  // Explicitly retain these configuration files
  "src/app/config/content.config.ts",
  "src/app/config/redirects.config.ts",
  "src/app/config/svg.assets.config.ts",

  // Exclude tests and declarations
  "!src/**/*.test.{ts,tsx}",
  "!src/**/*.d.ts",
  "!src/tests/**",

  // Exclude other authored configuration
  "!src/shared/config/site.config.shared.authored.ts",
  "!src/shared/config/person.config.shared.authored.ts",
  "!src/shared/config/topics.config.shared.authored.ts",
];
const sharedConfig: Config = {
  rootDir: ".",

  roots: ["<rootDir>"],

  transform: {
    ...createDefaultPreset().transform,
  },

  clearMocks: true,

  moduleNameMapper: {
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^@shared-types/(.*)$": "<rootDir>/src/shared-types/$1",
    "\\?raw$": "<rootDir>/src/tests/mocks/raw-asset.mock.ts",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "json"],

  collectCoverageFrom,

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/app/content/",
    "/src/shared-types/",
  ],

  coverageProvider: "babel",
};

const config: Config = {
  rootDir: ".",

  collectCoverage: true,
  collectCoverageFrom,

  projects: [
    {
      ...sharedConfig,
      displayName: "node",
      testEnvironment: "node",
      testMatch: ["**/*.test.ts"],
    },
    {
      ...sharedConfig,
      displayName: "jsdom",
      testEnvironment: "jsdom",
      testMatch: ["**/*.test.tsx"],
      setupFilesAfterEnv: ["@testing-library/jest-dom"],
    },
  ],

  coverageDirectory: "<rootDir>/audits/coverage",

  coverageReporters: ["text", "html", "lcov", "json"],

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
