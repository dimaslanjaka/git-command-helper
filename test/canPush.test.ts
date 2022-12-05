import fs from 'fs';
import path from 'path';
import gitHelper from '../src';
import { TestConfig } from './config';

(async function () {
  const github = new gitHelper(TestConfig.cwd);
  await github.isExist().then(function (exist) {
    if (!exist) {
      github
        .init()
        .then(() => github.addSafe().catch(gitHelper.noop))
        .catch(gitHelper.noop);
    }
  });
  await github.setremote(TestConfig.remote).catch(gitHelper.noop);
  await github.fetch();
  await github.setbranch(TestConfig.branch).catch(gitHelper.noop);
  await github.setuser(TestConfig.username).catch(gitHelper.noop);
  await github.setemail(TestConfig.email).catch(gitHelper.noop);
  fs.writeFileSync(
    path.join(TestConfig.cwd, 'canPush.txt'),
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  const can = await github.canPush().catch(gitHelper.noop);
  console.log({ can });
})();
