import { describe, expect, it } from '@jest/globals';
import { parseGitHubUrl, type ParsedGitHubUrl } from '../src/functions/parseGitHubUrl';

const defaults: ParsedGitHubUrl = {
  protocol: 'https',
  username: null,
  password: null,
  host: 'github.com',
  owner: 'owner',
  repo: 'repo',
  path: null,
  branch: null,
  ref: null,
  refType: null,
  action: null
};

function expectParsed(url: string, expected: Partial<ParsedGitHubUrl>) {
  expect(parseGitHubUrl(url)).toEqual({
    ...defaults,
    ...expected
  });
}

describe('parseGitHubUrl', () => {
  describe('HTTPS', () => {
    it('parses https url with username and password', () => {
      expectParsed('https://user:pass@github.com/owner/repo.git', {
        username: 'user',
        password: 'pass'
      });
    });

    it('parses https url with authentication and tree path', () => {
      expectParsed('https://user:pass@github.com/dimaslanjaka/git-command-helper/tree/pre-release/.yarn/releases', {
        username: 'user',
        password: 'pass',
        owner: 'dimaslanjaka',
        repo: 'git-command-helper',
        action: 'tree',
        ref: 'pre-release',
        refType: 'heads',
        branch: 'pre-release',
        path: '.yarn/releases'
      });
    });

    it('parses https url without authentication', () => {
      expectParsed('https://github.com/owner/repo.git', {});
    });

    it('parses https url with extra path', () => {
      expectParsed('https://user:pass@github.com/owner/repo.git/some/path', {
        username: 'user',
        password: 'pass',
        path: 'some/path'
      });
    });

    it('parses github url without .git suffix', () => {
      expectParsed('https://github.com/owner/repo', {});
    });

    it('parses github url with trailing slash', () => {
      expectParsed('https://github.com/owner/repo/', {});
    });

    it('parses github enterprise https url', () => {
      expectParsed('https://github.company.com/owner/repo.git', {
        host: 'github.company.com'
      });
    });

    it('parses https url with github token auth', () => {
      expectParsed('https://username:ghp_123456789@github.com/owner/repo.git', {
        username: 'username',
        password: 'ghp_123456789'
      });
    });

    it('parses github url with commit path', () => {
      expectParsed('https://github.com/owner/repo/commit/c3e7541', {
        path: 'commit/c3e7541'
      });
    });

    it('parses github url with compare path', () => {
      expectParsed('https://github.com/owner/repo/compare/main...develop', {
        path: 'compare/main...develop'
      });
    });

    it('parses github pull request url', () => {
      expectParsed('https://github.com/owner/repo/pull/123', {
        path: 'pull/123'
      });
    });

    it('parses github issue url', () => {
      expectParsed('https://github.com/owner/repo/issues/123', {
        path: 'issues/123'
      });
    });
  });

  describe('GitHub actions and references', () => {
    it('parses tree action', () => {
      expectParsed('https://github.com/dimaslanjaka/git-command-helper/tree/pre-release/.git', {
        owner: 'dimaslanjaka',
        repo: 'git-command-helper',
        action: 'tree',
        ref: 'pre-release',
        refType: 'heads',
        branch: 'pre-release',
        path: '.git'
      });
    });

    it('parses blob action', () => {
      expectParsed('https://github.com/dimaslanjaka/git-command-helper/blob/pre-release/.gitignore', {
        owner: 'dimaslanjaka',
        repo: 'git-command-helper',
        action: 'blob',
        ref: 'pre-release',
        refType: 'heads',
        branch: 'pre-release',
        path: '.gitignore'
      });
    });

    it('parses raw action', () => {
      expectParsed('https://github.com/dimaslanjaka/git-command-helper/raw/pre-release/.github/workflows/ci.yml', {
        owner: 'dimaslanjaka',
        repo: 'git-command-helper',
        action: 'raw',
        ref: 'pre-release',
        refType: 'heads',
        branch: 'pre-release',
        path: '.github/workflows/ci.yml'
      });
    });

    it('parses raw action with refs heads', () => {
      expectParsed(
        'https://github.com/dimaslanjaka/hexo-themes/raw/refs/heads/master/releases/hexo-theme-flowbite.tgz',
        {
          owner: 'dimaslanjaka',
          repo: 'hexo-themes',
          action: 'raw',
          ref: 'master',
          refType: 'heads',
          branch: 'master',
          path: 'releases/hexo-theme-flowbite.tgz'
        }
      );
    });

    it('parses raw action with refs heads and nested file path', () => {
      expectParsed(
        'https://github.com/dimaslanjaka/nodejs-package-types/raw/refs/heads/through2/release/types-through2.tgz',
        {
          owner: 'dimaslanjaka',
          repo: 'nodejs-package-types',
          action: 'raw',
          ref: 'through2',
          refType: 'heads',
          branch: 'through2',
          path: 'release/types-through2.tgz'
        }
      );
    });

    it('parses blob action with tag reference', () => {
      expectParsed('https://github.com/owner/repo/blob/refs/tags/v1.0.0/package.json', {
        action: 'blob',
        ref: 'v1.0.0',
        refType: 'tags',
        branch: null,
        path: 'package.json'
      });
    });

    it('parses raw action with tag reference', () => {
      expectParsed('https://github.com/owner/repo/raw/refs/tags/v1.0.0/package.json', {
        action: 'raw',
        ref: 'v1.0.0',
        refType: 'tags',
        branch: null,
        path: 'package.json'
      });
    });

    it('parses archive refs heads url', () => {
      expectParsed('https://github.com/owner/repo/archive/refs/heads/main.zip', {
        action: 'archive',
        ref: 'main',
        refType: 'heads',
        branch: 'main',
        path: null
      });
    });

    it('parses archive refs tags url', () => {
      expectParsed('https://github.com/owner/repo/archive/refs/tags/v1.0.0.zip', {
        action: 'archive',
        ref: 'v1.0.0',
        refType: 'tags',
        branch: null,
        path: null
      });
    });
  });

  describe('Raw GitHub URLs', () => {
    it('parses raw.githubusercontent.com url', () => {
      expectParsed(
        'https://raw.githubusercontent.com/dimaslanjaka/git-command-helper/pre-release/.github/workflows/ci.yml',
        {
          host: 'raw.githubusercontent.com',
          owner: 'dimaslanjaka',
          repo: 'git-command-helper',
          action: 'raw',
          ref: 'pre-release',
          refType: 'heads',
          branch: 'pre-release',
          path: '.github/workflows/ci.yml'
        }
      );
    });

    it('parses raw.githubusercontent.com refs heads url', () => {
      expectParsed(
        'https://raw.githubusercontent.com/dimaslanjaka/hexo-themes/refs/heads/master/releases/hexo-theme-flowbite.tgz',
        {
          host: 'raw.githubusercontent.com',
          owner: 'dimaslanjaka',
          repo: 'hexo-themes',
          action: 'raw',
          ref: 'master',
          refType: 'heads',
          branch: 'master',
          path: 'releases/hexo-theme-flowbite.tgz'
        }
      );
    });

    it('parses raw.githubusercontent.com refs tags url', () => {
      expectParsed('https://raw.githubusercontent.com/owner/repo/refs/tags/v1.0.0/package.json', {
        host: 'raw.githubusercontent.com',
        action: 'raw',
        ref: 'v1.0.0',
        refType: 'tags',
        branch: null,
        path: 'package.json'
      });
    });

    it('parses hash as ref (raw)', () => {
      const hash = 'c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7';

      expectParsed(`https://raw.githubusercontent.com/dimaslanjaka/git-command-helper/${hash}/.yarnrc.yml`, {
        host: 'raw.githubusercontent.com',
        owner: 'dimaslanjaka',
        repo: 'git-command-helper',
        action: 'raw',
        ref: hash,
        refType: 'heads',
        branch: hash,
        path: '.yarnrc.yml'
      });
    });
  });

  describe('Commit references', () => {
    it('parses hash as ref (blob)', () => {
      const hash = 'c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7';

      expectParsed(
        `https://github.com/dimaslanjaka/git-command-helper/blob/${hash}/release/git-command-helper-1.0.13.tgz`,
        {
          owner: 'dimaslanjaka',
          repo: 'git-command-helper',
          action: 'blob',
          ref: hash,
          refType: 'heads',
          branch: hash,
          path: 'release/git-command-helper-1.0.13.tgz'
        }
      );
    });

    it('parses hash as ref (tree)', () => {
      const hash = 'c3e7541d7f92f76ff0d4744a07cc3270d39b3fd7';

      expectParsed(`https://github.com/dimaslanjaka/git-command-helper/tree/${hash}/src`, {
        owner: 'dimaslanjaka',
        repo: 'git-command-helper',
        action: 'tree',
        ref: hash,
        refType: 'heads',
        branch: hash,
        path: 'src'
      });
    });
  });

  describe('Git protocols', () => {
    it('parses git protocol url', () => {
      expectParsed('git://github.com/owner/repo.git', {
        protocol: 'git'
      });
    });

    it('parses ssh shorthand url', () => {
      expectParsed('git@github.com:owner/repo.git', {
        protocol: 'ssh'
      });
    });

    it('parses ssh protocol url', () => {
      expectParsed('ssh://git@github.com/owner/repo.git', {
        protocol: 'ssh',
        username: 'git'
      });
    });

    it('parses github enterprise ssh url', () => {
      expectParsed('git@github.company.com:owner/repo.git', {
        protocol: 'ssh',
        host: 'github.company.com'
      });
    });

    it('parses git+https url with username and password', () => {
      expectParsed('git+https://user:pass@github.com/owner/repo.git', {
        protocol: 'git+https',
        username: 'user',
        password: 'pass'
      });
    });

    it('parses git+https url with token auth', () => {
      expectParsed('git+https://oauth2:ghp_123456789@github.com/owner/repo.git', {
        protocol: 'git+https',
        username: 'oauth2',
        password: 'ghp_123456789'
      });
    });

    it('throws for git protocol with auth', () => {
      const url = 'git://user:token@github.com/owner/repo.git';

      expect(() => parseGitHubUrl(url)).toThrow(`Invalid GitHub URL: ${url}`);
    });

    it('throws for ssh url with password auth', () => {
      const url = 'ssh://user:token@github.com/owner/repo.git';

      expect(() => parseGitHubUrl(url)).toThrow(`Invalid GitHub URL: ${url}`);
    });
  });

  describe('Invalid URLs', () => {
    it('throws for invalid url', () => {
      const url = 'not-a-git-url';

      expect(() => parseGitHubUrl(url)).toThrow(`Invalid GitHub URL: ${url}`);
    });
  });
});
