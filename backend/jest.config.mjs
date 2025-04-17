export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
