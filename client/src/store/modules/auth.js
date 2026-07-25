import axios from 'axios';
import { apiUrl } from '../../config';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

const storedToken = localStorage.getItem('token') || '';
const storedRefreshToken = localStorage.getItem('refreshToken') || '';

export default {
  namespaced: true,
  state: {
    token: storedToken,
    refreshToken: storedRefreshToken,
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
    refreshToken: state => state.refreshToken,
  },
  mutations: {
    auth_success(state, { token, refreshToken }) {
      state.status = 'success';
      state.token = token;
      state.claims = parseJwt(token);
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.refreshToken = '';
      state.claims = {};
    },
  },
  actions: {
    b2cLogin({ commit }, payload) {
      return new Promise((resolve) => {
        const token = typeof payload === 'string' ? payload : payload.token;
        const refreshToken =
          typeof payload === 'string' ? undefined : payload.refreshToken;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        commit('auth_success', {
          token,
          refreshToken: refreshToken || localStorage.getItem('refreshToken') || '',
        });
        resolve();
      });
    },
    async refreshAccessToken({ commit, state }) {
      const refreshToken = state.refreshToken || localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const res = await axios.post(`${apiUrl}auth/b2c/refresh`, { refreshToken });
      const token = res.data.token;
      const nextRefresh = res.data.refreshToken || refreshToken;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', nextRefresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      commit('auth_success', { token, refreshToken: nextRefresh });
      return token;
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];

        window.location.href = `${apiUrl}auth/b2c/logout`;

        resolve();
      });
    },
  },
};
