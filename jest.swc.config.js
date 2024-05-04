import path from "path";
const resolve = (_path) => path.resolve(__dirname, _path);

module.exports = {
  testURL: "http://localhost",
  moduleNameMapper: {
    "utils/(.*)": resolve("./utils/$1"),
    "src/(.*)": resolve("./src/$1"),
  },
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["e2e/", ".*donottest.*"],
  transform: { "^.+\\.(t|j)sx?$": ["@swc/jest"] },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
};