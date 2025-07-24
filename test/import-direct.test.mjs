import { beforeAll, describe, expect, it } from "@jest/globals";
import { isClass } from "./import-direct.cjs";

describe("Import CJS and ESM dist bundles", () => {
  /** @type {import("../dist/index.js")} */
  let gchCJS;
  /** @type {import("../dist/index.mjs")} */
  let gchESM;

  beforeAll(async () => {
    // Import the CJS version to ensure it works correctly
    gchCJS = await import("../dist/index.js");
    // Import the ESM version to ensure it works correctly
    gchESM = await import("../dist/index.mjs");
  });

  it("CJS: gch is not a class", () => {
    expect(isClass(gchCJS)).toBe(false);
  });

  it("ESM: gch is not a class", () => {
    expect(isClass(gchESM)).toBe(false);
  });

  it("CJS: gch.gitCommandHelper is a class", () => {
    expect(isClass(gchCJS.gitCommandHelper)).toBe(true);
  });

  it("ESM: gch.gitCommandHelper is a class", () => {
    expect(isClass(gchESM.gitCommandHelper)).toBe(true);
    console.log(typeof gchESM.gitCommandHelper); // Should log 'function' if it's a class
  });

  it("CJS: gch.gitHelper is a class", () => {
    expect(isClass(gchCJS.gitHelper)).toBe(true);
  });
  it("ESM: gch.gitHelper is a class", () => {
    expect(isClass(gchESM.gitHelper)).toBe(true);
  });
});
