import cp from 'cross-spawn';
import fs from 'fs';
import { minimatch } from 'minimatch';
import path from 'upath';
import { trueCasePathSync } from '../utils/case-path';
import { getGithubRootDir } from './getGithubRootDir';
import { infoOptions } from './infoOptions';

/**
 * get all ignored files by .gitignore
 * @param param0
 * @returns
 */
export const getIgnores = async ({ cwd = process.cwd() }) =>
  (await cp.async('git', 'status --porcelain --ignored'.split(' '), { cwd })).output
    .split(/\r?\n/)
    .map((str) => str.trim())
    .filter((str) => str.startsWith('!!'))
    .map((str) => str.replace(/!!\s+/, ''));

export type Return = {
  filter: {
    str: string;
    cwd: string;
    relativePath: string;
    matched: boolean;
  }[];
  result: boolean;
};

export async function isIgnored(filePath: string): Promise<boolean>;
export async function isIgnored(filePath: string, opt?: infoOptions): Promise<boolean | Return>;
export async function isIgnored(filePath: string, opt: { verbose: true }): Promise<Return>;
export async function isIgnored(filePath: string, opt: { verbose: false }): Promise<boolean>;
export async function isIgnored(filePath: string, { verbose = false }: infoOptions = {}) {
  const cwd = await getGithubRootDir({ cwd: path.dirname(filePath) });
  if (!cwd) throw new Error(filePath + ' is not inside git repository');

  const ignores = await getIgnores({ cwd });
  const filter = ignores.map((str) => {
    const unixPath = path.toUnix(trueCasePathSync(filePath));
    let relativePath = unixPath;
    if (fs.existsSync(unixPath)) {
      relativePath = unixPath.replace(cwd, '');
    }
    relativePath = relativePath.replace(/^\/+/, '');
    return {
      str,
      cwd,
      relativePath,
      matched: str === relativePath || relativePath.startsWith(str) || minimatch(relativePath, str)
    };
  });
  const result = filter.some((o) => o.matched);
  if (verbose) {
    return {
      filter,
      result
    };
  }
  return result;
}
