import path from "path";
import { execSync } from "child_process";
import axios from "axios";
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
  /** Working directory for resolving relative file paths (default: process.cwd()) */
  cwd?: string;
  /** Follow HTTP redirects to resolve the final URL (default: false) */
  followRedirect?: boolean;
}

/**
 * Convert a local file path to its final raw GitHub URL.
 * Resolves the file against the git repo root, reads the origin remote and
 * current branch (or a user-supplied branch), and builds a raw.githubusercontent.com URL.
 * Optionally follows HTTP redirects using axios to resolve the final URL.
 *
 * @param localFile - Absolute or relative path to a file inside a git repo
 * @param options - Options object
 * @param options.branch - Branch name (defaults to current branch or HEAD)
 * @param options.cwd - Working directory for resolving relative file paths
 * @param options.followRedirect - Follow HTTP redirects to resolve final URL (default: false)
 * @returns Raw GitHub URL, optionally resolved through redirects
 */
export async function getGithubRawUrl(localFile: string, options: GetRawGithubUrlOptions = {}): Promise<string> {
  const absFile = path.resolve(options.cwd || process.cwd(), localFile);
  const fileDir = path.dirname(absFile);

  const repoRoot = run("git rev-parse --show-toplevel", fileDir);
  const remoteUrl = run("git remote get-url origin", repoRoot);

  const { owner, repo } = parseGitHubUrl(remoteUrl);

  const branch = options.branch || run("git branch --show-current", repoRoot) || run("git rev-parse HEAD", repoRoot);

  const relativePath = path.relative(repoRoot, absFile).replace(/\\/g, "/");

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${relativePath}`;

  if (!options.followRedirect) {
    return rawUrl;
  }

  try {
    const response = await axios.get(rawUrl, { maxRedirects: 5 });
    return response.request.res.responseUrl || rawUrl;
  } catch {
    return rawUrl;
  }
}

export default getGithubRawUrl;
