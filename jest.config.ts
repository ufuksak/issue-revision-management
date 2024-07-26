// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.integration.test.js"],
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "json-summary"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "lib/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 95,
      statements: 95,
    },
  },
};
