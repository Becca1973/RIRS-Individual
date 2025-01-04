module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text-summary"], // Dodaj "lcov"
  moduleFileExtensions: ["js"],
  testMatch: ["<rootDir>/src/_tests_/**/*.test.js"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
};
