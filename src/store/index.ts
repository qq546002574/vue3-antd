import { createStore } from 'vuex'

export default createStore({
  state: {
    testName: 'hello'
  },
  mutations: {
    setTestName(state, name) {
      state.testName = name
    }
  },
  actions: {
  },
  modules: {
  }
})
