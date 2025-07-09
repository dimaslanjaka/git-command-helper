import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { spawnSync } from "cross-spawn";
import * as fs from "fs-extra";
import * as path from "path";
import { getIgnores, isIgnored } from "../src/functions/gitignore";
import { testcfg } from "./config";

describe(".gitignore test", () => {
  const ignoredFile = path.join(testcfg.cwd, "file-ignore.txt");
  const ignoredFile2 = path.join(testcfg.cwd, "file-ignore-another.txt");

  beforeAll(() => {
    spawnSync("git", ["reset", "--hard", "origin/" + testcfg.branch], { cwd: testcfg.cwd });
    fs.writeFileSync(ignoredFile, "");
    fs.writeFileSync(ignoredFile2, "");
  }, 900000);

  afterAll(() => {
    if (global.gc) {
      global.gc();
    }
  });

  it("getIgnores() - should have file-ignore.txt", async () => {
    const check = await getIgnores({ cwd: testcfg.cwd });
    expect(check.some((o) => o.relative.endsWith(path.basename(ignoredFile)))).toBeTruthy();
    expect(check.some((o) => o.relative.endsWith(path.basename(ignoredFile2)))).toBeTruthy();
  }, 90000);

  it("isIgnored() - should be ignored", async () => {
    // absolute
    expect(await isIgnored(ignoredFile)).toBeTruthy();
    // relative needs options.cwd
    expect(await isIgnored("file-ignore.txt", { cwd: testcfg.cwd })).toBeTruthy();
    expect(await isIgnored("file-ignore.txt")).toBeFalsy();
    expect(await isIgnored("/file-ignore.txt")).toBeFalsy();
    // absolute another wildcard
    expect(await isIgnored(ignoredFile2)).toBeTruthy();
  }, 90000);

  it("pattern new-file-*", async () => {
    /**
     * this file should be indexed
     */
    const indexed = path.join(testcfg.cwd, "new-file.txt");
    /**
     * this file should be ignored
     */
    const ignored = path.join(testcfg.cwd, "new-file-another.txt");
    fs.writeFileSync(ignored, "");
    fs.writeFileSync(indexed, "");

    expect(await isIgnored(ignored)).toBeTruthy();
    expect(await isIgnored(indexed)).toBeFalsy();
  }, 90000);
});
