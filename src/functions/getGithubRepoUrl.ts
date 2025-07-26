import { trueCasePathSync } from "sbg-utility";
import { safeURL } from "../utils/safe-url";
import { getGithubCurrentBranch } from "./getGithubCurrentBranch";
import { getGithubRemote } from "./getGithubRemote";
import { getGithubRootDir } from "./getGithubRootDir";
import { infoOptions } from "./infoOptions";

/**
 * Get GitHub URL for a single file or folder in a repository.
 *
 * @param repositoryPath - Absolute or relative path to the file or folder.
 * @param opt - Options for git operations. If not provided or missing `cwd`, defaults to `repositoryPath`.
 * @param remoteUrl - Optional remote URL to override the git config remote. Useful for testing or custom remotes.
 * @returns An object containing `remoteURL` (tree view) and `rawURL` (raw file view) for the file/folder on GitHub.
 */
export async function getGithubRepoUrl(repositoryPath: string, opt?: infoOptions, remoteUrl?: string) {
  repositoryPath = trueCasePathSync(repositoryPath);
  // Default cwd to repositoryPath if not set
  if (!opt || !opt.cwd) {
    opt = { ...(opt || {}), cwd: repositoryPath };
  }
  const root = trueCasePathSync((await getGithubRootDir(opt)) || "");
  const remote = (remoteUrl || (await getGithubRemote(null, opt)) || "").replace(/(.git|\/)$/i, "");

  let url = new URL(remote);
  url.pathname += "/tree/" + (await getGithubCurrentBranch(opt)) + repositoryPath.replace(root, "");
  /**
   * url from repository url
   */
  const remoteURL = safeURL(url.toString());
  url = new URL(remote);
  url.pathname += "/raw/" + (await getGithubCurrentBranch(opt)) + repositoryPath.replace(root, "");
  /**
   * url raw file
   */
  const rawURL = safeURL(url.toString());
  return {
    remoteURL,
    rawURL
  };
}
