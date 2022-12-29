import { rm } from 'fs/promises';
import { join } from 'path';
import { spawn } from '../src';
import { TestConfig } from './config';

async function clone() {
  await rm(join(__dirname, '../tmp/project-test'), { recursive: true, force: true });
  await spawn('git', ['clone', '-b', TestConfig.branch, TestConfig.remote, 'tmp/project-test'], {
    cwd: join(__dirname, '../')
  });
}

export default clone;
