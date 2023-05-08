import { beforeAll, describe, expect, it } from '@jest/globals';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { getIgnores, isIgnored } from '../src/functions/gitignore';
import { testcfg } from './config';

describe('.gitignore test', () => {
  const ignoredFile = join(testcfg.cwd, 'file-ignore.txt');

  beforeAll(() => {
    writeFileSync(ignoredFile, '');
  });

  it('should have file-ignore.txt', async () => {
    const check = await getIgnores(testcfg);
    expect(check.includes('file-ignore.txt')).toBeTruthy();
  });

  it('should be ignored', async () => {
    const absolute = await isIgnored(ignoredFile);
    expect(absolute).toBeTruthy();
    const relative = await isIgnored('file-ignore.txt');
    expect(relative).toBeTruthy();
  });
});
