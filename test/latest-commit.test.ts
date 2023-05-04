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
    expect(await gh.latestCommit(undefined, { short: true })).toBe('ca0d4d0');
    expect(await gh.latestCommit(undefined, { short: false })).toBe('ca0d4d0343dfe8f2b1000e4085f5c2fc10e0f3d2');
    expect(await gh.latestCommit()).toBe('ca0d4d0');
  });

  it('README.md', async () => {
    const shortHash = await gh.latestCommit('README.md', { short: true });
    expect(shortHash).toBe('9e6355a');
    const longHash = await gh.latestCommit('README.md', { short: false });
    expect(longHash).toBe('9e6355ad21e9d555418c4092cb60b5a67242c676');
  });
});
