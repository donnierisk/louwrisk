<template>
  <div id="container">
    <div id="grid">
      <grid-block v-for="(gridItem, i) of gridRenderArray" :type="gridItem" :key="i" />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import GridBlock from '@/components/GridBlock.vue'
import Grid from '@/lib/grid'
import { MapSymbol } from '@/models/MapSymbol'

@Component({
  components: {
    GridBlock
  }
})
export default class Map extends Vue {
  public gridSize: number[] = [8, 8]
  public theGrid: MapSymbol[][] = Grid

  public gridRenderArray: MapSymbol[] = []

  private created() {
    this.generateGrid()
  }

  private generateGrid() {
    for (const gridRow of this.theGrid) {
      for (const gridItem of gridRow) {
        this.gridRenderArray.push(gridItem)
      }
    }
  }
}
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#grid {
  height: 90vh;
  width: 90vw;
  background: lightcyan;
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto auto;
}
</style>
