import Bluebird from 'bluebird';
import crossSpawn from 'cross-spawn';
declare type originalOpt = Parameters<typeof crossSpawn>[2];
export interface SpawnOptions extends originalOpt {
    [key: string]: any;
}
export default function promiseSpawn(command: string, args?: string[], options?: SpawnOptions): Bluebird<string>;
export declare const spawn: typeof promiseSpawn;
export {};
