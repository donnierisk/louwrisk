<template>
  <div id="container">
    <div id="grid" ref="grid">
      <div id="new-player" ref="player">7</div>
      <grid-block
        v-for="(gridItem, i) of gridRenderArray"
        :gridMeta="gridItem"
        :playerPos="playerPosInArr"
        :posInArr="i"
        :key="i"
        @enter-vision="addToObserver"
        @leave-vision="removerFromObserver"
        @player-pos="updatePlayerPosition"
      />
    </div>
    <dialogue-box :text="text" @on-action="movePlayer"></dialogue-box>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import GridBlock from '@/components/GridBlock.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import Grid from '@/lib/grid'
import { MapSymbol } from '@/models/MapSymbol'
import { GridBlockI } from '@/models/GridBlockI'
import { GridPosition } from '@/models/GridPosition'
import { Observer } from '@/utils/Observer'
import { Animate } from '@/utils/Animate'
import { increaseBy, decreaseBy } from '../utils/arithmetic'

@Component({
  components: {
    GridBlock,
    DialogueBox
  }
})
export default class Map extends Vue {
  public gridSize: GridPosition = { x: 8, y: 8 }
  public theGrid: MapSymbol[][] = Grid
  public blockWidth = 0.0
  public blockHeight = 0.0
  public gridRenderArray: GridBlockI[] = []

  public playerPos: GridPosition = { x: 3, y: 5 }
  public playerCurrentRenderedPosition: any = { x: 0, y: 0 }
  public playerPosInArr = 0

  private observedItems: MapSymbol[] = []
  private observer: Observer = new Observer()
  private animater: Animate = new Animate()

  private throttled = false

  private created() {
    this.generateGrid()

    document.addEventListener('keydown', (e: KeyboardEvent) =>
      this.movePlayer(e)
    )
  }

  private get text() {
    return this.observer.getText()
  }

  private movePlayer(e: KeyboardEvent, amount: number = 1) {
    // Need to only do stuff if the key is a directional one
    if (this.throttled === false) {
      let playerX = this.playerPos.x
      let playerY = this.playerPos.y

      switch (e.code) {
        case 'KeyW':
          playerY -= amount
          break
        case 'KeyS':
          playerY += amount
          break
        case 'KeyA':
          playerX -= amount

          break
        case 'KeyD':
          playerX += amount

          break
      }

      if (this.isOutOfBounds(playerX, playerY)) {
        // console.log('Out of bounds!')
      } else if (this.theGrid[playerY][playerX] === MapSymbol.ROCK) {
        // console.log('Invalid move!')
      } else {
        // Successful move into grid
        this.playerPos.x = playerX
        this.playerPos.y = playerY
        this.generateGrid()
      }
    }
  }

  private updatePlayerPosition(newPosition: GridPosition) {
    this.throttled = true
    this.animater.animaterUnit(
      newPosition,
      this.$refs.player as HTMLElement,
      () => {
        this.throttled = false
      }
    )
  }

  private generateGrid() {
    this.gridRenderArray = []
    this.observedItems = []
    for (let gridRow = 0; gridRow < this.gridSize.x; gridRow++) {
      for (let gridItem = 0; gridItem < this.gridSize.y; gridItem++) {
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
    if (objectX >= this.gridSize.x || objectX < 0) {
      return true
    }
    if (objectY >= this.gridSize.y || objectY < 0) {
      return true
    }
    return false
  }

  private addToObserver(grid: GridBlockI) {
    this.observer.addToObserver(grid)
  }
  private removerFromObserver(grid: GridBlockI) {
    this.observer.removeFromObserver(grid)
  }

  private isInObserveRange(gridX: number, gridY: number): boolean {
    const range = 1

    const minX = this.playerPos.x - range
    const minY = this.playerPos.y - range

    const maxX = this.playerPos.x + range
    const maxY = this.playerPos.y + range

    if (
      gridX >= minX &&
      gridY >= minY &&
      (gridX >= minX && gridY <= maxY) &&
      (gridX <= maxX && gridY >= minY)
    ) {
      return true
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
  grid-template-columns: repeat(7, 1fr) minmax(0, 1fr);
  grid-template-rows: repeat(7, 1fr) minmax(0, 1fr);
  background: black;
  border-radius: 20px;
}

#new-player {
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-weight: bold;
  z-index: 11;
  background: purple;
  padding: 5px;
  border-radius: 30%;
}
</style>
