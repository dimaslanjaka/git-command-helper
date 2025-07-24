import { beforeAll, describe, expect, it } from "@jest/globals";
import { isClass } from "./import-direct.cjs";

describe("Import dist test", () => {
  let gchCJS;
  beforeAll(async () => {
    // Import the CJS version to ensure it works correctly
    gchCJS = await import("../dist/index.js");
  });
  it("should detect if gch is a class", () => {
    expect(isClass(gchCJS)).toBe(false);
  });

  it("should detect if gch.gitCommandHelper is a class", () => {
    expect(isClass(gchCJS.gitCommandHelper)).toBe(true);
  });

  it("should detect if gch.gitHelper is a class", () => {
    expect(isClass(gchCJS.gitHelper)).toBe(true);
  });
});
