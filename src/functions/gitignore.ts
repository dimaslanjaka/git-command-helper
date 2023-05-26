import fs from 'fs-extra';
import * as glob from 'glob';
import { minimatch } from 'minimatch';
import path from 'upath';
import * as cp from '../cross-spawn/src';
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
    relativePath: string;
    matched: boolean;
  }[];
  result: boolean;
  /**
   * root directory of git
   */
  root: string;
};

export type isIgnoredOpt = infoOptions & Parameters<typeof getAllIgnoresConfig>[0];

export async function isIgnored(filePath: string): Promise<boolean>;
export async function isIgnored(filePath: string, opt?: isIgnoredOpt): Promise<boolean | Return>;
export async function isIgnored(filePath: string, opt: { verbose: true }): Promise<Return>;
export async function isIgnored(filePath: string, opt: { verbose: false }): Promise<boolean>;
export async function isIgnored(filePath: string, options: isIgnoredOpt = {}) {
  let cwd = (await getGithubRootDir({ cwd: path.dirname(filePath) })) || '';
  if (cwd.length === 0) {
    const err = new Error(path.toUnix(filePath) + ' is not inside git repository');
    if (options.throwable) {
      throw err;
    } else {
      console.log({ error: err, cwd: path.dirname(filePath) });
    }

    // cwd fallback to process.cwd
    cwd = process.cwd();
  }

  const ignores = await getIgnores({ cwd });
  const filter = ignores.map((str) => {
    const unixPath = path.toUnix(trueCasePathSync(filePath));
    let relativePath = unixPath;
    if (fs.existsSync(unixPath)) {
      relativePath = unixPath.replace(cwd, '');
    }
    relativePath = relativePath.replace(/^\/+/, '');

    const matches: boolean[] = [];
    const patterns = getAllIgnoresConfig(options);
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      if (pattern === '*') continue;
      const matched = minimatch(relativePath, pattern, { nonegate: true });
      if (matched && options.verbose) console.log(pattern, matched);
      matches.push(matched);
    }

    return {
      str,
      relativePath,
      matched: str === relativePath || matches.some((b) => b === true)
    };
  });
  const result = filter.some((o) => o.matched);
  if (options.verbose) {
    return {
      root: cwd,
      filter,
      result
    };
  }
  return result;
}

/**
 * get and parse all `.gitignore` files
 */
export function getAllIgnoresConfig(options: glob.GlobOptionsWithFileTypesFalse) {
  const files = glob
    .globSync('**/.gitignore', options)
    .filter((str) => typeof str === 'string')
    .map((file) => path.toUnix(options.cwd ? trueCasePathSync(file, String(options.cwd)) : trueCasePathSync(file)));
  const lines = files
    .map((file) =>
      fs
        .readFileSync(file, 'utf-8')
        .split(/\r?\n/gm)
        .map((str) => str.trim())
    )
    .flat()
    .filter((str) => str.length > 0 && !str.startsWith('#'));
  return lines;
}
