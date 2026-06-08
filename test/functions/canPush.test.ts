import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import { async as spawnAsync } from "cross-spawn";
import { git } from "../../src/index";
import { testcfg } from "../config";

jest.setTimeout(120000); // Set a longer timeout for tests

describe("canPush()", () => {
  let github: git;
  const localRemote = path.join(__dirname, "../tmp/remote.git");
  const originalRemoteOriginUrl = testcfg.remote;

  beforeAll(async () => {
    // Create a local bare repo to serve as the "origin" remote
    // This avoids external auth dependency (the root cause of CI failures)
    await spawnAsync("git", ["init", "--bare", localRemote]);

    // Init working directory
    github = new git(testcfg.cwd);

    // Hard reset to clean state before testing
    await spawnAsync("git", ["reset", "--hard", "HEAD"], { cwd: testcfg.cwd, stdio: "pipe" });

    // Point origin to the local bare repo
    await spawnAsync("git", ["remote", "set-url", "origin", localRemote], { cwd: testcfg.cwd });

    // Ensure the test branch exists and push initial state to local remote
    await spawnAsync("git", ["push", "-u", "origin", testcfg.branch], { cwd: testcfg.cwd, stdio: "pipe" });
  }, 90000);

  afterAll(async () => {
    // Hard reset to clean state
    await github.reset(testcfg.branch);
    // Restore original remote URL for other tests
    await spawnAsync("git", ["remote", "set-url", "origin", originalRemoteOriginUrl], { cwd: testcfg.cwd });
    // Cleanup local bare repo
    fs.rmSync(localRemote, { recursive: true, force: true });
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
