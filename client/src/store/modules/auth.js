import axios from 'axios';

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
    auth_success(state, { token }) {
      state.status = 'success';
      state.token = token;
      state.claims = parseJwt(token);
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.claims = {};
    },
  },
  actions: {
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

        const apiUrl = window.APP_CONFIG?.API_URL || '/';
        window.location.href = `${apiUrl}auth/b2c/logout`;

        resolve();
      });
    },
  },
};
