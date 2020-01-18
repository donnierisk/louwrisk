<template>
  <div>
    <img :src="imagePath" />
  </div>
</template>

<script lang='ts'>
// This component might become absolute the SpriteBlock.vue
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Entity } from '@/models/Entity/Entity'
@Component
export default class EntityComp extends Vue {
  @Prop() private entityparse?: string
  private get imagePath() {
    return require(`../assets/${
      this.entityparse ? this.entityparse : 'blank'
    }.png`)
  }
}
</script>

<style scoped>
img {
  position: absolute;
  width: 100%;
  height: auto;
  bottom: 0;
  left: 0;
}
</style>
