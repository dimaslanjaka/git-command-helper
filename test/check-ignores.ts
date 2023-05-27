import fs from 'fs';
import path from 'upath';
import { spawnAsync } from '../src/cross-spawn/src/spawn';
import { getIgnores, isIgnored } from '../src/functions/gitignore';
import { testcfg } from './config';

(async function () {
  await spawnAsync('git', ['reset', '--hard', 'origin/' + testcfg.branch], { cwd: testcfg.cwd });
  const check = await getIgnores({ cwd: testcfg.cwd });
  const ignoredFile = path.join(testcfg.cwd, 'file-ignore.txt');
  const ignoredFile2 = path.join(testcfg.cwd, 'file-ignore-another.txt');
  fs.writeFileSync(ignoredFile, '');
  fs.writeFileSync(ignoredFile2, '');
  console.log(
    path.basename(ignoredFile),
    check.some((o) => o.relative.endsWith(path.basename(ignoredFile)))
  );
  console.log(
    path.basename(ignoredFile2),
    check.some((o) => o.relative.endsWith(path.basename(ignoredFile2)))
  );
  await (async () => {
    /**
     * this file should be indexed
     */
    const indexed = path.join(testcfg.cwd, 'new-file.txt');
    /**
     * this file should be ignored
     */
    const ignored = path.join(testcfg.cwd, 'new-file-another.txt');
    fs.writeFileSync(ignored, '');
    fs.writeFileSync(indexed, '');
    console.log({ ignored }, await isIgnored(ignored));
    console.log({ indexed }, await isIgnored(indexed));
  })();
})();
