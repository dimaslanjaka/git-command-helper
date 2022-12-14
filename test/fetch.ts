import gitHelper from '../src';
import { TestConfig } from './config';

(async function () {
  const git = new gitHelper(TestConfig.cwd);
  await git.setremote(TestConfig.remote);
  await git.setbranch(TestConfig.branch);
  await git.setuser(TestConfig.username);
  await git.setemail(TestConfig.email);
  await git.fetch(['--all'], { stdio: 'pipe' }).then(console.log);
})();
