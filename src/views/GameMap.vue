<template>
  <div id="container">
    <!-- grid-template-columns: repeat(7, 1fr) minmax(0, 1fr); -->
    <div
      id="grid"
      ref="grid"
      :style="`grid-template-columns: repeat(${gridSize.x - 1}, 1fr) minmax(0, 1fr);
    grid-template-rows: repeat(${gridSize.y - 1}, 1fr) minmax(0, 1fr)`"
    >
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
      <div id="new-player" ref="player">7</div>
    </div>
    <dialogue-box :text="text" @on-action="movePlayer" :options="actions"></dialogue-box>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import GridBlock from '@/components/GridBlock.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import Grid from '@/lib/grid'
import { MapSymbol } from '@/models/MapSymbol'
import { GridBlockI } from '@/models/GridBlockI'
import { GridPosition } from '@/models/GridPosition'
import { Observer } from '@/utils/Observer'
import { Animate } from '@/utils/Animate'
import { increaseBy, decreaseBy } from '../utils/arithmetic'
import DialogOption from '@/models/DialogOption'

@Component({
  components: {
    GridBlock,
    DialogueBox
  }
})
export default class Map extends Vue {
  public theGrid: MapSymbol[][] = Grid
  public blockWidth = 0.0
  public blockHeight = 0.0
  public gridRenderArray: GridBlockI[] = []

  public playerPos: GridPosition = { x: 3, y: 5, z: 1 }
  public playerCurrentRenderedPosition: any = { x: 0, y: 0 }
  public playerPosInArr = 0

  private observedItems: MapSymbol[] = []

  private observer: Observer = new Observer()
  private animater: Animate = new Animate()

  private throttled = false

  private get gridSize(): GridPosition {
    return {
      x: this.theGrid[0].length,
      y: this.theGrid.length,
      z: 1
    }
  }
  private created() {
    this.generateGrid()

    document.addEventListener('keydown', (e: KeyboardEvent) =>
      this.movePlayer(e)
    )
  }

  private get text() {
    return this.observer.getText()
  }

  private get actions(): DialogOption[] {
    if (this.observer.hasObservedEntities() === true) {
      return [{ id: 1, text: 'observe', childIds: [] }]
    } else {
      return [{ id: 0, text: 'nothing to do', childIds: [] }]
    }
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

  private updatePlayerPosition(newPosition: GridPosition, isInitial?: boolean) {
    this.throttled = true
    let block = this.$refs.player as HTMLElement
    this.animater.animaterUnit(
      newPosition,
      block,
      () => {
        this.throttled = false
        block.style.zIndex = newPosition.z.toString()
      },
      () => {
        const curIndex = Number.parseInt(
          block.style.zIndex ? block.style.zIndex : ''
        )
        if (curIndex < this.playerPos.y)
          block.style.zIndex = this.playerPos.y.toString()
      },
      isInitial
    )
  }

  private generateGrid() {
    this.gridRenderArray = []
    this.observedItems = []
    for (let gridRow = 0; gridRow < this.gridSize.y; gridRow++) {
      for (let gridItem = 0; gridItem < this.gridSize.x; gridItem++) {
        const gridObj: GridBlockI = {
          symbol: this.theGrid[gridRow][gridItem],
          id: Number(gridItem + '' + gridRow),
          zIndex: gridRow
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
