import { SpawnOptions } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import extractSubmodule from "./extract-submodule";
import { gitHelper, setupGit } from "./git";
import { spawn } from "./spawner";

export class submodule {
	cwd: string;
	hasConfig: boolean;
	constructor(cwd: string) {
		this.cwd = cwd;
		this.hasConfig = existsSync(join(this.cwd, ".gitmodules"));
	}

	private spawnOpt(opt: SpawnOptions = {}) {
		return Object.assign({ cwd: this.cwd, stdio: "pipe" } as SpawnOptions, opt);
	}

	hasSubmodule() {
		return existsSync(join(this.cwd, ".gitmodules"));
	}

	/**
	 * git submodule update
	 * @param args custom arguments
	 * @param optionSpawn
	 * @returns
	 */
	update(
		args: string[] = [],
		optionSpawn: SpawnOptions = { stdio: "inherit" }
	) {
		const arg = ["submodule", "update"];
		if (Array.isArray(args)) {
			args.forEach((str) => arg.push(str));
		} else {
			arg.push("-i", "-r");
		}
		return spawn("git", arg, this.spawnOpt(optionSpawn));
	}

	/**
	 * Update all submodule with cd method
	 */
	async safeUpdate() {
		const info = await this.get();
		while (info.length > 0) {
			const { url, root, branch } = info[0];
			const github = await setupGit({ url, branch, baseDir: root });
			await github.pull(["--recurse-submodule"]);
			info.shift();
		}
	}

	/**
	 * git submodule status
	 * @param optionSpawn
	 * @returns
	 */
	status(optionSpawn: SpawnOptions = { stdio: "inherit" }) {
		return spawn("git", ["submodule", "status"], this.spawnOpt(optionSpawn));
	}

	/**
	 * git add all each submodule
	 * @param pathOrArg ex: `-A`
	 * @returns
	 */
	addAll(pathOrArg: string) {
		return spawn("git", ["submodule", "foreach", "git", "add", pathOrArg]);
	}

	commitAll(msg: string) {
		return spawn("git", ["submodule", "foreach", "git", "commit", "-am", msg]);
	}

	/**
	 * get submodule informations
	 * @returns
	 */
	async get() {
		if (!this.hasSubmodule())
			throw new Error("This directory not have submodule installed");

		const extract = extractSubmodule(join(this.cwd, ".gitmodules"));
		return extract;
	}
}

export default submodule;
export const gitSubmodule = submodule;
