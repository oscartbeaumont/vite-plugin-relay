import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
  ...tsPlugin.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: { ecmaVersion: 2018, sourceType: "module" },
    },
  },
  prettier,
];
