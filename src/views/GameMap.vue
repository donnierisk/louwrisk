<template>
  <div id="container">
    <div id="grid">
      <grid-block
        v-for="(gridItem, i) of gridRenderArray"
        :type="gridItem"
        :playerPos="playerPosInArr"
        :posInArr="i"
        :key="i"
      />
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
  public playerPos: number[] = [4, 3]
  public playerPosInArr = 0
  public gridRenderArray: MapSymbol[] = []

  private created() {
    this.generateGrid()
  }

  private generateGrid() {
    for (let gridRow = 0; gridRow < this.gridSize[0]; gridRow++) {
      for (let gridItem = 0; gridItem < this.gridSize[1]; gridItem++) {
        this.gridRenderArray.push(gridItem)
        if (gridItem === this.playerPos[0] && gridRow === this.playerPos[1]) {
          this.playerPosInArr = this.gridRenderArray.length - 1
        }
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
