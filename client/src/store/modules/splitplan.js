import { SETSPLITPLANS } from "../mutationtype";
import axios from "axios";

const apiUrl = process.env.APIURL || "/";

export default {
  namespaced: true,
  state: {
    Plans: [],
  },
  getters: {
    Plans: (state) => {
      return state.Plans;
    },
  },
  mutations: {
    [SETSPLITPLANS](state, plans) {
      state.Plans = Array.isArray(plans) ? plans : [];
    },
  },
  actions: {
    async GetPlans({ commit }) {
      const response = await axios.get(apiUrl + "splitplan");
      commit(SETSPLITPLANS, response.data);
      return response.data;
    },
    async SavePlan({ commit }, plan) {
      const response = await axios.post(apiUrl + "splitplan/save", plan);
      commit(SETSPLITPLANS, response.data.plans);
      return response.data.plan;
    },
    async DeletePlan({ commit }, plan) {
      const response = await axios.post(apiUrl + "splitplan/delete", {
        _id: plan._id,
      });
      commit(SETSPLITPLANS, response.data.plans);
    },
    async GetQuotes(context, symbols) {
      const response = await axios.post(apiUrl + "splitplan/quotes", {
        symbols,
      });
      return response.data.quotes || [];
    },
  },
};
