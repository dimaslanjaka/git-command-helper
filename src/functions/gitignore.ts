import Bluebird from 'bluebird';
import fs from 'fs-extra';
import * as glob from 'glob';
import ignore from 'ignore';
import path from 'upath';
import { trueCasePathSync } from '../utils/case-path';
import { getGithubRootDir } from './getGithubRootDir';
import { infoOptions } from './infoOptions';

/**
 * get all ignored files by .gitignore
 * @param param0
 * @returns
 */
export const getIgnores = async ({ cwd = process.cwd() }) => {
  const searchDir = cwd;
  const searchDirRootGit = await getGithubRootDir({ cwd: searchDir });
  if (!searchDirRootGit) throw new Error('cwd/search dir is not git');

  const ignores = await getAllIgnoresConfig({ cwd: searchDir });
  const ig = ignore().add(ignores);
  const files = await glob.glob('**', {
    // Adds a / character to directory matches.
    mark: true,
    cwd: searchDir,
    ignore: ['**/node_modules/**', '**/docs/**'],
    posix: true
  });
  return Bluebird.all(files)
    .map(async (file) => {
      const absolute = trueCasePathSync(path.resolve(searchDir, file));
      const dirname = path.dirname(absolute);
      const rootGitOfFile = await getGithubRootDir({ cwd: dirname });
      // fail when root git is different
      if (searchDirRootGit !== rootGitOfFile) return '';
      const relative = path.relative(rootGitOfFile, absolute);
      if (ig.ignores(relative)) {
        return {
          absolute,
          relative: '/' + relative
        };
      } else {
        return '';
      }
    })
    .filter((item) => typeof item === 'object') as Bluebird<
    {
      absolute: string;
      relative: string;
    }[]
  >;
};

export type Return = {
  filter: {
    str: string;
    relativePath: string;
    matched: boolean;
  }[];
  result: boolean;
  /**
   * current working directory of git
   */
  cwd: string;
};

export type isIgnoredOpt = infoOptions & Parameters<typeof getAllIgnoresConfig>[0];

export async function isIgnored(filePath: string) {
  const cwd = (await getGithubRootDir({ cwd: path.dirname(filePath) })) || '';

  const ig = ignore().add(await getAllIgnoresConfig({ cwd }));
  return ig.ignores(path.relative(cwd, filePath));
}

/**
 * get and parse all `.gitignore` files
 */
export async function getAllIgnoresConfig(options: glob.GlobOptionsWithFileTypesFalse) {
  const files = await getGitignoreFiles(options);
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

/**
 * get all `.gitignore` files
 * @param searchDir
 * @returns
 */
export function getGitignoreFiles(opt: glob.GlobOptionsWithFileTypesFalse): Promise<string[]> {
  const searchDirRootGit = getGithubRootDir(opt);
  return new Bluebird((res) => {
    const ignore = ['**/node_modules/**'];
    if (Array.isArray(opt.ignore)) {
      ignore.push(...opt.ignore);
    } else if (typeof opt.ignore === 'string') {
      ignore.push(opt.ignore);
    }
    Bluebird.resolve(
      glob.glob(
        '**/.gitignore',
        Object.assign({ cwd: opt.cwd }, opt, {
          posix: true,
          ignore
        })
      )
    )
      .then((result) => {
        return Bluebird.all(
          result.map(async (filePath) => {
            const absolute = path.join(opt.cwd, filePath);
            const dirname = path.dirname(absolute);

            const rootGitOfFile = await getGithubRootDir({ cwd: dirname });
            if (rootGitOfFile !== (await searchDirRootGit)) return;
            return trueCasePathSync(absolute);
          })
        ).filter((o) => typeof o !== 'undefined') as Bluebird<string[]>;
      })
      .then((o) => res(o));
  });
}
