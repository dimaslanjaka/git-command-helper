import { beforeAll, describe, expect, it } from '@jest/globals';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { getIgnores } from '../src/functions/gitignore';
import { testcfg } from './config';

describe('.gitignore test', () => {
  beforeAll(() => {
    writeFileSync(join(testcfg.cwd, 'file-ignore.txt'), '');
  });

  it('should have file-ignore.txt', async () => {
    const check = await getIgnores(testcfg);
    expect(check.includes('file-ignore.txt')).toBeTruthy();
  });
});
