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
});
