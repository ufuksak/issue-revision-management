module.exports = {
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.integration.test.ts"],
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "json-summary"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "lib/**/*.{js,jsx,ts}",
    "!lib/index.ts",
    "!lib/types/schema.ts",
    "!lib/models/indexnew.ts",
    "!lib/models/issuenew.ts",
    "!lib/models/revisionnew.ts",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 95,
      statements: 95,
    },
  }
};
