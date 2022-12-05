import gitHelper from '../src';
import { TestConfig } from './config';
import rm from 'rimraf';
import fs from 'fs';

(async function () {
  rm(TestConfig.cwd, fs, noop);
  const git = new gitHelper(TestConfig.cwd);
  await git.init();
  await git.addSafe();
})();
