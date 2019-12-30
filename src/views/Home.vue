<template>
  <div class="home">
    <game-map :block-size="{ x: 130, y: 90, z: 0 }"/>
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
export default class Home extends Vue { }
</script>

<style scoped lang="scss">
.ratio-selector {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
