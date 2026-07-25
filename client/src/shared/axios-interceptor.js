import axios from 'axios';

export default function setup(store) {
  let refreshPromise = null;

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config || {};
      const status = error.response && error.response.status;
      const url = original.url || '';

      if (status !== 401) {
        return Promise.reject(error);
      }

      if (url.includes('auth/b2c/refresh') || original._retry) {
        store.dispatch('authModule/logout');
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = store
            .dispatch('authModule/refreshAccessToken')
            .finally(() => {
              refreshPromise = null;
            });
        }
        const token = await refreshPromise;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${token}`;
        return axios(original);
      } catch (e) {
        store.dispatch('authModule/logout');
        return Promise.reject(error);
      }
    }
  );
}
