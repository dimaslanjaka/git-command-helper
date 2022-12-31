import git, { gitCommandHelper, gitHelper, setupGit } from './git';
import {
  default as GithubInfo,
  getGithubBranches,
  getGithubCurrentBranch,
  getGithubRemote,
  getGithubRepoUrl,
  getGithubRootDir
} from './git-info';
import { spawn, spawnAsync, spawnSilent } from './spawn';
import { default as gitSubmodule } from './submodule';
export { SpawnOptions } from './spawn';

export const ext = {
  spawn,
  spawnAsync,
  spawnSilent,
  gitCommandHelper,
  gitHelper,
  setupGit,
  GithubInfo,
  getGithubBranches,
  getGithubCurrentBranch,
  getGithubRemote,
  getGithubRepoUrl,
  getGithubRootDir,
  gitSubmodule
};

export default git;
