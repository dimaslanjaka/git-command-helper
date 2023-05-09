import path from 'upath';
import { spawnAsync } from '../spawn';
import { trueCasePathSync } from '../utils/case-path';
import { infoOptions } from './infoOptions';

/**
 * get root directory of local repository
 * * see {@link https://stackoverflow.com/a/957978}
 * @returns
 */
export async function getGithubRootDir(opt: infoOptions = {}) {
  if (!opt.cwd) opt.cwd = process.cwd();
  try {
    const result = await spawnAsync('git', ['rev-parse', '--show-toplevel'], opt);
    return path.toUnix(trueCasePathSync(result.stdout.trim()));
  } catch (err) {
    if (opt.throwable) throw err;
  }
}
