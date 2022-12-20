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
