<template>
  <div id="action-graph" ref="graph"></div>
</template> 

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Entity } from '@/models/Entity/Entity'
import { GridPosition } from '../models/GridPosition'

@Component
export default class ActionGraph extends Vue {
  @Prop() private position!: GridPosition

  updated() {
    console.log(this.position)
  }
  @Watch('position')
  private onPositionChange(newVal: any) {
    console.log('test')
  }

  mounted() {
    console.log(this.position)
  }
}
</script>
<style lang="scss">
#action-graph {
  width: 5px;
  height: 5px;
  background: red;
}
</style>