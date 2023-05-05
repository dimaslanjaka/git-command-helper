import { trueCasePathSync } from 'true-case-path';
import { spawnAsync } from '../spawn';
import { getGithubCurrentBranch } from './getGithubCurrentBranch';
import { getGithubRemote } from './getGithubRemote';
import { getGithubRootDir } from './getGithubRootDir';

/**
 * Get github url for single file or folder
 * @param path path subfolder or file
 */
export async function getGithubRepoUrl(path: string, opt: spawnAsync.SpawnOptions = {}) {
  path = trueCasePathSync(path);
  const root = trueCasePathSync((await getGithubRootDir(opt)) || '');
  const remote = ((await getGithubRemote(null, opt)) || '').replace(/(.git|\/)$/i, '');

  let url = new URL(remote);
  url.pathname += '/tree/' + (await getGithubCurrentBranch(opt)) + path.replace(root, '');
  const remoteURL = url.toString();
  url = new URL(remote);
  url.pathname += '/raw/' + (await getGithubCurrentBranch(opt)) + path.replace(root, '');
  const rawURL = url.toString();
  return {
    remoteURL,
    rawURL
  };
}
