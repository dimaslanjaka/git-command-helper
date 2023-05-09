import { getGithubBranches } from './functions/getGithubBranches';
import { getGithubCurrentBranch } from './functions/getGithubCurrentBranch';
import { getGithubRemote } from './functions/getGithubRemote';
import { getGithubRepoUrl } from './functions/getGithubRepoUrl';
import { getGithubRootDir } from './functions/getGithubRootDir';
declare const GithubInfo: {
    getIgnores: ({ cwd }: {
        cwd?: string;
    }) => Promise<string[]>;
    getGithubCurrentBranch: typeof getGithubCurrentBranch;
    getGithubRemote: typeof getGithubRemote;
    getGithubRepoUrl: typeof getGithubRepoUrl;
    getGithubRootDir: typeof getGithubRootDir;
    getGithubBranches: typeof getGithubBranches;
};
export default GithubInfo;
