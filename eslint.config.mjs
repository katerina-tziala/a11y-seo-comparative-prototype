import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'no-console': 'warn',
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/html-self-closing': [
        'error',
        {
          html: { component: 'always', normal: 'always', void: 'always' },
          math: 'always',
          svg: 'always',
        },
      ],
      'vue/no-v-html': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
)
