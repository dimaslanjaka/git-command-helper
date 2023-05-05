import noop from '../noop';
import { spawnAsync } from '../spawn';

/**
 * get root directory of local repository
 * * see {@link https://stackoverflow.com/a/957978}
 * @returns
 */
export async function getGithubRootDir(opt: spawnAsync.SpawnOptions = {}) {
  try {
    const result = await spawnAsync('git', 'rev-parse --show-toplevel'.split(' '), opt);
    return result.stdout.trim();
  } catch (err) {
    return noop(err);
  }
}
