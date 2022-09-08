import Bluebird from 'bluebird';
import sysSpawn from 'cross-spawn';
declare type originalOpt = Parameters<typeof sysSpawn>[2];
export interface SpawnOptions extends originalOpt {
    [key: string]: any;
}
export default function promiseSpawn(command: string, args?: string[], options?: SpawnOptions): Bluebird<string>;
export declare const spawn: typeof promiseSpawn;
export {};
