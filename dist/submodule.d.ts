/// <reference types="node" />
import { SpawnOptions } from 'child_process';
export declare class submodule {
    cwd: string;
    hasConfig: boolean;
    constructor(cwd: string);
    private spawnOpt;
    update(optionSpawn?: SpawnOptions): Promise<string | void>;
    status(optionSpawn?: SpawnOptions): Promise<string | void>;
    /**
     * get submodule informations
     * @returns
     */
    get(): Promise<import("./extract-submodule").Submodule[]>;
}
export default submodule;
export declare const gitSubmodule: typeof submodule;
