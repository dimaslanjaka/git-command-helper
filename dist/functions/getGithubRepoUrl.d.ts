import { spawnAsync } from '../spawn';
/**
 * Get github url for single file or folder
 * @param path path subfolder or file
 */
export declare function getGithubRepoUrl(
  path: string,
  opt?: spawnAsync.SpawnOptions
): Promise<{
  remoteURL: string;
  rawURL: string;
}>;
