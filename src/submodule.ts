import { SpawnOptions } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import extractSubmodule from "./extract-submodule";
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
	 * @param optionSpawn
	 * @returns
	 */
	update(optionSpawn: SpawnOptions = { stdio: "inherit" }) {
		return spawn(
			"git",
			["submodule", "update", "-i", "-r"],
			this.spawnOpt(optionSpawn)
		);
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
