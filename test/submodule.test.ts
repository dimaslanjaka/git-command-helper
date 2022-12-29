import gitHelper from '../src';
import clone from './clone';
import { TestConfig } from './config';

describe('test pull', () => {
  jest.setTimeout(60000);
  let github: gitHelper;

  beforeAll(async function () {
    await clone();
  });

  beforeEach(async function () {
    github = new gitHelper(TestConfig.cwd);
    await github.setremote(TestConfig.remote);
    await github.setbranch(TestConfig.branch);
    await github.setuser(TestConfig.username);
    await github.setemail(TestConfig.email);
  });

  it('should return true', async () => {
    expect(github.submodule.hasSubmodule()).toBe(false);
  });
});
