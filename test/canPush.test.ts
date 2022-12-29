import fs from 'fs';
import path from 'path';
import gitHelper from '../src';
import { TestConfig } from './config';

(async function () {
  const github = new gitHelper(TestConfig.cwd);
  await github.setremote(TestConfig.remote);
  await github.setbranch(TestConfig.branch);
  await github.setuser(TestConfig.username);
  await github.setemail(TestConfig.email);
  const write = false;
  if (write) {
    fs.writeFileSync(
      path.join(TestConfig.cwd, 'canPush.txt'),
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
  await github.reset(TestConfig.branch);

  let can = await github.canPush();
  console.log('is can push after reset', can);

  fs.writeFileSync(
    path.join(TestConfig.cwd, 'canPush.txt'),
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  can = await github.canPush();
  console.log('is can push after modify file', can);

  await github.add('.');
  await github.commit('update test', 'm', { stdio: 'pipe' });
  can = await github.canPush();
  console.log('is can push after commit', can);
})();
