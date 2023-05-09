import { beforeAll, describe, expect, test } from '@jest/globals';
import { writeFileSync } from 'fs';
import { join } from 'path';
import git from '../src';
import { isUntracked } from '../src/functions/isFileChanged';
import clone from './clone';
import { testcfg } from './config';

describe('untrack', () => {
  let gh: git;
  beforeAll(async () => {
    gh = await clone();
    await gh.reset(testcfg.branch);
  });

  test('write new file', async () => {
    const newfile = join(testcfg.cwd, 'new.txt');
    writeFileSync(newfile, Math.random().toFixed(2));
    const result = await isUntracked('new.txt', { cwd: testcfg.cwd });
    expect(result).toBeTruthy();
  });

  test('file not found', async () => {
    const result = await isUntracked('newxxx.txt', { cwd: testcfg.cwd });
    expect(result).toBeFalsy();
  });
});
