import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuescroll from 'vuescroll';

Vue.use(vuescroll, {
  ops: {
    bar: {
      opacity: 0
    },
    scrollPanel: {
      speed: 500,
      easing: 'linier',
      scrollingX: false,
      scrollingY: false
    }
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
