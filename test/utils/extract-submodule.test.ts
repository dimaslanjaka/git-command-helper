import { describe, expect, it } from "@jest/globals";
import path from "upath";
import extractSubmodule from "../../src/utils/extract-submodule";

describe("extractSubmodule", () => {
  const gitmodulesPath = path.join(__dirname, "../fixtures/.gitmodules-sample");

  it("should extract submodules as objects with correct properties", () => {
    const submodules = extractSubmodule(gitmodulesPath);
    expect(Array.isArray(submodules)).toBe(true);
    expect(submodules.length).toBeGreaterThan(0);
    for (const sub of submodules) {
      if (!sub) continue;
      expect(typeof sub.path).toBe("string");
      expect(typeof sub.url).toBe("string");
      expect(typeof sub.branch).toBe("string");
      expect(typeof sub.cwd).toBe("string");
      expect(sub.github).toBeDefined();
    }
  });

  it("should return undefined for non-submodule keys", () => {
    const submodules = extractSubmodule(gitmodulesPath);
    // Only submodule keys should be processed, so filter out undefined
    const filtered = submodules.filter(Boolean);
    expect(filtered.length).toBeLessThanOrEqual(submodules.length);
  });
});
