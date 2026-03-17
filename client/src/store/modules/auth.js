import axios from 'axios';

const apiUrl = process.env.APIURL || '/';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

const storedToken = localStorage.getItem('token') || '';

export default {
  namespaced: true,
  state: {
    token: storedToken,
    claims: parseJwt(storedToken),
    user: {},
    status: '',
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    username: state => state.claims.username || '',
    email: state => state.claims.email || '',
    claims: state => state.claims,
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, { token }) {
      state.status = 'success';
      state.token = token;
      state.claims = parseJwt(token);
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.claims = {};
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios.post(`${apiUrl}auth/login`, { username: user.username, password: user.password })
          .then(resp => {
            const token = resp.data.token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            commit('auth_success', { token });
            resolve(resp);
          })
          .catch(err => {
            commit('auth_error');
            localStorage.removeItem('token');
            reject(err);
          });
      });
    },
    b2cLogin({ commit }, token) {
      return new Promise((resolve) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        commit('auth_success', { token });
        resolve();
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        
        // Redirect to B2C logout on the server
        const apiUrl = window.APP_CONFIG?.API_URL || '/';
        window.location.href = `${apiUrl}auth/b2c/logout`;
        
        resolve();
      });
    },
  },
};
