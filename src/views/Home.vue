<template>
  <div class="home">
    <game-map :block-size="{ x: 130, y: 90, z: 0 }" />
    <!-- <dialogue-option text:="text" :options="options" /> -->
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
