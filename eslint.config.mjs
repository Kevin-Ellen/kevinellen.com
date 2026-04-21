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
      "src/xxx___app/**",
      "xxx___src/**",
      "__OLD/**",
      "tests/**",
      "packages/**",
    ],
  },

  js.configs.recommended,

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
        projectService: true,
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

  eslintConfigPrettier,
];
