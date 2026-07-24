const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const configPath = path.resolve(__dirname, '../public/config.js');
const { version: packageVersion } = require('../package.json');

function runGit(cmd) {
  const repoRoots = [
    path.resolve(__dirname, '../..'),
    path.resolve(__dirname, '..'),
  ];

  for (const cwd of repoRoots) {
    try {
      return execSync(cmd, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        cwd,
      }).trim();
    } catch {
      // try next root
    }
  }
  return null;
}

function parseSemver(value) {
  if (!value) return null;
  const match = String(value).replace(/^v/i, '').match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function resolveBuildSha() {
  const fromEnv = process.env.BUILD_SHA || process.env.GITHUB_SHA;
  if (fromEnv) return fromEnv.substring(0, 7);

  const fromGit = runGit('git rev-parse --short HEAD');
  return fromGit || 'dev';
}

function resolveVersion() {
  if (process.env.APP_VERSION) {
    return String(process.env.APP_VERSION).replace(/^v/i, '');
  }

  const latestTag = runGit('git describe --tags --abbrev=0');
  const base = parseSemver(latestTag) || parseSemver(packageVersion) || {
    major: 0,
    minor: 0,
    patch: 0,
  };

  let commitsSince = 0;
  if (latestTag) {
    const count = runGit(`git rev-list ${latestTag}..HEAD --count`);
    commitsSince = Number(count || '0') || 0;
  } else if (packageVersion) {
    console.warn(
      `No git tag found; falling back to package.json version ${packageVersion}. ` +
        'Pass APP_VERSION in CI so Azure SWA builds do not stick on package.json.'
    );
  }

  return `${base.major}.${base.minor}.${base.patch + commitsSince}`;
}

const version = resolveVersion();
const buildSha = resolveBuildSha();

const configContent = `window.APP_CONFIG = { APP_VERSION: 'v${version}', BUILD_SHA: '${buildSha}' };`;

fs.writeFileSync(configPath, configContent, 'utf8');

console.log(`Generated ${configPath} with version: v${version}, sha: ${buildSha}`);
