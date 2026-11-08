// eslint.config.mjs

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "dist/**",
      ".wrangler/**",
      "coverage/**",
      "node_modules/**",
      "worker-configuration.d.ts",
      "tests/**",
      "packages/**",
      "src/assets/scripts/generated/**",
      "src/tools/temp-folder/**",
      "audits/**"
    ],
  },

  js.configs.recommended,

  {
    files: ["src/app/assets/scripts/authored/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        requestAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
      },
    },
  },

  {
    files: ["scripts/**/*.mjs", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },

  {
    files: ["**/*.{ts,mts,cts}"],
    ...tseslint.configs.recommendedTypeChecked[0],
    languageOptions: {
      ...tseslint.configs.recommendedTypeChecked[0].languageOptions,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ...(tseslint.configs.recommendedTypeChecked[0].languageOptions
          ?.parserOptions ?? {}),
        projectService: {
          allowDefaultProject: ["jest.config.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        Env: "readonly",
        ExecutionContext: "readonly",
        fetch: "readonly",
        crypto: "readonly",
      },
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
    },
  },

  {
    files: ["**/*.ts"],
    rules: {
      "no-undef": "off",
    },
  },

  eslintConfigPrettier,
];
