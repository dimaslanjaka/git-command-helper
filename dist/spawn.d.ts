import Bluebird from 'bluebird';
import sysSpawn from 'cross-spawn';
export { default as spawnAsync } from '@expo/spawn-async';
type originalOpt = Parameters<typeof sysSpawn>[2];
export type SpawnOptions = Record<string, any> & originalOpt;
export default function promiseSpawn(command: string, args?: string[] | SpawnOptions, options?: SpawnOptions): Bluebird<string>;
export declare const spawn: typeof promiseSpawn;
export declare const spawnSilent: (command: string, args?: string[] | SpawnOptions, options?: SpawnOptions) => Promise<string | void>;
