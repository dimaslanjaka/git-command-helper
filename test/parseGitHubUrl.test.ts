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
      path: null
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
      path: "tree/pre-release/.yarn/releases"
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
      path: "blob/pre-release/.gitignore"
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
      path: null
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
      path: null
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
      path: null
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
      path: "some/path"
    });
  });
});
