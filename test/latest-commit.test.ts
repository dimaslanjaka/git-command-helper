import { beforeAll, describe, expect, it } from '@jest/globals';
import git, { gitCommandHelper } from '../src';
import { TestConfig } from './config';

describe('latestCommit() - get latest commit', () => {
  let gh: git;
  beforeAll(async () => {
    gh = new gitCommandHelper(TestConfig.cwd, TestConfig.branch);
    await gh.reset(TestConfig.branch);
  });

  it('root repository', async () => {
    expect(await gh.latestCommit(undefined, { short: true })).toBe('def54d6c');
    expect(await gh.latestCommit(undefined, { short: false })).toBe('def54d6c2839626137ed73f93075ab3325d11408');
    expect(await gh.latestCommit()).toBe('def54d6c');
  });

  it('README.md', async () => {
    const shortHash = await gh.latestCommit('README.md', { short: true });
    expect(shortHash).toBe('9e6355ad');
    const longHash = await gh.latestCommit('README.md', { short: false });
    expect(longHash).toBe('9e6355ad21e9d555418c4092cb60b5a67242c676');
  });
});
