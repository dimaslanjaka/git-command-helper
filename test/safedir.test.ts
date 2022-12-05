import gitHelper from '../src';
import { TestConfig } from './config';
import rm from 'rimraf';
import fs from 'fs';

(async function () {
  rm(TestConfig.cwd, fs, function () {
    const github = new gitHelper(TestConfig.cwd);
    github.isExist().then(function (exist) {
      if (!exist) github.init().then(github.addSafe).catch(gitHelper.noop);
    });
  });
})();
