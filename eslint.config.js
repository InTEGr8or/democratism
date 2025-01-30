import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import baseGlobals from "globals";

const globals = {
  ...baseGlobals.browser,
  ...baseGlobals.es2021,
  ...baseGlobals.node,
};

delete globals["AudioWorkletGlobalScope "];

export default [
  {
    files: ["**/*.js", "**/*.ts", "**/*.astro"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".astro"],
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      astro,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error", {}, { usePrettierrc: true }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["*.astro"],
    languageOptions: {
      parser: astro.parser,
    },
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
  prettierConfig,
];
