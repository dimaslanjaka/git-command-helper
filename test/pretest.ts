import path from 'path';
import gitHelper from '../src';
import clone from './clone';
import { TestConfig } from './config';

(async function () {
  // clone test repo
  await clone(TestConfig);
  const git = new gitHelper(TestConfig.cwd);
  await git.setremote(TestConfig.remote);
  await git.setbranch(TestConfig.branch);
  await git.setuser(TestConfig.username);
  await git.setemail(TestConfig.email);
  await git.fetch(['--all'], { stdio: 'pipe' }).then(console.log);

  // clone my github pages
  const obj = {
    cwd: path.join(__dirname, '../tmp', '.deploy_git'),
    branch: 'master',
    remote: `https://${process.env.ACCESS_TOKEN}@github.com/dimaslanjaka/dimaslanjaka.github.io.git`,
    user: 'dimaslanjaka',
    email: 'dimaslanjaka@gmail.com'
  };
  await clone(obj);
})();
