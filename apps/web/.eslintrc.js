module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended", 
    "next/core-web-vitals"
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: [
    ".*.js",
    "node_modules/",
    "dist/",
    ".next/",
  ],
}