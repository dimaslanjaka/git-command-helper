import { spawnAsync } from "../spawn";

export interface infoOptions extends spawnAsync.SpawnOptions {
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
