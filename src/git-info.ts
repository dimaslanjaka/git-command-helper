import { getGithubBranches } from './functions/getGithubBranches';
import { getGithubCurrentBranch } from './functions/getGithubCurrentBranch';
import { getGithubRemote } from './functions/getGithubRemote';
import { getGithubRepoUrl } from './functions/getGithubRepoUrl';
import { getGithubRootDir } from './functions/getGithubRootDir';
import { getIgnores } from './functions/gitignore';

const GithubInfo = {
  getIgnores,
  getGithubCurrentBranch,
  getGithubRemote,
  getGithubRepoUrl,
  getGithubRootDir,
  getGithubBranches
};

export default GithubInfo;
