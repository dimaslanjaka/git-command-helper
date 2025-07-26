import { spawnAsync } from "cross-spawn";
import fs from "fs";
import path from "path";
import git, { applyTokenToOriginUrl } from "../../src";
import { testcfg } from "../config";

const runLive = async (cmd: string, args: string[]) => {
  await spawnAsync(cmd, args, {
    cwd: testcfg.cwd,
    stdio: "inherit", // 👈 stream live output
    env: { ...process.env, GIT_PAGER: "cat" } // 👈 disable pager
  });
};

(async () => {
  const github = new git(testcfg.cwd);
  await github.setuser(testcfg.user);
  await github.setemail(testcfg.email);
  github.setToken(testcfg.token);
  await github.setremote(testcfg.remote, testcfg.originName);
  await applyTokenToOriginUrl(testcfg.remote, testcfg.token, testcfg.originName);

  console.log("\n[INFO] Listing git remotes:");
  await runLive("git", ["remote", "-v"]);

  await github.reset(testcfg.branch);

  let can = await github.canPush("origin", testcfg.branch);
  console.log(`[RESULT] Can push to branch '${testcfg.branch}' on 'origin': ${can}`);

  fs.writeFileSync(
    path.join(testcfg.cwd, "canPush.txt"),
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  can = await github.canPush("origin", testcfg.branch);
  console.log(`[RESULT] Can push after modifying 'canPush.txt': ${can}`);

  await github.add("canPush.txt");
  await github.commit("update test", "m", { stdio: "pipe" });
  can = await github.canPush("origin", testcfg.branch);
  console.log(`[RESULT] Can push after committing changes: ${can}`);

  // Reset the branch to clean up
  console.log("\n[INFO] Resetting branch to clean up...");
  await github.reset(testcfg.branch);
})();
// git config credential.helper store
