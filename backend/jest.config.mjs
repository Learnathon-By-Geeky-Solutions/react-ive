export default {
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest', // Transform .js and .mjs files
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    '**/*.{js,mjs}', // Collect coverage for .js and .mjs files
    '!**/*.test.{js,mjs}', // Exclude test files
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
};