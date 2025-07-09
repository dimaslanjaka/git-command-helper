export interface ParsedGitHubUrl {
  protocol: string;
  username: string | null;
  password: string | null;
  host: string;
  owner: string;
  repo: string;
  path: string | null;
}

/**
 * Parses a GitHub URL and extracts its components, including username and password if present.
 *
 * @param url - The GitHub URL to parse.
 * @returns An object with the parsed components: { protocol, username, password, host, owner, repo, path }, or null if invalid.
 */
export function parseGitHubUrl(url: string): ParsedGitHubUrl {
  let match: RegExpMatchArray | null;

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

    return {
      protocol,
      username: username || null,
      password: password || null,
      host,
      owner,
      repo,
      path: extraPath || null
    };
  }

  // SSH: git@github.com:owner/repo(.git)(/path)?
  if ((match = url.match(/^git@([^:]+):([^/]+)\/([^/.]+)(?:\.git)?(?:\/(.*))?$/))) {
    const host = match[1];
    const owner = match[2];
    const repo = match[3];
    const extraPath = match[4];

    return {
      protocol: 'ssh',
      username: null,
      password: null,
      host,
      owner,
      repo,
      path: extraPath || null
    };
  }

  throw new Error('Invalid GitHub URL: ' + url);
}

export default parseGitHubUrl;
