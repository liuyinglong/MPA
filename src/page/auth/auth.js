/**
 * Created by focus on 2017/4/13.
 */


import Vue from "vue";
import router from "./router/router";
import App from "./App.vue";


import "../../scss/common.scss";
new Vue({
    el: "#app",
    render: function (createElement) {
        return createElement(App);
    },
    router: router
});