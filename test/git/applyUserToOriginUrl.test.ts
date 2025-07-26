import git from "../../src/git";
import { testcfg } from "../config";

describe("git.applyUserToOriginUrl", () => {
  const parsedUrl = new URL(testcfg.remote);

  it("should apply user to remote URL and update config", async () => {
    const g = new git({ cwd: testcfg.cwd, remote: testcfg.remote, user: testcfg.user });
    const result = await g.applyUserToOriginUrl();
    expect(result).toBe(true);
    expect(g.remote).toContain(`${encodeURIComponent(testcfg.user)}@${parsedUrl.hostname}`);
  });

  it("should return false if user is missing", async () => {
    const g = new git({ cwd: testcfg.cwd, remote: testcfg.remote });
    const result = await g.applyUserToOriginUrl();
    expect(result).toBe(false);
  });

  it("should return false if remote is missing", async () => {
    // Provide a dummy remote value (empty string) to satisfy GitOpt type
    const g = new git({ cwd: testcfg.cwd, user: testcfg.user, remote: "" });
    const result = await g.applyUserToOriginUrl();
    expect(result).toBe(false);
  });

  it("should return false if username already present", async () => {
    const urlWithUser = `https://${testcfg.user}@${parsedUrl.hostname}${parsedUrl.pathname}`;
    const g = new git({ cwd: testcfg.cwd, remote: urlWithUser, user: testcfg.user });
    const result = await g.applyUserToOriginUrl();
    expect(result).toBe(false);
  });
});
