// jest.config.mjs
export default {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"     // 👈 Fix imports with .js extensions
  }
};
