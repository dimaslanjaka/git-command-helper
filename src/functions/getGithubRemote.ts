import _ from "lodash";
import { spawnAsync } from "../spawn";
import { safeURL } from "../utils/safe-url";
import { ExtendedSpawnOptions } from "./infoOptions";

/**
 * get origin url
 * * see {@link https://stackoverflow.com/a/4090938}
 * @param name remote name in config, default `origin`
 * @returns
 */
export async function getGithubRemote(name: string | null | undefined = "origin", opt: ExtendedSpawnOptions = {}) {
  try {
    if (!name) name = "origin";
    const result = await spawnAsync("git", `config --get remote.${name}.url`.split(" "), opt);
    return safeURL(result.stdout.trim());
  } catch (err) {
    if (opt.throwable) throw err;

    return _.noop(err);
  }
}
