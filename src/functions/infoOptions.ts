import { StdioOptions } from "child_process";
import { spawnAsync } from "../spawn";

export interface ExtendedSpawnOptions extends spawnAsync.SpawnOptions {
  [key: string]: any;
  /**
   * make function throws when error occurs
   */
  throwable?: boolean;
  /**
   * verbose logging
   */
  verbose?: boolean;
  /**
   * environment variables to use for the spawn command
   * @default process.env
   */
  env?: { [key: string]: any };
  /**
   * stdio options for the spawn command
   */
  stdio?: StdioOptions | "inherit" | "pipe" | "ignore";
}
