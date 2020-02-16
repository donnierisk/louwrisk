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
.home {
  // perspective-origin: top center;
  // perspective: 360px;
}
</style>
