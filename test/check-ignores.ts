import fs from 'fs';
import path from 'upath';
import { isIgnored } from '../src/functions/gitignore';
import { testcfg } from './config';

(async function () {
  await import('./pretest');
  const ignoredFile = path.join(testcfg.cwd, 'file-ignore.txt');
  const ignoredFile2 = path.join(testcfg.cwd, 'file-ignore-another.txt');
  fs.writeFileSync(ignoredFile, '');
  fs.writeFileSync(ignoredFile2, '');
  // relative
  console.log([
    await isIgnored('file-ignore.txt', { cwd: testcfg.cwd }),
    await isIgnored('/file-ignore.txt', { cwd: testcfg.cwd }),
    await isIgnored('file-ignore.txt'),
    await isIgnored('/file-ignore.txt')
  ]);
})();
