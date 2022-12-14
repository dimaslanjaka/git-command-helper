/// <reference types="node" />
import Bluebird from 'bluebird';
import { CommonSpawnOptions } from 'child_process';
export { default as spawnAsync } from '@expo/spawn-async';
export type SpawnOptions = Record<string, any> & CommonSpawnOptions;
export default function promiseSpawn(command: string, args?: string[] | SpawnOptions, options?: SpawnOptions): Bluebird<string>;
export declare const spawn: typeof promiseSpawn;
export declare const spawnSilent: (command: string, args?: string[] | SpawnOptions, options?: SpawnOptions) => Promise<string | void>;
