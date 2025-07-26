import { spawnAsync } from "cross-spawn";
import { ExtendedSpawnOptions } from "./infoOptions";

/**
 * Apply a username to a remote Git URL and update the remote config if possible.
 *
 * @param remote - The remote URL string.
 * @param user - The username to apply.
 * @param originName - The remote name, defaults to "origin".
 * @param spawnOpt - Options for the spawn function (optional).
 * @returns True if user was applied and remote updated, false otherwise.
 */
export async function applyUserToOriginUrl(
  remote?: string,
  user?: string,
  originName: string = "origin",
  spawnOpt?: ExtendedSpawnOptions
): Promise<{ error: boolean; message: string }> {
  if (!remote || String(remote).trim() === "") {
    return { error: true, message: "Remote URL is missing." };
  }
  if (!user || String(user).trim() === "") {
    return { error: true, message: "User is missing." };
  }
  try {
    const urlObj = new URL(remote);
    // Only set username if not already present
    if (!urlObj.username) {
      urlObj.username = user;
      const newRemote = urlObj.toString();
      await spawnAsync("git", ["remote", "set-url", originName, newRemote], spawnOpt);
      return { error: false, message: `Username '${user}' applied to remote '${originName}'.` };
    }
    // Username already present, nothing changed
    return { error: true, message: "Username already present in remote URL." };
  } catch (err: any) {
    // Not a valid URL, do nothing
    return { error: true, message: `Failed to apply username: ${err?.message || "Invalid remote URL."}` };
  }
}

/**
 * Apply a token (as password) to a remote Git URL and update the remote config if possible.
 *
 * @param remote - The remote URL string.
 * @param token - The token to apply as password.
 * @param originName - The remote name, defaults to "origin".
 * @param spawnOpt - Options for the spawn function (optional).
 * @returns An object with error status and message.
 */
export async function applyTokenToOriginUrl(
  remote?: string,
  token?: string,
  originName: string = "origin",
  spawnOpt?: ExtendedSpawnOptions
): Promise<{ error: boolean; message: string }> {
  if (!remote || String(remote).trim() === "") {
    return { error: true, message: "Remote URL is missing." };
  }
  if (!token || String(token).trim() === "") {
    return { error: true, message: "Token is missing." };
  }
  try {
    const urlObj = new URL(remote);
    // Only set password if not already present
    if (!urlObj.password) {
      urlObj.password = token;
      let newRemote = urlObj.toString();
      // Remove colon when username not present
      if (!urlObj.username) {
        newRemote = newRemote.replace("https://:", "https://"); // Ensure no colon after protocol if no username
      }
      await spawnAsync("git", ["remote", "set-url", originName, newRemote], spawnOpt);
      return { error: false, message: `Token applied to remote '${originName}'.` };
    }
    // Token already present, nothing changed
    return { error: true, message: "Token already present in remote URL." };
  } catch (err: any) {
    return { error: true, message: `Failed to apply token: ${err?.message || "Invalid remote URL."}` };
  }
}
