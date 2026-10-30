export interface ParsedGitHubUrl {
  protocol: string;
  username: string | null;
  password: string | null;
  host: string;
  owner: string;
  repo: string;
  path: string | null;

  /** Backward compatibility: branch name. */
  branch: string | null;

  /** Git reference name (branch, tag, etc.). */
  ref: string | null;

  /** Git reference type: heads, tags, pull, etc. */
  refType: string | null;

  /** GitHub URL action: tree, blob, raw, archive, etc. */
  action: string | null;
}

interface ParsedReference {
  ref: string | null;
  refType: string | null;
  path: string | null;
}

/**
 * Parses a Git reference and separates it from the remaining file path.
 */
function parseReference(rawPath: string): ParsedReference {
  const segments = rawPath.split('/').filter(Boolean);

  if (!segments.length) {
    return { ref: null, refType: null, path: null };
  }

  // Explicit Git references:
  // refs/heads/main
  // refs/tags/v1.0.0
  // refs/pull/123/head
  if (segments[0] === 'refs' && segments.length >= 3) {
    return {
      ref: segments[2],
      refType: segments[1],
      path: segments.slice(3).join('/') || null
    };
  }

  // Conventional GitHub URLs:
  // tree/main/file
  // blob/main/file
  // raw/main/file
  return {
    ref: segments[0],
    refType: 'heads',
    path: segments.slice(1).join('/') || null
  };
}

/**
 * Parses a GitHub URL and extracts its components.
 *
 * Supported URL formats:
 *
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/tree/main/path
 * - https://github.com/owner/repo/blob/main/file
 * - https://github.com/owner/repo/raw/refs/heads/main/file
 * - https://github.com/owner/repo/archive/refs/heads/main.zip
 * - https://github.com/owner/repo/archive/refs/tags/v1.0.0.zip
 * - https://raw.githubusercontent.com/owner/repo/main/file
 * - git+https://github.com/owner/repo.git
 * - git://github.com/owner/repo.git
 * - ssh://git@github.com/owner/repo.git
 * - git@github.com:owner/repo.git
 *
 * @param url - GitHub URL to parse.
 * @returns Parsed GitHub URL components.
 * @throws Error if the URL is invalid.
 */
export function parseGitHubUrl(url: string): ParsedGitHubUrl {
  let match: RegExpMatchArray | null;

  const createResult = (
    protocol: string,
    username: string | null,
    password: string | null,
    host: string,
    owner: string,
    repo: string,
    path: string | null,
    action: string | null = null,
    ref: string | null = null,
    refType: string | null = null
  ): ParsedGitHubUrl => ({
    protocol,
    username,
    password,
    host,
    owner,
    repo,
    path,
    action,
    ref,
    refType,
    branch: refType === 'heads' ? ref : null
  });

  // Raw GitHub URLs:
  // https://raw.githubusercontent.com/owner/repo/branch/path
  if ((match = url.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/(.+)$/))) {
    const [, owner, repo, rawPath] = match;
    const parsed = parseReference(rawPath);

    return createResult(
      'https',
      null,
      null,
      'raw.githubusercontent.com',
      owner,
      repo,
      parsed.path,
      'raw',
      parsed.ref,
      parsed.refType
    );
  }

  // HTTPS / git+https:
  // https://github.com/owner/repo/tree/main/path
  // https://github.com/owner/repo/raw/refs/heads/main/path
  // https://github.com/owner/repo/archive/refs/heads/main.zip
  if (
    (match = url.match(
      /^(https?|git\+https):\/\/(?:([^:@/]+)(?::([^@/]+))?@)?([^/]+)\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/(.*))?$/
    ))
  ) {
    const [, protocol, username, password, host, owner, repo, extraPath] = match;

    let path = extraPath || null;
    let action: string | null = null;
    let ref: string | null = null;
    let refType: string | null = null;

    if (extraPath) {
      const routeMatch = extraPath.match(/^(tree|blob|raw|archive)\/(.+)$/);

      if (routeMatch) {
        action = routeMatch[1];

        const routePath = routeMatch[2];

        // Archive URLs:
        // archive/refs/heads/main.zip
        // archive/refs/tags/v1.0.0.zip
        if (action === 'archive') {
          const archiveMatch = routePath.match(/^refs\/(heads|tags)\/(.+)\.(zip|tar\.gz)$/);

          if (archiveMatch) {
            refType = archiveMatch[1];
            ref = archiveMatch[2];
            path = null;
          } else {
            const parsed = parseReference(routePath);
            ref = parsed.ref;
            refType = parsed.refType;
            path = parsed.path;
          }
        } else {
          const parsed = parseReference(routePath);

          ref = parsed.ref;
          refType = parsed.refType;
          path = parsed.path;
        }
      }
    }

    return createResult(protocol, username || null, password || null, host, owner, repo, path, action, ref, refType);
  }

  // git://github.com/owner/repo.git
  if ((match = url.match(/^git:\/\/(?!.*@)([^/]+)\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/(.*))?$/))) {
    const [, host, owner, repo, extraPath] = match;

    return createResult('git', null, null, host, owner, repo, extraPath || null);
  }

  // ssh://git@github.com/owner/repo.git
  if ((match = url.match(/^ssh:\/\/(?:([^:@/]+)@)?([^/]+)\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/(.*))?$/))) {
    const [, username, host, owner, repo, extraPath] = match;

    return createResult('ssh', username || null, null, host, owner, repo, extraPath || null);
  }

  // SSH shorthand:
  // git@github.com:owner/repo.git
  if ((match = url.match(/^git@([^:]+):([^/]+)\/([^/]+?)(?:\.git)?(?:\/(.*))?$/))) {
    const [, host, owner, repo, extraPath] = match;

    return createResult('ssh', null, null, host, owner, repo, extraPath || null);
  }

  throw new Error('Invalid GitHub URL: ' + url);
}

export default parseGitHubUrl;
