// @ts-check
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

const contentPattern = {
  group: ["@/content/*", "!@/content/navigation"],
  message:
    "Read content through src/server/modules/content/* (AGENTS.md › Content layer).",
};
const dbPattern = {
  group: ["@/server/core/db", "@/generated/prisma", "@/generated/prisma/*"],
  message:
    "Only core and module services/models touch Prisma. Call a module service instead (AGENTS.md › Architecture rules).",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      // Server Actions are async functions passed to `action={}`.
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  // Layering (AGENTS.md › Architecture rules). Prisma (db / generated client)
  // is reachable only from src/server/core and the module services/models;
  // controllers (route handlers), actions, pages and components go through a
  // module service. Content comes only through src/server/modules/content so
  // it can move to the database without touching pages.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/server/core/**", "src/server/modules/**", "src/content/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [contentPattern, dbPattern] },
      ],
    },
  },
  {
    files: ["src/server/modules/**/*.{actions,controller}.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [contentPattern, dbPattern] },
      ],
    },
  },
  {
    files: ["src/server/core/**", "src/server/modules/**"],
    ignores: [
      "src/server/modules/**/*.{actions,controller}.ts",
      "src/server/modules/content/**",
    ],
    rules: {
      "no-restricted-imports": ["error", { patterns: [contentPattern] }],
    },
  },
  // "use cache" functions must be async even when they await nothing (static
  // content that depends on today's date), so require-await can't apply.
  {
    files: ["src/server/modules/content/*.service.ts"],
    rules: { "@typescript-eslint/require-await": "off" },
  },
  // Size limits (AGENTS.md › Code size limits). Blank lines and comments
  // don't count.
  {
    files: ["**/*.{ts,tsx,mts,cts,js,mjs,cjs}"],
    rules: {
      "max-lines-per-function": [
        "error",
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "max-lines": [
        "error",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    // Hand-built UI primitives keep each family in one file, and test suites
    // nest whole files inside describe() callbacks.
    files: ["src/components/ui/**", "tests/**", "**/*.test.{ts,tsx}"],
    rules: { "max-lines": "off", "max-lines-per-function": "off" },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated and vendored code:
    "coverage/**",
    "src/generated/**",
    ".agents/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
