<template>
  <div
    id="action-graph"
    ref="graph"
    :style="{left: positionDom.x + 'px', top: positionDom.y + 'px'}"
  >
    <div
      class="option-container"
      v-for="(option, i) in options"
      :key="i"
      :style="{top: `${(100)*Math.cos(60 * i + 1)}px`, left:`${(100)*Math.sin(60 * i + 1)}px`}"
    >
      <div class="option"></div>
    </div>
  </div>
</template> 
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Entity } from '@/models/Entity/Entity'
import { GridPosition } from '../models/GridPosition'

@Component
export default class ActionGraph extends Vue {
  @Prop() private inspectedObject!: GridPosition
  options = [
    { name: 'talk' },
    { name: 'fight' },
    { name: 'trade' },
    { name: 'talk' }
  ]

  private positionDom = { x: 0, y: 0 }
  @Watch('inspectedObject', { deep: true, immediate: true })
  private onPositionChange(newVal: any) {
    this.positionDom = { ...newVal.position }
  }
}
</script>
<style lang="scss">
#action-graph {
  width: 25px;
  height: 25px;
  position: absolute;
  background: red;
  z-index: 11;

  .option-container {
    width: 10px;
    height: 10px;
    position: absolute;
    background: gold;
  }
}
</style>