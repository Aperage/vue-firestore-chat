import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    current_route: '',
    firebaseConfig: {
      apiKey: "AIzaSyAeD9_LQdACjcslaau92lbL9Kd-4MKqGTE",
      authDomain: "dayo-76b4f.firebaseapp.com",
      databaseURL: "https://dayo-76b4f.firebaseio.com",
      projectId: "dayo-76b4f",
      storageBucket: "dayo-76b4f.appspot.com",
      messagingSenderId: "617173796738"
    }
  }
})
