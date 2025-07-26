import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import { applyTokenToOriginUrl, git } from "../../src/index";
import { testcfg } from "../config";

jest.setTimeout(120000); // Set a longer timeout for tests

describe("canPush()", () => {
  let github: git;

  beforeAll(async function () {
    github = new git(testcfg.cwd);
    await github.setuser(testcfg.user);
    await github.setemail(testcfg.email);
    await applyTokenToOriginUrl(testcfg.remote, testcfg.token, "origin");
  }, 90000);

  afterAll(async () => {
    // Reset git
    await github.reset(testcfg.branch);
  });

  it("cannot push after reset", async () => {
    await github.reset(testcfg.branch);

    const can = await github.canPush("origin", testcfg.branch);
    expect(can).toBe(false);
  }, 90000);

  it("cannot push after modify file without commit", async () => {
    fs.writeFileSync(
      path.join(testcfg.cwd, "canPush.txt"),
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
    const can = await github.canPush("origin", testcfg.branch);
    expect(can).toBe(false);
  }, 90000);

  it("can push after commit", async () => {
    await github.add(".");
    await github.commit("update test", "m", { stdio: "pipe" });
    const can = await github.canPush("origin", testcfg.branch);
    expect(can).toBe(true);
  }, 90000);
});
