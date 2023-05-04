import { beforeAll, describe, expect, it } from '@jest/globals';
import git, { gitCommandHelper } from '../src';
import { TestConfig } from './config';

describe('latestCommit() - get latest commit', () => {
  let gh: git;
  beforeAll(async () => {
    gh = new gitCommandHelper(TestConfig.cwd);
    await gh.reset(TestConfig.branch);
  });

  it('root repository', async () => {
    const commit = await gh.latestCommit();
    expect(typeof commit === 'string').toBeTruthy();
    expect(commit).toBe('ca0d4d0');
  });

  it('README.md', async () => {
    const shortHash = await gh.latestCommit('README.md', { short: true });
    expect(shortHash).toBe('9e6355a');
    const longHash = await gh.latestCommit('README.md', { short: false });
    expect(longHash).toBe('9e6355ad21e9d555418c4092cb60b5a67242c676');
  });
});
