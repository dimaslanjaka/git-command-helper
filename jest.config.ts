import { existsSync, mkdirSync, readFileSync } from "fs";
import * as jsonc from "jsonc-parser";
import { join } from "path";
import type { JestConfigWithTsJest } from "ts-jest";

const tsconfigBase: typeof import("./tsconfig.base.json") = jsonc.parse(
  readFileSync(join(__dirname, "tsconfig.base.json"), "utf-8")
);
const tsconfigJest: typeof import("./tsconfig.base.json") = jsonc.parse(
  readFileSync(join(__dirname, "tsconfig.jest.json"), "utf-8")
);
const tsconfig = Object.assign(tsconfigBase.compilerOptions, tsconfigJest.compilerOptions);

/**
 * @see {@link https://jestjs.io/docs/configuration}
 * * how to run single test {@link https://stackoverflow.com/questions/28725955/how-do-i-test-a-single-file-using-jest}
 */
const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "mjs", "mts", "node"],
  extensionsToTreatAsEsm: [".ts"],
  verbose: false,
  cache: true,
  cacheDirectory: join(__dirname, "tmp/jest"),
  collectCoverageFrom: [
    "src/*.{js,ts}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/test/**",
    "!**/*.test.{js,ts}",
    "!**/*.builder.ts",
    "!**/.deploy_git/**"
  ],
  roots: [`<rootDir>/test`],
  coveragePathIgnorePatterns: ["**/node_modules/**", "**/dist/**", "**/tmp/**", "**/test/**"],
  testMatch: [
    `**/__tests__/**/*.+(ts|tsx|js|mjs|mts)`,
    `**/?(*.)+(spec|test).+(ts|tsx|js|mjs|mts)`,
    `**/test/*.test.{ts,js,mjs,mts}`,
    "!**/.deploy_git/**"
  ],
  // Use moduleNameMapper to handle ESM imports in tests
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  // Allow transformation of all ESM in node_modules for all external dependencies
  transformIgnorePatterns: ["/node_modules/(?!.*\\.mjs$)/"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      {
        babelConfig: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { node: "current" }
              }
            ],
            "@babel/preset-typescript"
          ]
        },
        // useESM: true,
        tsconfig
      }
    ],
    "^.+\\.(mjs)$": ["babel-jest", { presets: ["@babel/preset-env"] }]
  },

  // Find memory leaks in your tests by monitoring memory usage, but may slow down your test suite and occasionally report false positives.
  // detectLeaks: true,
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "\\\\node_modules\\\\"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8"

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],
};

if (!existsSync(<string>config.cacheDirectory)) mkdirSync(<string>config.cacheDirectory, { recursive: true });

export default config;
