module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "next/core-web-vitals"
  ],
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
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/no-unescaped-entities": "off"
  }
}