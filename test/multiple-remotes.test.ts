import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import git, { spawn } from '../src';
import clone from './clone';
import { testcfg } from './config';

describe('test multiple url', () => {
  let github: git;

  beforeAll(async () => {
    github = await clone();
    // set new remote upstream
    await github.setremote('https://github.com/dimaslanjaka/hexo', 'upstream');
  });

  afterAll(() => {
    // remove upstream
    spawn('git', ['remote', 'remove', 'upstream'], { cwd: testcfg.cwd });
  });

  it('should valid origin', async () => {
    expect((await github.getremote())?.push.url).toBe(testcfg.remote);
  });

  it('should valid upstream', async () => {
    expect(await github.getremote('upstream')).toBe('https://github.com/dimaslanjaka/hexo');
  });
});
