import Vue from 'vue'
import VueRouter from 'vue-router'

const GlobalFirebase = require('../lib/GlobalFirebase.js')
const AuthPaths = ['/showmap']

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
        path: '/',
        component: () => import (/* webpackChunkname: "pages" */ '../pages/Home.vue')
    }, {
        path: '/showmap',
        component: () => import (/* webpackChunkname: "pages" */ '../pages/ShowMap.vue')
    }, {
        path: '/admin',
        component: () => import (/* webpackChunkname: "pages" */ '../pages/Admin.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
    // const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const currentUser = GlobalFirebase.auth.currentUser

    console.log('from')
    console.log(from)
    console.log('to')
    console.log(to)
    console.log(currentUser)

    if (AuthPaths.includes(to.path)) {
        if (GlobalFirebase.auth.currentUser === null) {
            next ('/')
        } else {
            next()
        }
    } else {
        next()
    }
})

export {
    router
}