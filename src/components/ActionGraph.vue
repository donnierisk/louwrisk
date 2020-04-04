<template>
  <div
    id="action-graph"
    ref="graph"
    :style="{left: positionDom.x + 'px', top: positionDom.y + 'px'}"
  ></div>
</template> 

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Entity } from '@/models/Entity/Entity'
import { GridPosition } from '../models/GridPosition'

@Component
export default class ActionGraph extends Vue {
  @Prop() private inspectedObject!: GridPosition

  private positionDom = { x: 0, y: 0 }
  @Watch('inspectedObject', { deep: true, immediate: true })
  private onPositionChange(newVal: any) {
    this.positionDom = { ...newVal.position }
    console.log(JSON.stringify(this.positionDom))
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
}
</style>