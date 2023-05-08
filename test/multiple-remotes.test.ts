import { beforeAll, describe, expect, it } from '@jest/globals';
import { gitHelper } from '../src';
import { testcfg } from './config';

describe('test multiple url', () => {
  const github = new gitHelper(testcfg.cwd);

  beforeAll(async () => {
    // set new remote
    await github.setremote('https://github.com/dimaslanjaka/hexo', 'upstream');
  });

  it('should valid origin', async () => {
    // github.getGithubRemote().then(console.log);
    expect((await github.getremote())?.push.url).toBe(testcfg.remote);
  });
});
