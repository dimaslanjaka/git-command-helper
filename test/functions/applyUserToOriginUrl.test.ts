import { applyUserToOriginUrl } from "../../src";
import git from "../../src/git";
import { testcfg } from "../config";

describe("applyUserToOriginUrl", () => {
  const parsedUrl = new URL(testcfg.remote);

  beforeAll(async () => {
    // Reset the repository and set user/email before tests
    const g = new git({ cwd: testcfg.cwd, remote: testcfg.remote, user: testcfg.user });
    await g.reset(testcfg.branch);
    await g.setuser(testcfg.user);
    await g.setemail(testcfg.email);
  });

  it("should apply user to remote URL and update config", async () => {
    const g = new git({ cwd: testcfg.cwd, remote: testcfg.remote, user: testcfg.user });
    const result = await g.applyUserToOriginUrl();
    expect(result.error).toBe(false);
    expect(result.message).toMatch(/applied to remote/);
    expect(g.remote).toContain(`${encodeURIComponent(testcfg.user)}@${parsedUrl.hostname}`);
  });

  it("should return error object if user is missing", async () => {
    const result = await applyUserToOriginUrl(testcfg.remote, undefined, "origin", { cwd: testcfg.cwd });
    expect(result.error).toBe(true);
    expect(result.message).toBe("User is missing.");
  });

  it("should return error object if remote is missing", async () => {
    const result = await applyUserToOriginUrl(undefined, undefined, "origin", { cwd: testcfg.cwd });
    expect(result.error).toBe(true);
    expect(result.message).toBe("Remote URL is missing.");
  });

  it("should return error if username already present", async () => {
    const urlWithUser = `https://${testcfg.user}@${parsedUrl.hostname}${parsedUrl.pathname}`;
    const g = new git({ cwd: testcfg.cwd, remote: urlWithUser, user: testcfg.user });
    const result = await g.applyUserToOriginUrl();
    expect(result.error).toBe(true);
    expect(result.message).toMatch(/Username already present/);
  });
});
