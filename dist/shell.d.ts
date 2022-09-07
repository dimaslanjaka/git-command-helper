/// <reference types="node" />
import { SpawnOptions } from 'child_process';
/**
 * asynchronous spawner
 * @param cmd
 * @param args
 * @param opt
 * @returns
 */
export declare function shell(cmd: string, args: string[], opt?: SpawnOptions): Promise<string | void>;
