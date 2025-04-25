export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Transform .js, .jsx, .ts, .tsx files
  },
  transformIgnorePatterns: ['/node_modules/(?!lucide-react)/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}', // Collect coverage for .js, .jsx, .ts, .tsx files
    '!**/*.test.{js,jsx,ts,tsx}', // Exclude test files
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
};