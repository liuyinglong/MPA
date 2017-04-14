/**
 * Created by focus on 2017/4/13.
 */


import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import index from "../../../component/index.vue";

console.log(index);

const routes = [
    {
        path: "",
        component: index
    }
];

export default new VueRouter({
    routes: routes
})

