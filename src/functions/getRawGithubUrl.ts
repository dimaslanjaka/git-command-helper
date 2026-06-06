import path from "path";
import { execSync } from "child_process";
import { parseGitHubUrl } from "./parseGitHubUrl.js";

function run(cmd: string, cwd: string): string {
  return execSync(cmd, {
    cwd,
    encoding: "utf8" as const,
    stdio: ["ignore", "pipe", "ignore"] as const
  }).trim();
}

export interface GetRawGithubUrlOptions {
  branch?: string;
}

/**
 * Convert a local file path to its final raw GitHub URL (following redirects).
 * Resolves the file against the git repo root, reads the origin remote and
 * current branch (or a user-supplied branch), builds a raw.githubusercontent.com URL,
 * then follows any redirects to return the final URL.
 *
 * @param localFile - Absolute or relative path to a file inside a git repo
 * @param options - Options object
 * @param options.branch - Branch name (defaults to current branch or HEAD)
 * @returns Final raw GitHub URL after following redirects
 */
export async function getGithubRawUrl(localFile: string, options: GetRawGithubUrlOptions = {}): Promise<string> {
  const absFile = path.resolve(localFile);
  const cwd = path.dirname(absFile);

  const repoRoot = run("git rev-parse --show-toplevel", cwd);
  const remoteUrl = run("git remote get-url origin", repoRoot);

  const { owner, repo } = parseGitHubUrl(remoteUrl);

  const branch = options.branch || run("git branch --show-current", repoRoot) || run("git rev-parse HEAD", repoRoot);

  const relativePath = path.relative(repoRoot, absFile).replace(/\\/g, "/");

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${relativePath}`;

  try {
    const response = await fetch(rawUrl, { method: "HEAD", redirect: "follow" });
    return response.url || rawUrl;
  } catch {
    return rawUrl;
  }
}

export default getGithubRawUrl;
