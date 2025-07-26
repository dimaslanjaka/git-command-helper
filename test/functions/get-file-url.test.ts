import { beforeAll, describe, expect, it } from "@jest/globals";
import path from "upath";
import { getGithubRepoUrl } from "../../src/functions/getGithubRepoUrl";
import git, { gitCommandHelper } from "../../src/index";
import { testcfg } from "../config";

describe("getGithubRepoUrl() - get file url", () => {
  let gh: git;
  let branch: string;

  beforeAll(async () => {
    gh = new gitCommandHelper(testcfg.cwd, testcfg.branch);
    await gh.setremote(testcfg.remote, testcfg.originName);
    branch = (await gh.getbranch()).filter((o) => o.active)[0].branch;
  });

  it("should be same with test", async () => {
    const branchName = (await gh.getbranch()).filter((o) => o.active)[0].branch;
    expect(branchName).toBe(testcfg.branch);
    const remote = await gh.getremote();
    expect(remote.push.url).toBe(testcfg.remote);
  });

  it("should be have properties", async () => {
    const obj = await gh.getGithubRepoUrl(path.join(testcfg.cwd, "package.json"));
    expect(obj).toHaveProperty("remoteURL");
    expect(obj).toHaveProperty("rawURL");
  });

  it("properties should be have correct value", async () => {
    const cleanRemoteUrl = testcfg.remote.replace(/\.git$/, "");
    const obj = await getGithubRepoUrl(path.join(testcfg.cwd, "package.json"), { cwd: testcfg.cwd }, cleanRemoteUrl);
    expect(obj.remoteURL).toBe(`${cleanRemoteUrl}/tree/${branch}/package.json`);
    expect(obj.rawURL).toBe(`${cleanRemoteUrl}/raw/${branch}/package.json`);
  });
});
