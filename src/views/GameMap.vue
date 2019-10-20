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
    <dialogue-box text="Choose a direction" :options="options" @chosen="movePlayer"></dialogue-box>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import GridBlock from '@/components/GridBlock.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import Grid from '@/lib/grid'
import { MapSymbol } from '@/models/MapSymbol'
import { MoveSymbol } from '@/models/MoveSymbol'

@Component({
  components: {
    GridBlock,
    DialogueBox
  }
})
export default class Map extends Vue {
  public gridSize: number[] = [8, 8]
  public theGrid: MapSymbol[][] = Grid
  public playerPos: number[] = [3, 7]
  public playerPosInArr = 0
  public gridRenderArray: MapSymbol[] = []
  private options = [
    MoveSymbol.NORTH,
    MoveSymbol.SOUTH,
    MoveSymbol.WEST,
    MoveSymbol.EAST
  ]

  private created() {
    this.generateGrid()
  }

  private movePlayer(direction: MoveSymbol, value: number = 1) {
    let playerX = this.playerPos[0]
    let playerY = this.playerPos[1]

    switch (direction) {
      case MoveSymbol.NORTH:
        playerY -= value
        break
      case MoveSymbol.SOUTH:
        playerY += value
        break
      case MoveSymbol.WEST:
        playerX -= value
        break
      default:
        playerX += value
        break
    }

    playerX = playerX >= this.gridSize[0] ? this.gridSize[0] - 1 : playerX
    playerY = playerY >= this.gridSize[1] ? this.gridSize[1] - 1 : playerY
    playerX = playerX < 0 ? 0 : playerX
    playerY = playerY < 0 ? 0 : playerY

    this.$set(this.playerPos, 0, playerX)
    this.$set(this.playerPos, 1, playerY)
    this.generateGrid()
  }

  private generateGrid() {
    this.gridRenderArray = []
    for (let gridRow = 0; gridRow < this.gridSize[0]; gridRow++) {
      for (let gridItem = 0; gridItem < this.gridSize[1]; gridItem++) {
        this.gridRenderArray.push(this.theGrid[gridRow][gridItem])
        if (gridItem === this.playerPos[0] && gridRow === this.playerPos[1]) {
          // THIS NEEDS TO BE MADE MORE DYNAMIC. PROP OF PLAYER POS SHOULD BE PASSED
          // DYNAMICALLY INSTEAD OF EACH GRID ITEM CHECKING,
          // THEN WE CAN REUSE THAT LOGIC TO PLACE MULTIPLE ITEMS
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
  background: greenyellow;
}
</style>
