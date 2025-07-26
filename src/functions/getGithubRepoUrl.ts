import { trueCasePathSync } from "sbg-utility";
import { safeURL } from "../utils/safe-url";
import { getGithubCurrentBranch } from "./getGithubCurrentBranch";
import { getGithubRemote } from "./getGithubRemote";
import { getGithubRootDir } from "./getGithubRootDir";
import { infoOptions } from "./infoOptions";

/**
 * Get github url for single file or folder
 * @param repositoryPath path subfolder or file
 * @returns safe url
 */
export async function getGithubRepoUrl(repositoryPath: string, opt: infoOptions = { cwd: process.cwd() }) {
  repositoryPath = trueCasePathSync(repositoryPath);
  const root = trueCasePathSync((await getGithubRootDir(opt)) || "");
  const remote = ((await getGithubRemote(null, opt)) || "").replace(/(.git|\/)$/i, "");

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
