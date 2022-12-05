import gitHelper from '../src';
import { TestConfig } from './config';

(async function () {
  const git = new gitHelper(TestConfig.cwd);
  await git.init();
  await git.addSafe();
})();
