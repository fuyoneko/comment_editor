import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rawText: "",
    history: [],
  },
  getters: {
    rawText(state) {
      return state.rawText;
    },
    history(state) {
      return state.history;
    },
  },
  mutations: {
    setRawText(state, payload) {
      state.rawText = payload;
    },
    setHistory(state, payload) {
      const instanceString = JSON.stringify(state.history);
      let instance = JSON.parse(instanceString);
      instance.push(payload);
      state.history = instance
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, Math.min(instance.length, 5));
    },
  },
});
