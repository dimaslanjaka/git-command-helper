import { spawnAsync } from 'cross-spawn';
import { applyTokenToOriginUrl } from '../../src/functions/origin-helper';
import { testcfg } from '../config';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('cross-spawn', () => ({
  spawnAsync: jest.fn()
}));

const mockedSpawnAsync = jest.mocked(spawnAsync);

describe('applyTokenToOriginUrl', () => {
  const originName = testcfg.originName;

  const spawnOpt = {
    cwd: testcfg.cwd,
    env: {
      ...process.env,
      GIT_PAGER: 'cat'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if remote is missing', async () => {
    const result = await applyTokenToOriginUrl('', 'token', originName, spawnOpt);

    expect(result.error).toBe(true);
    expect(result.message).toMatch(/Remote URL is missing/);
  });

  it('should return error if token is missing', async () => {
    const result = await applyTokenToOriginUrl('https://github.com/user/repo.git', '', originName, spawnOpt);

    expect(result.error).toBe(true);
    expect(result.message).toMatch(/Token is missing/);
  });

  it('should apply token if not present and update remote', async () => {
    mockedSpawnAsync.mockResolvedValueOnce({
      stdout: '',
      stderr: '',
      exitCode: 0
    } as any);

    const remote = 'https://github.com/user/repo.git';
    const token = 'mytoken';

    const result = await applyTokenToOriginUrl(remote, token, originName, spawnOpt);

    expect(result.error).toBe(false);
    expect(result.message).toMatch(/Token applied/);

    expect(mockedSpawnAsync).toHaveBeenCalledWith(
      'git',
      ['remote', 'set-url', originName, expect.stringContaining(token)],
      spawnOpt
    );
  });

  it('should not add colon if username is missing', async () => {
    mockedSpawnAsync.mockResolvedValueOnce({
      stdout: '',
      stderr: '',
      exitCode: 0
    } as any);

    const remote = 'https://github.com/user/repo.git';
    const token = 'mytoken';

    await applyTokenToOriginUrl(remote, token, originName, spawnOpt);

    const calls = mockedSpawnAsync.mock.calls;

    expect(calls[0]?.[1]?.[3]).not.toContain('https://:');
  });

  it('should return error if token already present', async () => {
    const remote = 'https://user:token@github.com/user/repo.git';
    const token = 'token';

    const result = await applyTokenToOriginUrl(remote, token, originName, spawnOpt);

    expect(result.error).toBe(true);
    expect(result.message).toMatch(/Token already present/);
  });

  it('should return error for invalid remote URL', async () => {
    const result = await applyTokenToOriginUrl('not-a-url', 'token', originName, spawnOpt);

    expect(result.error).toBe(true);
    expect(result.message).toMatch(/Failed to apply token/);
  });
});
