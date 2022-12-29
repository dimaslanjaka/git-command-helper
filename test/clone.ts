import { join } from 'path';
import { gitHelper, spawn } from '../src';
import { TestConfig } from './config';

async function clone() {
  await spawn('git', ['clone', TestConfig.remote, 'project-test'], { cwd: join(__dirname, '../tmp') });
  const github = new gitHelper(TestConfig.cwd);
  await github.setremote(TestConfig.remote);
  await github.setbranch(TestConfig.branch);
  await github.setuser(TestConfig.username);
  await github.setemail(TestConfig.email);
}

clone();
