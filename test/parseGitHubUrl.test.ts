import { describe, expect, it } from "@jest/globals";
import { parseGitHubUrl } from "../src/functions/parseGitHubUrl";

describe("parseGitHubUrl", () => {
  it("parses https url with username and password", () => {
    const url = "https://user:pass@github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: "user",
      password: "pass",
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses https url with username and password and tree path", () => {
    const treeUrl = "https://user:pass@github.com/dimaslanjaka/git-command-helper/tree/pre-release/.yarn/releases";
    expect(parseGitHubUrl(treeUrl)).toEqual({
      protocol: "https",
      username: "user",
      password: "pass",
      host: "github.com",
      owner: "dimaslanjaka",
      repo: "git-command-helper",
      path: "tree/pre-release/.yarn/releases",
      branch: "pre-release"
    });
  });

  it("parses https url with blob path and branch", () => {
    const blobUrl = "https://github.com/dimaslanjaka/git-command-helper/blob/pre-release/.gitignore";
    expect(parseGitHubUrl(blobUrl)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "dimaslanjaka",
      repo: "git-command-helper",
      path: "blob/pre-release/.gitignore",
      branch: "pre-release"
    });
  });

  it("parses https url without auth", () => {
    const url = "https://github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses ssh url", () => {
    const url = "git@github.com:owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "ssh",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses git+https url with username and password", () => {
    const url = "git+https://user:pass@github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "git+https",
      username: "user",
      password: "pass",
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("throws for invalid url", () => {
    expect(() => parseGitHubUrl("not-a-git-url")).toThrow("Invalid GitHub URL: not-a-git-url");
  });

  it("parses https url with extra path", () => {
    const url = "https://user:pass@github.com/owner/repo.git/some/path";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: "user",
      password: "pass",
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: "some/path",
      branch: null
    });
  });

  it("parses raw.githubusercontent.com url", () => {
    const url =
      "https://raw.githubusercontent.com/dimaslanjaka/git-command-helper/pre-release/.github/workflows/ci.yml";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "raw.githubusercontent.com",
      owner: "dimaslanjaka",
      repo: "git-command-helper",
      path: "pre-release/.github/workflows/ci.yml",
      branch: "pre-release"
    });
  });

  it("parses github.com raw url with refs heads branch", () => {
    const url = "https://github.com/dimaslanjaka/hexo-themes/raw/refs/heads/master/releases/hexo-theme-flowbite.tgz";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "dimaslanjaka",
      repo: "hexo-themes",
      path: "raw/refs/heads/master/releases/hexo-theme-flowbite.tgz",
      branch: "master"
    });
  });

  it("parses github.com raw url", () => {
    const url = "https://github.com/dimaslanjaka/git-command-helper/raw/pre-release/.github/workflows/ci.yml";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "dimaslanjaka",
      repo: "git-command-helper",
      path: "raw/pre-release/.github/workflows/ci.yml",
      branch: "pre-release"
    });
  });

  it("parses hash as branch (blob)", () => {
    const url =
      "https://github.com/dimaslanjaka/git-command-helper/blob/c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7/release/git-command-helper-1.0.13.tgz";
    const parsed = parseGitHubUrl(url);
    expect(parsed).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "dimaslanjaka",
      repo: "git-command-helper",
      path: "blob/c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7/release/git-command-helper-1.0.13.tgz",
      branch: "c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7"
    });
  });

  it("parses hash as branch (raw)", () => {
    const url =
      "https://raw.githubusercontent.com/dimaslanjaka/git-command-helper/c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7/.yarnrc.yml";
    const parsed = parseGitHubUrl(url);
    expect(parsed).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "raw.githubusercontent.com",
      owner: "dimaslanjaka",
      repo: "git-command-helper",
      path: "c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7/.yarnrc.yml",
      branch: "c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7"
    });
  });

  it("parses hash as branch (tree)", () => {
    const url = "https://github.com/dimaslanjaka/git-command-helper/tree/c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7/src";
    const parsed = parseGitHubUrl(url);
    expect(parsed).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "dimaslanjaka",
      repo: "git-command-helper",
      path: "tree/c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7/src",
      branch: "c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7"
    });
  });

  it("parses git protocol url", () => {
    const url = "git://github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "git",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses ssh protocol url", () => {
    const url = "ssh://git@github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "ssh",
      username: "git",
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses github url without .git suffix", () => {
    const url = "https://github.com/owner/repo";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses github url with trailing slash", () => {
    const url = "https://github.com/owner/repo/";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses github enterprise https url", () => {
    const url = "https://github.company.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.company.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses github enterprise ssh url", () => {
    const url = "git@github.company.com:owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "ssh",
      username: null,
      password: null,
      host: "github.company.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses archive refs heads url", () => {
    const url = "https://github.com/owner/repo/archive/refs/heads/main.zip";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: "archive/refs/heads/main.zip",
      branch: "main"
    });
  });

  it("parses releases download url", () => {
    const url = "https://github.com/owner/repo/releases/download/v1.0.0/app.zip";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: "releases/download/v1.0.0/app.zip",
      branch: null
    });
  });

  it("parses commit url", () => {
    const url = "https://github.com/owner/repo/commit/c3e7541";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: "commit/c3e7541",
      branch: null
    });
  });

  it("parses compare url", () => {
    const url = "https://github.com/owner/repo/compare/main...develop";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: "compare/main...develop",
      branch: null
    });
  });

  it("parses pull request url", () => {
    const url = "https://github.com/owner/repo/pull/123";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: "pull/123",
      branch: null
    });
  });

  it("parses issue url", () => {
    const url = "https://github.com/owner/repo/issues/123";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: null,
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: "issues/123",
      branch: null
    });
  });

  it("parses git+https url with token auth", () => {
    const url = "git+https://oauth2:ghp_123456789@github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "git+https",
      username: "oauth2",
      password: "ghp_123456789",
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses https url with github token auth", () => {
    const url = "https://username:ghp_123456789@github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "https",
      username: "username",
      password: "ghp_123456789",
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("parses ssh url with explicit git username", () => {
    const url = "ssh://git@github.com/owner/repo.git";
    expect(parseGitHubUrl(url)).toEqual({
      protocol: "ssh",
      username: "git",
      password: null,
      host: "github.com",
      owner: "owner",
      repo: "repo",
      path: null,
      branch: null
    });
  });

  it("throws for git protocol with auth", () => {
    const url = "git://user:token@github.com/owner/repo.git";
    expect(() => parseGitHubUrl(url)).toThrow(
      "Invalid GitHub URL: git://user:token@github.com/owner/repo.git"
    );
  });

  it("throws for ssh url with password auth", () => {
    const url = "ssh://user:token@github.com/owner/repo.git";
    expect(() => parseGitHubUrl(url)).toThrow(
      "Invalid GitHub URL: ssh://user:token@github.com/owner/repo.git"
    );
  });
});
