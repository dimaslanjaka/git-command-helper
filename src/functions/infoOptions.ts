import { SpawnOptions, StdioOptions } from "child_process";

export interface ExtendedSpawnOptions extends SpawnOptions {
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
