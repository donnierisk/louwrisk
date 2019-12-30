import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuescroll from 'vuescroll';

Vue.use(vuescroll, {
  ops: {
    bar: {
      opacity: 1
    },
    scrollPanel: {
      speed: 500,
      easing: 'easeInQuad',
      scrollingX: true,
      scrollingY: true
    }
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
