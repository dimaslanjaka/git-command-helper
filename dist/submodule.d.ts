/// <reference types="node" />
/// <reference types="bluebird" />
import { SpawnOptions } from 'child_process';
export declare class submodule {
    cwd: string;
    hasConfig: boolean;
    constructor(cwd: string);
    private spawnOpt;
    /**
     * git submodule update
     * @param optionSpawn
     * @returns
     */
    update(optionSpawn?: SpawnOptions): import("bluebird")<string>;
    status(optionSpawn?: SpawnOptions): import("bluebird")<string>;
    /**
     * get submodule informations
     * @returns
     */
    get(): Promise<import("./extract-submodule").Submodule[]>;
}
export default submodule;
export declare const gitSubmodule: typeof submodule;
