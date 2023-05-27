import fs from 'fs-extra';
import path from 'path';
import { spawnSilent } from '../spawn';

// src/functions/index.ts exports builder
// this only for development and excluded from build config

// create export
const contents = fs.readdirSync(__dirname).map((file) => {
  return `export * from './${file.replace(/.ts$/, '')}';`;
});
// dump
console.log(contents);
// fix eslint
contents.push('', '//', '');

fs.writeFileSync(path.join(__dirname, 'index.ts'), contents.join('\n'));

spawnSilent('eslint', ['--fix', 'src/**/*.ts'], { cwd: path.join(__dirname, '../..') });
