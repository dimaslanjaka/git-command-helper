import { join } from 'path';
import { gitHelper } from '../src';

/**
 * Supress set remote test
 */

const git = new gitHelper(join(__dirname, '..'));
git
  .isExist()
  .then((ex) => {
    if (!ex) return git.init();
    return null;
  })
  .then(() => {
    git.setremote('https://github.com/dimaslanjaka/git-command-helper.git');
  });
