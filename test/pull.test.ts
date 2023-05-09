import { describe, expect, it, jest } from '@jest/globals';
import clone from './clone';
import { TestConfig } from './config';

describe('test pull', () => {
  jest.setTimeout(60000);
  it('should return true', async () => {
    const git = await clone();
    await git.setremote(TestConfig.remote);
    await git.setbranch(TestConfig.branch);
    await git.setuser(TestConfig.username);
    await git.setemail(TestConfig.email);
    const result = (await git.pull(['-X', 'theirs'], { stdio: 'pipe' })) || '';
    const updated = /^Already up to date.$/.test(result.trim());
    expect(updated).toBe(true);
    if (!updated) {
      console.log(result.trim());
    }
  });
});
