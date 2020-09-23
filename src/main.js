import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    playbackTime: 0,
    isLoaded: false,
    isPlayerLoaded: false,
  },
  mutations: {
    setPlaybackTime(state, n) {
      state.playbackTime = n;
    },
    setIsLoaded(state, isLoaded) {
      state.isLoaded = isLoaded;
    },
    setIsPlayerLoaded(state, isPlayerLoaded) {
      state.isPlayerLoaded = isPlayerLoaded;
    },
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
