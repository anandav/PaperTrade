import axios from 'axios';

export default function setup(store) {
  axios.interceptors.response.use(response => {
    return response;
  }, error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('authModule/logout');
    }
    return Promise.reject(error);
  });
}
