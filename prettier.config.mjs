/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/assets/css/main.css',
  printWidth: 100,
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  tabWidth: 2,
  bracketSpacing: true,
  vueIndentScriptAndStyle: false,
  endOfLine: 'lf',
  singleAttributePerLine: true,
}
