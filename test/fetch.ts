import gitHelper from '../dist';
import { configTest } from './config';

const git = new gitHelper(configTest.cwd);
git.fetch(['--all']);
