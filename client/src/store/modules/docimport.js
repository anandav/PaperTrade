import { SETIMPORTCAPABILITIES } from "../mutationtype";
import axios from "axios";

const apiUrl = process.env.APIURL || "/";

const DISABLED = { enabled: false, formats: [], maxMb: 0, message: "" };

export default {
  namespaced: true,
  state: {
    Capabilities: DISABLED,
  },
  getters: {
    Capabilities: (state) => {
      return state.Capabilities;
    },
  },
  mutations: {
    [SETIMPORTCAPABILITIES](state, capabilities) {
      state.Capabilities = capabilities || DISABLED;
    },
  },
  actions: {
    async GetImportCapabilities({ commit }) {
      try {
        const response = await axios.get(apiUrl + "import/capabilities");
        commit(SETIMPORTCAPABILITIES, response.data);
        return response.data;
      } catch (err) {
        commit(SETIMPORTCAPABILITIES, DISABLED);
        return DISABLED;
      }
    },
  },
};
