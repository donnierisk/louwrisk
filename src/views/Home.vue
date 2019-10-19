<template>
  <div class="home">
    <game-map />
  </div>
</template>

<script lang='ts'>
// @ is an alias to /src
// import LouwRisk from "@/components/Map.vue";

import { Component, Vue } from 'vue-property-decorator'

import GameMap from './GameMap.vue'

@Component({
  components: {
    GameMap
  }
})
export default class Home extends Vue {}
</script>
