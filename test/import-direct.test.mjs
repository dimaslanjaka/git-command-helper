import { describe, expect, it } from "@jest/globals";
import gch from "../dist/index.js";
import { isClass } from "./import-direct.cjs";

describe("Import dist test", () => {
  it("should detect if gch is a class", () => {
    expect(isClass(gch)).toBe(false);
  });

  it("should detect if gch.gitCommandHelper is a class", () => {
    expect(isClass(gch.gitCommandHelper)).toBe(true);
  });

  it("should detect if gch.gitHelper is a class", () => {
    expect(isClass(gch.gitHelper)).toBe(true);
  });
});
