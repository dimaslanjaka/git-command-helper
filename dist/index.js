"use strict";
/* eslint-disable no-control-regex */
/**
 * NodeJS GitHub Helper
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCommandHelper = exports.gitHelper = exports.git = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const fs_1 = require("fs");
const path_1 = require("path");
const helper_1 = __importDefault(require("./helper"));
const latestCommit_1 = require("./latestCommit");
const shell_1 = require("./shell");
const spawn_1 = require("./spawn");
const submodule_1 = __importDefault(require("./submodule"));
// module 'git-command-helper';
/**
 * GitHub Command Helper For NodeJS
 */
class git {
    constructor(dir) {
        this.latestCommit = latestCommit_1.latestCommit;
        this.helper = helper_1.default;
        this.cwd = dir;
        this.submodule = new submodule_1.default(dir);
        helper_1.default.suppress(() => this.isExist());
    }
    /**
     * git fetch
     * @param arg argument git-fetch, ex ['--all']
     * @param optionSpawn
     * @returns
     */
    fetch(arg, optionSpawn = { stdio: 'inherit' }) {
        let args = [];
        if (Array.isArray(arg))
            args = args.concat(arg);
        if (args.length === 0) {
            args.push('origin', this.branch);
        }
        return (0, spawn_1.spawn)('git', ['fetch'].concat(args), this.spawnOpt(optionSpawn));
    }
    async pull(arg, optionSpawn = { stdio: 'inherit' }) {
        let args = [];
        if (Array.isArray(arg))
            args = args.concat(arg);
        if (args.length === 0) {
            args.push('origin', this.branch);
        }
        const opt = this.spawnOpt(optionSpawn || { stdio: 'inherit' });
        try {
            return await (0, spawn_1.spawn)('git', ['pull'].concat(args), opt);
        }
        catch (e) {
            if (e instanceof Error) {
                if (opt.stdio === 'inherit')
                    console.log(e.message);
                return e.message;
            }
        }
    }
    /**
     * git commit
     * @param mode -am, -m, etc
     * @param msg commit messages
     * @param optionSpawn
     * @returns
     */
    commit(msg, mode = 'm', optionSpawn = { stdio: 'inherit' }) {
        if (!mode.startsWith('-'))
            mode = '-' + mode;
        return new bluebird_1.default((resolve, reject) => {
            const opt = this.spawnOpt(optionSpawn);
            const child = (0, spawn_1.spawn)('git', ['commit', mode, msg], opt);
            if (opt.stdio !== 'inherit') {
                child.then((str) => {
                    resolve(str);
                });
            }
            else {
                resolve();
            }
            child.catch(reject);
        });
    }
    addAndCommit(path, msg) {
        return new bluebird_1.default((resolve, reject) => {
            this.add(path, { stdio: 'pipe' }).then((_) => this.commit(msg, 'm', { stdio: 'pipe' }).then(resolve).catch(reject));
        });
    }
    /**
     * bulk add and commit
     * @param options array of `path` and `msg` commit message
     * @returns
     */
    commits(options) {
        const self = this;
        const errors = [];
        async function run() {
            if (options.length > 0) {
                try {
                    try {
                        return await self
                            .addAndCommit(options[0].path, options[0].msg || 'update ' + options[0].path + ' ' + new Date());
                    }
                    catch (e) {
                        errors.push(e);
                    }
                }
                finally {
                    options.shift();
                    return await run();
                }
            }
        }
        return new bluebird_1.default((resolve) => {
            run().then(() => resolve(errors));
        });
    }
    /**
     * git push
     * @param force
     * @param optionSpawn
     * @returns
     */
    async push(force = false, optionSpawn = { stdio: 'inherit' }) {
        let args = ['push'];
        if (force)
            args = args.concat('-f');
        const opt = this.spawnOpt(optionSpawn);
        try {
            return await (0, spawn_1.spawn)('git', args, opt);
        }
        catch (e) {
            if (e instanceof Error) {
                if (opt.stdio === 'inherit') {
                    console.log(e.message);
                }
                //console.log(e.message);
                if (/^error: failed to push some refs to/gim.test(e.message)) {
                    if (/the tip of your current branch is behind/gim.test(e.message)) {
                        return await this.push(true, opt);
                    }
                }
            }
        }
    }
    spawnOpt(opt = {}) {
        return Object.assign({ cwd: this.cwd, stdio: 'pipe' }, opt);
    }
    /**
     * git add
     * @param path specific path or argument -A
     * @param optionSpawn
     * @returns
     */
    add(path, optionSpawn = { stdio: 'inherit' }) {
        return (0, spawn_1.spawn)('git', ['add', path], this.spawnOpt(optionSpawn));
    }
    async info() {
        const opt = this.spawnOpt({ stdio: 'pipe' });
        return {
            opt,
            remote: await this.getremote(['-v']),
            branch: await this.getbranch(),
            status: await this.status()
        };
    }
    /**
     * git checkout
     * @param branchName
     * @param optionSpawn
     * @returns
     */
    async checkout(branchName, optionSpawn = { stdio: 'inherit' }) {
        return await (0, spawn_1.spawn)('git', ['checkout', branchName], this.spawnOpt(optionSpawn || {}));
    }
    /**
     * get current branch informations
     * @returns
     */
    async getbranch() {
        return await (0, spawn_1.spawn)('git', ['branch']).then((str) => str
            .split(/\n/)
            .map((str) => str.split(/\s/).map((str) => str.trim()))
            .filter((str) => str.length > 0)
            .map((item) => {
            return {
                active: item.length > 1,
                branch: item[1]
            };
        })
            .filter((item) => typeof item.branch === 'string'));
    }
    /**
     * git status
     * @returns
     */
    status() {
        const rgMod = /^(modified|added|deleted):/gim;
        const rgUntracked = /^untracked files:([\s\S]*?)\n\n/gim;
        return new bluebird_1.default((resolve, reject) => {
            (0, spawn_1.spawn)('git', ['status'], this.spawnOpt({ stdio: 'pipe' }))
                .then((response) => {
                const isMod = rgMod.test(response);
                if (isMod) {
                    // modded, added, deleted
                    const result = response
                        .split('\n')
                        .map((str) => str.trim())
                        .filter((str) => rgMod.test(str))
                        .map((str) => {
                        const split = str.split(/:\s+/);
                        return {
                            changes: split[0],
                            path: (split[1] || '').replace(/\(.*\)$/, '').trim()
                        };
                    });
                    resolve(result);
                }
                // untracked
                const result = (Array.from(response.match(rgUntracked) || [])[0] || '')
                    .split(/\n/)
                    .map((str) => str.trim())
                    .filter((str) => {
                    return !/^\(use/gim.test(str) && str.length > 0;
                })
                    .map((str) => {
                    if (!str.includes(':'))
                        return {
                            changes: 'untracked',
                            path: str
                        };
                })
                    .filter((str) => typeof str === 'object');
                resolve(result);
            })
                .catch(reject);
        });
    }
    /**
     * git init
     * @returns
     */
    async init() {
        return (0, spawn_1.spawn)('git', ['init'], this.spawnOpt());
    }
    isExist() {
        return new bluebird_1.default((resolve, reject) => {
            const folderExist = (0, fs_1.existsSync)((0, path_1.join)(this.cwd, '.git'));
            (0, spawn_1.spawn)('git', ['status'], this.spawnOpt({ stdio: 'pipe' }))
                .then((result) => {
                const match1 = /changes not staged for commit/gim.test(result);
                this.exist = match1 && folderExist;
                resolve(this.exist);
            })
                .catch(reject);
        });
    }
    setcwd(v) {
        this.cwd = v;
    }
    setemail(v) {
        this.email = v;
        (0, spawn_1.spawn)('git', ['config', 'user.email', this.email], this.spawnOpt());
    }
    setuser(v) {
        this.user = v;
        (0, spawn_1.spawn)('git', ['config', 'user.name', this.user], this.spawnOpt());
    }
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
    async setremote(v, name, spawnOpt = {}) {
        this.remote = v instanceof URL ? v.toString() : v;
        const opt = this.spawnOpt(Object.assign({ stdio: 'pipe' }, spawnOpt || {}));
        try {
            return await (0, spawn_1.spawn)('git', ['remote', 'add', name || 'origin', this.remote], opt);
        }
        catch (_a) {
            return await helper_1.default.suppress(() => (0, spawn_1.spawn)('git', ['remote', 'set-url', name || 'origin', this.remote], opt));
        }
    }
    /**
     * get remote information
     * @param args
     * @returns
     */
    async getremote(args) {
        try {
            const res = await (0, spawn_1.spawn)('git', ['remote'].concat(args || ['-v']), this.spawnOpt({ stdio: 'pipe' }));
            const result = {
                fetch: {
                    origin: '',
                    url: ''
                },
                push: {
                    origin: '',
                    url: ''
                }
            };
            res
                .split(/\n/gm)
                .filter((split) => split.length > 0)
                .map((splitted) => {
                let key;
                const nameUrl = splitted.split(/\t/).map((str) => {
                    const rg = /\((.*)\)/gm;
                    if (rg.test(str))
                        return str
                            .replace(rg, (whole, v1) => {
                            key = v1;
                            return '';
                        })
                            .trim();
                    return str.trim();
                });
                result[key] = {
                    origin: nameUrl[0],
                    url: nameUrl[1]
                };
            });
            return result;
        }
        catch (_a) {
            //
        }
    }
    /**
     * set branch (git checkout branchName)
     * @param branchName
     * @returns
     */
    async setbranch(branchName) {
        this.branch = branchName;
        return await (0, spawn_1.spawn)('git', ['checkout', this.branch], this.spawnOpt({ stdio: 'pipe' }));
    }
    /**
     * Reset to latest commit of remote branch
     * @param branch
     */
    reset(branch = this.branch) {
        return (0, spawn_1.spawn)('git', ['reset', '--hard', 'origin/' + branch || this.branch], {
            stdio: 'inherit',
            cwd: this.cwd
        });
    }
}
exports.git = git;
git.shell = shell_1.shell;
git.helper = helper_1.default;
exports.default = git;
exports.gitHelper = git;
exports.gitCommandHelper = git;
