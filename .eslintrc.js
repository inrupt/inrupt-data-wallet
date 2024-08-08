//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

module.exports = {
  extends: ["expo", "@inrupt/eslint-config-lib"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.eslint.json",
  },
  ignorePatterns: [
    "expo-env.d.ts", // Exclude expo-env.d.ts from ESLint checks
  ],
  rules: {
    "no-undef": "off", // TypeScript handles this
    "no-use-before-define": "off", // Disable the base rule
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, variables: false, classes: true, typedefs: true },
    ],
    "no-shadow": "off", // Disable the base rule
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        ignoreRestSiblings: true,
        caughtErrors: "none",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-var-requires": [
      "error", {
        // These exceptions cover imports from CJS configuration modules (e.g. app.config.js, plugins/*.js)
        allow: ["plugins", "fs"]
      }
    ],
    "import/prefer-default-export": "off",
    "no-console": "off",
  },
};
