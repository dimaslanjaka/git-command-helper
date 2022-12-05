import gitHelper from '../src';
import { TestConfig } from './config';
import fs from 'fs';
import path from 'path';

(async function () {
  const git = new gitHelper(TestConfig.cwd);
  await git.setremote(TestConfig.remote);
  await git.setbranch(TestConfig.branch);
  await git.setuser(TestConfig.username);
  await git.setemail(TestConfig.email);
  fs.writeFileSync(path.join(TestConfig.cwd, 'canPush.txt'), Math.random().toString());
  const can = await git.canPush();
  console.log(can);
})();
