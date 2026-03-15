const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../public/config.js');
const apiUrl = process.env.API_URL || 'http://localhost:9090/';
const buildSha = process.env.BUILD_SHA || 'dev';
const { version } = require('../package.json');

const configContent = `window.APP_CONFIG = { API_URL: '${apiUrl}', APP_VERSION: 'v${version}', BUILD_SHA: '${buildSha.substring(0, 7)}' };`;

fs.writeFileSync(configPath, configContent, 'utf8');

console.log(`Generated ${configPath} with API_URL: ${apiUrl}, version: v${version}, sha: ${buildSha.substring(0, 7)}`);
