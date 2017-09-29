/**
 * Created by focus on 2017/4/13.
 */


import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import index from "../view/index.vue";

const routes = [
    {
        path: "",
        component: index
    }
];

export default new VueRouter({
    routes: routes
})

