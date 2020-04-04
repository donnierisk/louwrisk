<template>
  <div class="home">
    <stage :block-size="{ x: blockSize, y: blockSize, z: 0 }" />
  </div>
</template>

<script lang='ts'>
// @ is an alias to /src
// import LouwRisk from "@/components/Map.vue";

import { Component, Vue } from 'vue-property-decorator'
import Stage from './Stage.vue'

@Component({
  components: {
    Stage
  }
})
export default class Home extends Vue {
  public blockSize: number = 128 // in px
  public created() {
    const w = window.innerWidth
    this.blockSize = Math.round(w / 12) // game is 12 grid blocks wide
  }
}
</script>

<style lang="scss">
.home {
  // perspective-origin: top center;
  // perspective: 360px;
}
</style>
