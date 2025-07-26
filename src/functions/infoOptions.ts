import { spawnAsync } from "../spawn";

export interface ExtendedSpawnOptions extends spawnAsync.SpawnOptions {
  [key: string]: any;
  /**
   * make function throws when error occurs
   */
  throwable?: boolean;
  /**
   * verbose
   */
  verbose?: boolean;
}
