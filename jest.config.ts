import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/e2e/"],
  transformIgnorePatterns: [
    "node_modules/(?!(msw|@mswjs|until-async|@mswjs/interceptors)/)",
  ],
};

module.exports = createJestConfig(customJestConfig);
