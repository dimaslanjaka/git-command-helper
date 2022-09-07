import { spawn, SpawnOptions } from 'child_process';
import { Readable } from 'stream';

export class spawner {
  /**
   * promises spawn
   * @param options
   * @param cmd
   * @param args
   * @returns
   * @example
   * spawner.promise({}, 'git', 'log', '-n', '1').then(console.log);
   * spawner.promise({stdio:'pipe'}, 'git', 'submodule', 'status').then(console.log);
   */
  static promise(
    options: null | SpawnOptions = null,
    cmd: string,
    ...args: string[]
  ) {
    return new Promise(
      (
        resolve: (returnargs: {
          code: number;
          stdout: string[] | Readable;
          stderr: any;
        }) => any,
        reject: (returnargs: { args: string[]; err: Error }) => any
      ) => {
        if (options === null)
          options = {
            cwd: __dirname,
            stdio: 'inherit'
          };
        const stdouts: string[] = [];
        const stderrs: string[] = [];
        const child = spawn(cmd, args, options);
        // use event hooks to provide a callback to execute when data are available:
        if (child.stdout !== null)
          child.stdout.on('data', function (data) {
            stdouts.push(data.toString().trim());
          });
        if (child.stderr !== null)
          child.stderr.on('data', function (data) {
            stderrs.push(data.toString().trim());
          });
        child.on('close', function (code) {
          // Should probably be 'exit', not 'close'
          // *** Process completed
          return resolve({
            code: code,
            stdout: stdouts.length > 0 ? stdouts : child.stdout,
            stderr:
              stderrs.length > 0
                ? stderrs
                : stdouts.length === 0
                ? child.stderr
                : null
          });
        });
        child.on('error', function (err) {
          // *** Process creation failed
          return reject({ args: args, err: err });
        });
      }
    );
  }
}

export default spawner;
