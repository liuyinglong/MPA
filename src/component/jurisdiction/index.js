/**
 * Created by focus on 2017/4/13.
 */

var Jurisdiction = require("./src/jurisdiction.vue");

Jurisdiction.install = function (Vue) {
    Vue.component(Jurisdiction.name, Jurisdiction);
};

module.exports = Jurisdiction;
