export interface ParsedGitHubUrl {
  protocol: string;
  username: string | null;
  password: string | null;
  host: string;
  owner: string;
  repo: string;
  path: string | null;
  branch: string | null;
}

/**
 * Parses a GitHub URL and extracts its components, including username and password if present.
 *
 * @param url - The GitHub URL to parse.
 * @returns An object with the parsed components: { protocol, username, password, host, owner, repo, path }, or null if invalid.
 */
export function parseGitHubUrl(url: string): ParsedGitHubUrl {
  let match: RegExpMatchArray | null;

  const normalizeRawBranch = (rawPath: string) => {
    const segments = rawPath.split("/").filter(Boolean);
    if (segments[0] === "refs" && segments[1] === "heads" && segments.length >= 3) {
      return {
        branch: segments[2],
        extraPath: segments.slice(3).join("/") || null
      };
    }

    return {
      branch: segments[0] || "",
      extraPath: segments.slice(1).join("/") || null
    };
  };

  // Raw GitHub URLs: https://raw.githubusercontent.com/owner/repo/branch/path
  if ((match = url.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/(.+)$/))) {
    const owner = match[1];
    const repo = match[2];
    const rawPath = match[3];
    const { branch, extraPath } = normalizeRawBranch(rawPath);
    const path = rawPath.startsWith("refs/heads/") ? rawPath : extraPath ? branch + "/" + extraPath : branch;
    return {
      protocol: "https",
      username: null,
      password: null,
      host: "raw.githubusercontent.com",
      owner,
      repo,
      path,
      branch: branch || null
    };
  }

  // HTTPS or git+https
  if (
    (match = url.match(
      /^(https?|git\+https):\/\/(?:([^:@]+)(?::([^@]+))?@)?([^/]+)\/([^/]+)\/([^/.]+)(?:\.git)?(?:\/(.*))?$/
    ))
  ) {
    const protocol = match[1];
    const username = match[2];
    const password = match[3];
    const host = match[4];
    const owner = match[5];
    const repo = match[6];
    const extraPath = match[7];

    let branch: string | null = null;
    if (extraPath) {
      const branchMatch = extraPath.match(/^(tree|blob|raw|archive)\/(.+)$/);
      if (branchMatch) {
        const normalized = normalizeRawBranch(branchMatch[2]);
        branch = normalized.branch;
      }

      const archiveMatch = extraPath.match(/^archive\/refs\/heads\/([^/.]+)(?:\.zip)?$/);
      if (archiveMatch) {
        branch = archiveMatch[1];
      }
    }

    return {
      protocol,
      username: username || null,
      password: password || null,
      host,
      owner,
      repo,
      path: extraPath || null,
      branch
    };
  }

  // git://github.com/owner/repo.git (no auth allowed)
  if ((match = url.match(/^git:\/\/(?!.*@)([^/]+)\/([^/]+)\/([^/.]+)(?:\.git)?(?:\/(.*))?$/))) {
    const host = match[1];
    const owner = match[2];
    const repo = match[3];
    const extraPath = match[4];

    return {
      protocol: "git",
      username: null,
      password: null,
      host,
      owner,
      repo,
      path: extraPath || null,
      branch: null
    };
  }

  // ssh://git@github.com/owner/repo.git (username only, no password)
  if ((match = url.match(/^ssh:\/\/(?:([^:@/]+)@)?([^@/]+)\/([^/]+)\/([^/.]+)(?:\.git)?(?:\/(.*))?$/))) {
    const username = match[1];
    const host = match[2];
    const owner = match[3];
    const repo = match[4];
    const extraPath = match[5];

    return {
      protocol: "ssh",
      username: username || null,
      password: null,
      host,
      owner,
      repo,
      path: extraPath || null,
      branch: null
    };
  }

  // SSH: git@github.com:owner/repo(.git)(/path)?
  if ((match = url.match(/^git@([^:]+):([^/]+)\/([^/.]+)(?:\.git)?(?:\/(.*))?$/))) {
    const host = match[1];
    const owner = match[2];
    const repo = match[3];
    const extraPath = match[4];

    return {
      protocol: "ssh",
      username: null,
      password: null,
      host,
      owner,
      repo,
      path: extraPath || null,
      branch: null
    };
  }

  throw new Error("Invalid GitHub URL: " + url);
}

export default parseGitHubUrl;
