import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import router from './router'
import store from './store'
//@ts-ignore
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import { BootstrapVue } from 'bootstrap-vue'
// Install BootstrapVue
Vue.use(BootstrapVue)
Vue.use(VueMeta)
Vue.component('datetime', Datetime)
import vuetify from './plugins/vuetify'
// @ts-ignore
import i18n from './plugins/i18n.js'
Vue.config.productionTip = false
export var eventBus = new Vue()
var app = new Vue({
    router: router,
    store: store,
    vuetify: vuetify,
    i18n: i18n,
    render: function (h) {
        return h(App)
    },
    mounted: function () {
        // Reveal app version
        console.log('App Version: ' + process.env.VUE_APP_VERSION)
        // Hide loader once vue is initialized
        var loader = document.getElementById('app_loading')
        if (loader) {
            loader.style.display = 'none'
        }
    },
    data: {
        theme: 'day',
    },
}).$mount('#app')
// @ts-ignore
if (window.Cypress) {
    // only available during E2E tests
    // @ts-ignore
    window.app = app
}
// Extending Big.js with a helper function
import Big from 'big.js'
Big.prototype.toLocaleString = function (toFixed) {
    if (toFixed === void 0) {
        toFixed = 9
    }
    var value = this
    var fixedStr = this.toFixed(toFixed)
    var split = fixedStr.split('.')
    var wholeStr = parseInt(split[0]).toLocaleString('en-US')
    if (split.length === 1) {
        return wholeStr
    } else {
        var remainderStr = split[1]
        // remove trailing 0s
        var lastChar = remainderStr.charAt(remainderStr.length - 1)
        while (lastChar === '0') {
            remainderStr = remainderStr.substring(0, remainderStr.length - 1)
            lastChar = remainderStr.charAt(remainderStr.length - 1)
        }
        var trimmed = remainderStr.substring(0, toFixed)
        if (!trimmed) return wholeStr
        return wholeStr + '.' + trimmed
    }
}
//# sourceMappingURL=main.js.map
