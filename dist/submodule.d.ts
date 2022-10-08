/// <reference types="node" />
/// <reference types="bluebird" />
import { SpawnOptions } from "child_process";
import git from "./git";
export declare class submodule {
    cwd: string;
    hasConfig: boolean;
    private github;
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
     * @param reset do git reset --hard origin/branch ?
     */
    safeUpdate(reset?: boolean): Promise<void>;
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
    get(): ({
        branch: string;
        github: git;
    } & import("./extract-submodule").Submodule)[];
}
export default submodule;
export declare const gitSubmodule: typeof submodule;
