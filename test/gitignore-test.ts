import Bluebird from 'bluebird';
import { glob } from 'glob';
import ignore from 'ignore';
import path from 'upath';
import { getGithubRootDir } from '../src';
import { getAllIgnoresConfig } from '../src/functions/gitignore';
import { trueCasePathSync } from '../src/utils/case-path';

(async function () {
  const searchDir = path.join(__dirname, '..');
  const searchDirRootGit = await getGithubRootDir({ cwd: searchDir });
  if (!searchDirRootGit) throw new Error('cwd/search dir is not git');

  const ignores = await getAllIgnoresConfig({ cwd: searchDir });
  const ig = ignore().add(ignores);
  const files = await glob.glob('**', {
    // Adds a / character to directory matches.
    mark: true,
    cwd: searchDir,
    ignore: ['**/node_modules/**', '**/docs/**'],
    posix: true
  });
  const filter = await Bluebird.all(files)
    .map(async (file) => {
      const absolute = trueCasePathSync(path.resolve(searchDir, file));
      const dirname = path.dirname(absolute);
      const rootGitOfFile = await getGithubRootDir({ cwd: dirname });
      // fail when root git is different
      if (searchDirRootGit !== rootGitOfFile) return '';
      const relative = path.relative(rootGitOfFile, absolute);
      if (ig.ignores(relative)) {
        return {
          absolute,
          relative: '/' + relative
        };
      } else {
        return '';
      }
    })
    .filter((item) => typeof item === 'object');
  console.log(filter);
})();
