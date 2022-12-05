import fs from 'fs';
import 'nodejs-package-types';
import rm from 'rimraf';
import gitHelper from '../src';
import { TestConfig } from './config';

(async function () {
  rm(TestConfig.cwd, fs, function () {
    const github = new gitHelper(TestConfig.cwd);
    github.isExist().then(function (exist) {
      if (!exist) {
        github
          .init()
          .then(() => github.addSafe().catch(gitHelper.noop))
          .then(() => github.fetch())
          .catch(gitHelper.noop);
      }
    });
  });
})();
