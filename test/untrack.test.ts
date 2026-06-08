import { beforeAll, describe, expect, test } from "@jest/globals";
import { writeFileSync } from "fs";
import { join } from "path";
import { isUntracked } from "../src/functions/isFileChanged";
import git, { gitHelper } from "../src/index";
import { testcfg } from "./config";

describe("untrack", () => {
  let gh: git;
  beforeAll(async () => {
    gh = new gitHelper(testcfg.cwd, testcfg.branch);
    await gh.reset(testcfg.branch);
  });

  test("write new file", async () => {
    const filename = "untrack-test-" + Math.random().toString(36).substring(2, 10) + ".txt";
    const newfile = join(testcfg.cwd, filename);
    writeFileSync(newfile, Math.random().toFixed(2));
    const result = await isUntracked(filename, { cwd: testcfg.cwd });
    expect(result).toBeTruthy();
  });

  test("file not found", async () => {
    const filename = "untrack-nonexistent-" + Math.random().toString(36).substring(2, 10) + ".txt";
    const result = await isUntracked(filename, { cwd: testcfg.cwd });
    expect(result).toBeFalsy();
  });
});
