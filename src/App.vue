<template>
  <div id="app">
    <home />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Home from './views/Home.vue'

@Component({
  components: {
    Home
  }
})
export default class App extends Vue {}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
