import noop from './noop';
import { spawnAsync } from './spawn';

/**
 * get root directory of local repository
 * * see {@link https://stackoverflow.com/a/957978}
 * @returns
 */
export async function getGithubRootDir() {
  try {
    const result = await spawnAsync('git', 'rev-parse --show-toplevel'.split(' '));
    return result.stdout.trim();
  } catch (_) {
    return noop(_);
  }
}

/**
 * get origin url
 * * see {@link https://stackoverflow.com/a/4090938}
 * @param name remote name in config, default `origin`
 * @returns
 */
export async function getGithubRemote(name = 'origin') {
  try {
    const result = await spawnAsync('git', `config --get remote.${name}.url`.split(' '));
    return result.stdout.trim();
  } catch (_) {
    return noop(_);
  }
}
