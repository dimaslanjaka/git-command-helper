import { afterAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { latestCommit } from "../src/functions/latestCommit";
import * as spawnerModule from "../src/spawner";

describe("latestCommit() - get latest commit", () => {
  let promiseSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    promiseSpy?.mockRestore();
    promiseSpy = jest.spyOn(spawnerModule.default, "promise").mockResolvedValue({
      code: 0,
      stdout: [],
      stderr: []
    } as any);
  });

  afterAll(() => {
    promiseSpy?.mockRestore();
  });

  it("root repository short hash", async () => {
    promiseSpy.mockResolvedValue({ code: 0, stdout: ["abc1234"], stderr: [] });
    const result = await latestCommit(undefined, { short: true });
    expect(result).toBe("abc1234");
    expect(promiseSpy).toHaveBeenCalledWith(
      expect.objectContaining({ cwd: process.cwd() }),
      "git",
      "rev-parse",
      "--short",
      "HEAD"
    );
  });

  it("root repository long hash", async () => {
    promiseSpy.mockResolvedValue({ code: 0, stdout: ["abc1234def5678"], stderr: [] });
    const result = await latestCommit(undefined, { short: false });
    expect(result).toBe("abc1234def5678");
    expect(promiseSpy).toHaveBeenCalledWith(
      expect.objectContaining({ cwd: process.cwd() }),
      "git",
      "rev-parse",
      "HEAD"
    );
  });

  it("root repository default (short)", async () => {
    promiseSpy.mockResolvedValue({ code: 0, stdout: ["abc1234"], stderr: [] });
    const result = await latestCommit();
    expect(result).toBe("abc1234");
    expect(promiseSpy).toHaveBeenCalledWith(
      expect.objectContaining({ cwd: process.cwd() }),
      "git",
      "rev-parse",
      "--short",
      "HEAD"
    );
  });

  it("README.md file short hash", async () => {
    promiseSpy.mockResolvedValue({ code: 0, stdout: ["def5678"], stderr: [] });
    const result = await latestCommit("README.md", { short: true });
    expect(result).toBe("def5678");
    expect(promiseSpy).toHaveBeenCalledWith(
      expect.objectContaining({ cwd: process.cwd() }),
      "git",
      "log",
      "--pretty=tformat:%h",
      "-n",
      "1",
      "README.md"
    );
  });

  it("README.md file long hash", async () => {
    promiseSpy.mockResolvedValue({ code: 0, stdout: ["def567890abcdef"], stderr: [] });
    const result = await latestCommit("README.md", { short: false });
    expect(result).toBe("def567890abcdef");
    expect(promiseSpy).toHaveBeenCalledWith(
      expect.objectContaining({ cwd: process.cwd() }),
      "git",
      "log",
      "--pretty=tformat:%H",
      "-n",
      "1",
      "README.md"
    );
  });

  it("returns undefined when stdout is empty", async () => {
    promiseSpy.mockResolvedValue({ code: 0, stdout: [], stderr: [] });
    const result = await latestCommit();
    expect(result).toBeUndefined();
  });

  it("returns undefined when stdout is null", async () => {
    promiseSpy.mockResolvedValue({ code: 0, stdout: null, stderr: null });
    const result = await latestCommit();
    expect(result).toBeUndefined();
  });
});
