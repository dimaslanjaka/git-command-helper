import path from 'upath';
import { getGitignoreFiles } from '../src/functions/gitignore';

(async function () {
  const searchDir = path.join(__dirname, '..');
  const get = await getGitignoreFiles({ cwd: searchDir });
  console.log(get);
})();
