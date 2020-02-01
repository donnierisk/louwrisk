<template>
  <div class="home">
    <stage :block-size="{ x: 128, y: 128, z: 0 }" />
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
export default class Home extends Vue {}
</script>

<style lang="scss">
.ratio-selector {
  position: absolute;
  top: 0;
  left: 0;
}
// DONOVAN NEXT STEPS
// NEED TO GET BACK FOG OF WAR THAT I ACCIDENTALLY REMOVED
// NEED TO FIGURE OUT RATIO BETWEEN THE BELOW AND BLOCKSIZE ABOVE
// ESPECIALLY WITH ANIMATIONS, NEED TO FIGURE THAT OUR FOR BANDITS
.entity .entity-avatar {
  background-size: 896px 640px;
  // This is half the size of the spritesheet, due to blocksize being 128px whereas sprites are default 256px
}

.gridItem {
  background-size: 640px 384px;
  // This is hald the size of the terrain spritesheet, due to blocksize being 128px instead of default 256px as per the image.
}
</style>
