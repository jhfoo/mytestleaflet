import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

const GlobalFirebase = require('./lib/GlobalFirebase.js')
const router = require('./plugins/router.js').router

Vue.config.productionTip = false

let app = null
GlobalFirebase.auth.onAuthStateChanged(() => {
    if (!app) {
        console.log('Rendering Vue')
        app = new Vue({
          vuetify,
          router,
          render: h => h(App)
        }).$mount('#app')        
    }
})

