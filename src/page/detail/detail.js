/**
 * Created by focus on 2017/4/13.
 */
import Vue from "vue";

import App from "./App.vue";

new Vue({
    el: "#app",
    render:function(createElement){
        return createElement(App);
    }
});