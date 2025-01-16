/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  bracketSpacing: true,
  tabWidth: 2,
  printWidth: 80,
  importOrder: ['^vue$', '<THIRD_PARTY_MODULES>', '', '^@/', '^./'],
  plugins: [
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
};
