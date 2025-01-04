module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js"],
  testMatch: ["<rootDir>/src/_tests_/**/*.test.js"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
};
