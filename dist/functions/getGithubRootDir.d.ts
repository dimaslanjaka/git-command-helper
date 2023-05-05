import { spawnAsync } from '../spawn';
/**
 * get root directory of local repository
 * * see {@link https://stackoverflow.com/a/957978}
 * @returns
 */
export declare function getGithubRootDir(opt?: spawnAsync.SpawnOptions): Promise<string | void>;
