import axios from 'axios';
import router from '../router';

export default function setup(store) {
  axios.interceptors.response.use(response => {
    return response;
  }, error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('authModule/logout')
        .then(() => {
          router.push('/login');
        });
    }
    return Promise.reject(error);
  });
}
