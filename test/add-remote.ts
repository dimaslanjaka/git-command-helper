import { join } from 'path';
import { gitHelper } from '../src';
const git = new gitHelper(join(process.cwd(), 'tmp'));
git
  .isExist()
  .then((ex) => {
    if (!ex) return git.init();
    return null;
  })
  .then(() => {
    git.setremote('https://github.com/dimaslanjaka/git-command-helper.git');
  });
