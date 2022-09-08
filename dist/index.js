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
        this.shell = shell_1.shell;
        this.cwd = dir;
        this.submodule = new submodule_1.default(dir);
        this.isExist();
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
    pull(arg, optionSpawn = { stdio: 'inherit' }) {
        let args = [];
        if (Array.isArray(arg))
            args = args.concat(arg);
        if (args.length === 0) {
            args.push('origin', this.branch);
        }
        return (0, spawn_1.spawn)('git', ['pull'].concat(args), this.spawnOpt(optionSpawn));
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
     * @param options
     * @returns
     */
    commits(options) {
        const self = this;
        function run() {
            if (options.length > 0) {
                self
                    .addAndCommit(options[0].path, options[0].msg || 'update ' + new Date())
                    .finally(() => {
                    options.shift();
                    run();
                });
            }
        }
        return run();
    }
    push(force = false, optionSpawn = { stdio: 'inherit' }) {
        let args = ['push'];
        if (force)
            args = args.concat('-f');
        return (0, spawn_1.spawn)('git', args, this.spawnOpt(optionSpawn));
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
    /**
     * git status
     * @returns
     */
    status() {
        return new bluebird_1.default((resolve, reject) => {
            (0, spawn_1.spawn)('git', ['status'], this.spawnOpt({ stdio: 'pipe' }))
                .then((response) => {
                const result = response
                    .split('\n')
                    .map((str) => str.trim())
                    .filter((str_1) => /^(modified|added|deleted|untracked):/.test(str_1))
                    .map((str) => {
                    const split = str.split(/:\s+/);
                    return {
                        changes: split[0],
                        path: split[1].replace(/\(.*\)$/, '').trim()
                    };
                });
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
    async isExist() {
        const folderExist = (0, fs_1.existsSync)((0, path_1.join)(this.cwd, '.git'));
        const result = await (0, spawn_1.spawn)('git', ['status'], this.spawnOpt({ stdio: 'pipe' }));
        const match1 = /changes not staged for commit/gim.test(result);
        this.exist = match1 && folderExist;
        return this.exist;
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
    setremote(v, name) {
        this.remote = v instanceof URL ? v.toString() : v;
        try {
            return (0, spawn_1.spawn)('git', ['remote', 'add', name || 'origin', this.remote], this.spawnOpt());
        }
        catch (_) {
            return (0, spawn_1.spawn)('git', ['remote', 'set-url', name || 'origin', this.remote], this.spawnOpt());
        }
    }
    setbranch(v) {
        this.branch = v;
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
exports.default = git;
exports.gitHelper = git;
exports.gitCommandHelper = git;
