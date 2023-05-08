import cp from 'cross-spawn';

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
