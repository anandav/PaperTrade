const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../public/config.js');
const apiUrl = process.env.API_URL || 'http://localhost:41234/'; 

const configContent = `window.APP_CONFIG = { API_URL: '${apiUrl}' };`;

fs.writeFileSync(configPath, configContent, 'utf8');

console.log(`Generated ${configPath} with API_URL: ${apiUrl}`);
