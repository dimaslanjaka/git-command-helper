/**
 * NodeJS GitHub Helper
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 */
/// <reference types="node" />
import { SpawnOptions } from 'child_process';
import submodule from './submodule';
/**
 * GitHub Command Helper For NodeJS
 */
export declare class git {
    submodule: submodule;
    user: string;
    email: string;
    remote: string;
    branch: string;
    private exist;
    cwd: string;
    latestCommit: (path?: string, options?: Partial<import("./latestCommit").GetLatestCommitHashOptions>) => Promise<string>;
    constructor(dir: string);
    fetch(arg?: string[], optionSpawn?: SpawnOptions): Promise<string>;
    pull(arg?: string[], optionSpawn?: SpawnOptions): Promise<string>;
    /**
     * git commit
     * @param msg commit messages
     * @param optionSpawn
     * @returns
     */
    commit(msg: string, optionSpawn?: SpawnOptions): Promise<string>;
    push(force?: boolean, optionSpawn?: SpawnOptions): Promise<string>;
    private spawnOpt;
    /**
     * git add
     * @param path specific path or argument -A
     * @param optionSpawn
     * @returns
     */
    add(path: string, optionSpawn?: SpawnOptions): Promise<string>;
    /**
     * git init
     * @returns
     */
    init(): Promise<string>;
    isExist(): Promise<boolean>;
    setcwd(v: string): void;
    setemail(v: string): void;
    setuser(v: string): void;
    setremote(v: string | URL): Promise<string | void>;
    setbranch(v: string): void;
    /**
     * Reset to latest commit of remote branch
     * @param branch
     */
    reset(branch?: string): void;
}
export default git;
export declare const gitHelper: typeof git;
export declare const gitCommandHelper: typeof git;
