import spawnAsync from '@expo/spawn-async';

/**
 * check if can be pushed
 * @param originName origin name
 */
export async function dryRun(cwd: string) {
  const dry = await spawnAsync('git', ['push', '--dry-run'], { stdio: 'pipe', cwd });
  return dry.output.join('\n').trim() != 'Everything up-to-date';
}

export const isCanPush = { dryRun };
