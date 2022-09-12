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
    static helper: typeof helper;
    constructor(dir: string);
    /**
     * git fetch
     * @param arg argument git-fetch, ex ['--all']
     * @param optionSpawn
     * @returns
     */
    fetch(arg?: string[], optionSpawn?: SpawnOptions): Bluebird<string>;
    pull(arg?: string[], optionSpawn?: SpawnOptions): Promise<string>;
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
    /**
     * git push
     * @param force
     * @param optionSpawn
     * @returns
     */
    push(force?: boolean, optionSpawn?: SpawnOptions): any;
    private spawnOpt;
    /**
     * git add
     * @param path specific path or argument -A
     * @param optionSpawn
     * @returns
     */
    add(path: string, optionSpawn?: SpawnOptions): Bluebird<string>;
    info(): Promise<{
        opt: {
            cwd: string;
            stdio: string;
        } & Record<string, any> & import("child_process").SpawnOptions;
        remote: {
            fetch: {
                origin: string;
                url: string;
            };
            push: {
                origin: string;
                url: string;
            };
        };
        branch: {
            active: boolean;
            branch: string;
        }[];
        status: StatusResult[];
    }>;
    /**
     * git checkout
     * @param branchName
     * @param optionSpawn
     * @returns
     */
    checkout(branchName: string, optionSpawn?: SpawnOptions): Promise<string>;
    /**
     * get current branch informations
     * @returns
     */
    getbranch(): Promise<{
        active: boolean;
        branch: string;
    }[]>;
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
    setremote(v: string | URL, name?: string, spawnOpt?: SpawnOptions): Promise<any>;
    /**
     * get remote information
     * @param args
     * @returns
     */
    getremote(args?: string[]): Promise<{
        fetch: {
            origin: string;
            url: string;
        };
        push: {
            origin: string;
            url: string;
        };
    }>;
    /**
     * set branch (git checkout branchName)
     * @param branchName
     * @returns
     */
    setbranch(branchName: string): Promise<string>;
    /**
     * Reset to latest commit of remote branch
     * @param branch
     */
    reset(branch?: string): Bluebird<string>;
}
export default git;
export declare const gitHelper: typeof git;
export declare const gitCommandHelper: typeof git;
