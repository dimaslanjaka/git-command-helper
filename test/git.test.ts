import { beforeAll, describe, expect, test } from '@jest/globals';
import path from 'node:path';
import { writefile } from 'sbg-utility';
import git, { gitCommandHelper } from '../src';
import { testcfg } from './config';

describe('main class', () => {
  let gh: git;
  beforeAll(() => {
    gh = new gitCommandHelper(testcfg.cwd, testcfg.branch);
  }, 90000);

  test('setAutoRebase()', () => gh.setAutoRebase());
  test('setForceLF()', () => gh.setForceLF());
  test('fetch()', () => gh.fetch(), 90000);
  test('pullAcceptTheirs()', () => gh.pullAcceptTheirs(), 90000);
  /*test('info()', async () => {
    const info = await gh.info();
    expect(info).toHaveProperty('root');
    expect(info).toHaveProperty('branch');
  }, 90000);*/
  test('isStaged()', async function () {
    const relativePath = 'sample/test_is_staged.js';
    const absolutePath = path.join(testcfg.cwd, relativePath);
    writefile(absolutePath, new Date().toISOString());
    await gh.add(relativePath);
    const isStaged = await gh.isStaged(relativePath);
    expect(isStaged).toBe(true);
  });
});
