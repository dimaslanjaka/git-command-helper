/**
 * get root directory of local repository
 * * see {@link https://stackoverflow.com/a/957978}
 * @returns
 */
export declare function getGithubRootDir(): Promise<string | void>;
/**
 * get origin url
 * * see {@link https://stackoverflow.com/a/4090938}
 * @param name remote name in config, default `origin`
 * @returns
 */
export declare function getGithubRemote(name?: string): Promise<string | void>;
/**
 * Get github url for single file or folder
 * @param path path subfolder or file
 */
export declare function getGithubRepoUrl(path: string): Promise<{
    remoteURL: string;
    rawURL: string;
}>;
/**
 * get current branch informations
 * @returns
 */
export declare function getGithubBranches(): Promise<void | {
    active: boolean;
    branch: string;
}[]>;
/**
 * get current branch
 * @returns
 */
export declare function getGithubCurrentBranch(): Promise<string | void>;
declare const GithubInfo: {
    getGithubCurrentBranch: typeof getGithubCurrentBranch;
    getGithubRemote: typeof getGithubRemote;
    getGithubRepoUrl: typeof getGithubRepoUrl;
    getGithubRootDir: typeof getGithubRootDir;
    getGithubBranches: typeof getGithubBranches;
};
export default GithubInfo;
