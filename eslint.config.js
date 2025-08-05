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
    files: ["**/*.js", "**/*.ts"], // Exclude .astro files from this general config
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
  // Temporarily remove or comment out the .astro specific config to disable linting for them
  // {
  //   files: ["**/*.astro"],
  //   languageOptions: {
  //     parser: astro.parser,
  //     parserOptions: {
  //       parser: tseslint.parser,
  //       project: "./tsconfig.json",
  //       extraFileExtensions: [".astro"],
  //     },
  //   },
  //   plugins: {
  //     astro,
  //   },
  //   rules: {
  //     // override/add rules settings here, such as:
  //     // "astro/no-set-html-directive": "error"
  //   },
  // },
  prettierConfig,
];
