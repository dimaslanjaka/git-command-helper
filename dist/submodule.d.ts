/// <reference types="node" />
/// <reference types="bluebird" />
import { SpawnOptions } from "child_process";
export declare class submodule {
    cwd: string;
    hasConfig: boolean;
    constructor(cwd: string);
    private spawnOpt;
    hasSubmodule(): boolean;
    /**
     * git submodule update
     * @param args custom arguments
     * @param optionSpawn
     * @returns
     */
    update(args?: string[], optionSpawn?: SpawnOptions): import("bluebird")<string>;
    /**
     * Update all submodule with cd method
     */
    safeUpdate(): Promise<void>;
    /**
     * git submodule status
     * @param optionSpawn
     * @returns
     */
    status(optionSpawn?: SpawnOptions): import("bluebird")<string>;
    /**
     * git add all each submodule
     * @param pathOrArg ex: `-A`
     * @returns
     */
    addAll(pathOrArg: string): import("bluebird")<string>;
    commitAll(msg: string): import("bluebird")<string>;
    /**
     * get submodule informations
     * @returns
     */
    get(): Promise<import("./extract-submodule").Submodule[]>;
}
export default submodule;
export declare const gitSubmodule: typeof submodule;
