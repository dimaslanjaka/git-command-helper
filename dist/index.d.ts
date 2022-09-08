/**
 * NodeJS GitHub Helper
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 */
import Bluebird from 'bluebird';
import helper from './helper';
import { shell } from './shell';
import { SpawnOptions } from './spawn';
import submodule from './submodule';
import { StatusResult } from './types';
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
    shell: typeof shell;
    helper: typeof helper;
    constructor(dir: string);
    /**
     * git fetch
     * @param arg argument git-fetch, ex ['--all']
     * @param optionSpawn
     * @returns
     */
    fetch(arg?: string[], optionSpawn?: SpawnOptions): Bluebird<string>;
    pull(arg?: string[], optionSpawn?: SpawnOptions): Bluebird<string>;
    /**
     * git commit
     * @param mode -am, -m, etc
     * @param msg commit messages
     * @param optionSpawn
     * @returns
     */
    commit(msg: string, mode?: 'am' | 'm' | string, optionSpawn?: SpawnOptions): Bluebird<string>;
    addAndCommit(path: string, msg: string): Bluebird<unknown>;
    /**
     * bulk add and commit
     * @param options
     * @returns
     */
    commits(options: {
        path: string;
        msg?: string;
        [key: string]: any;
    }[]): void;
    push(force?: boolean, optionSpawn?: SpawnOptions): Bluebird<string>;
    private spawnOpt;
    /**
     * git add
     * @param path specific path or argument -A
     * @param optionSpawn
     * @returns
     */
    add(path: string, optionSpawn?: SpawnOptions): Bluebird<string>;
    /**
     * git status
     * @returns
     */
    status(): Bluebird<StatusResult[]>;
    /**
     * git init
     * @returns
     */
    init(): Promise<string>;
    isExist(): Bluebird<boolean>;
    setcwd(v: string): void;
    setemail(v: string): void;
    setuser(v: string): void;
    /**
     * set remote url
     * @param v
     * @param name custom object name
     * @returns
     * @example
     * // default
     * git add remote origin https://
     * // custom name
     * git add remote customName https://
     */
    setremote(v: string | URL, name?: string): Bluebird<string>;
    setbranch(v: string): void;
    /**
     * Reset to latest commit of remote branch
     * @param branch
     */
    reset(branch?: string): Bluebird<string>;
}
export default git;
export declare const gitHelper: typeof git;
export declare const gitCommandHelper: typeof git;
