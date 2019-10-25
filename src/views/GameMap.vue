<template>
  <div id="container">
    <div id="grid">
      <grid-block v-for="(gridItem, i) of gridRenderArray" :gridMeta="gridItem" :playerPos="playerPosInArr" :posInArr="i" :key="i" @enter-vision="addToObserver" @leave-vision="removerFromObserver" />
    </div>
    <dialogue-box :text="text" :options="options" @on-action="movePlayer"></dialogue-box>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import GridBlock from '@/components/GridBlock.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import Grid from '@/lib/grid'
import { MapSymbol } from '@/models/MapSymbol'
import { MoveSymbol } from '@/models/MoveSymbol'
import { GridBlockI } from '@/models/GridBlockI'
import { GridPosition } from '@/models/GridPosition'
import { Observer } from '@/utils/Observer'

@Component({
  components: {
    GridBlock,
    DialogueBox
  }
})
export default class Map extends Vue {
  public gridSize: number[] = [8, 8]
  public theGrid: MapSymbol[][] = Grid
  public gridRenderArray: GridBlockI[] = []

  public playerPos: GridPosition = { x: 3, y: 7 }
  public playerPosInArr = 0

  private observedItems: MapSymbol[] = []
  private observer: Observer = new Observer()

  private options = [
    MoveSymbol.NORTH,
    MoveSymbol.SOUTH,
    MoveSymbol.WEST,
    MoveSymbol.EAST
  ]

  private created() {
    this.generateGrid()
  }

  private get text() {
    return this.observer.getText()
  }

  private movePlayer(direction: MoveSymbol, value: number = 1) {
    let playerX = this.playerPos.x
    let playerY = this.playerPos.y

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

    if (this.isOutOfBounds(playerX, playerY)) {
      console.log('Out of bounds!')
    }
    else if (this.theGrid[playerY][playerX] === MapSymbol.ROCK) {
      console.log('Invalid move!')
    } else {
      this.playerPos.x = playerX
      this.playerPos.y = playerY
    }

    this.generateGrid()
  }

  private generateGrid() {
    this.gridRenderArray = []
    this.observedItems = []
    for (let gridRow = 0; gridRow < this.gridSize[0]; gridRow++) {
      for (let gridItem = 0; gridItem < this.gridSize[1]; gridItem++) {
        const gridObj: GridBlockI = {
          symbol: this.theGrid[gridRow][gridItem],
          id: Number(gridItem + '' + gridRow)
        }

        // Check if current gridItem's pos in 2d array matches the playerPos
        if (gridItem === this.playerPos.x && gridRow === this.playerPos.y) {
          this.playerPosInArr = this.gridRenderArray.length
          gridObj.containsPlayer = true
        }

        if (this.isInObserveRange(gridItem, gridRow)) {
          gridObj.inObserveRange = true
          this.observedItems.push(gridObj.symbol)
        }

        this.gridRenderArray.push(gridObj)
      }
    }
  }

  private isOutOfBounds(objectX: number, objectY: number) {
    if (objectX >= this.gridSize[0]) {
      return true
    }
    if (objectX < 0) {
      return true
    }
    if (objectY >= this.gridSize[1]) {
      return true
    }
    if (objectY < 0) {
      return true
    }
    return false;
  }

  private addToObserver(grid: GridBlockI) {
    this.observer.addToObserver(grid)
  }
  private removerFromObserver(grid: GridBlockI) {
    this.observer.removeFromObserver(grid)
  }

  private isInObserveRange(gridX: number, gridY: number): boolean {

    const range = 1;

    // const visionArray = [];
    // startX = this.playerPos.x
    // for (let i = 0; i < range; i++) {
    //   for (let k = 0; k < range; k++) {
    //     visionArray.push({ x: i, y: k })
    //   }
    // }

    const possiblePositionsArr: GridPosition[] = [
      { x: this.playerPos.x, y: this.playerPos.y },
      { x: this.playerPos.x - range, y: this.playerPos.y },
      { x: this.playerPos.x - range, y: this.playerPos.y - range },
      { x: this.playerPos.x, y: this.playerPos.y - range },
      { x: this.playerPos.x + range, y: this.playerPos.y - range },
      { x: this.playerPos.x + range, y: this.playerPos.y },
      { x: this.playerPos.x + range, y: this.playerPos.y + range },
      { x: this.playerPos.x, y: this.playerPos.y + range },
      { x: this.playerPos.x - range, y: this.playerPos.y + range }
    ]

    for (const possiblePos of possiblePositionsArr) {
      if (gridX === possiblePos.x && gridY === possiblePos.y) {
        return true
      }
    }
    return false
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
  position: relative;
  height: 80vh;
  width: 70vw;
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto auto;
  background: black;
  border-radius: 20px;
}
</style>
