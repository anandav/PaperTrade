const raw = process.env.VUE_APP_API_URL || process.env.API_URL || 'http://localhost:9090/';

export const apiUrl = raw.endsWith('/') ? raw : `${raw}/`;

export default {
  apiUrl,
};
