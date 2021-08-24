module.exports = {
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  preset: 'ts-jest',
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}
