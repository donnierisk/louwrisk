<template>
  <div id="container">
    <!-- grid-template-columns: repeat(7, 1fr) minmax(0, 1fr); -->
    <div class="stage">
      <div
        id="grid"
        ref="grid"
        :style="`
          grid-template-columns: repeat(${gridSize.x - 1}, ${blockSize.x}px) minmax(0, ${blockSize.x}px);
          grid-template-rows: repeat(${gridSize.y - 1}, ${blockSize.y}px) minmax(0, ${blockSize.y}px);
          width:${blockSize.x*gridSize.x}px;height:${blockSize.y*gridSize.y}px;
        `"
      >
        <grid-block
          v-for="(gridItem, i) of gridRenderArray"
          :gridMeta="gridItem"
          :playerPos="playerPosInArr"
          :posInArr="i"
          :key="i"
          @observed="addToObserver"
          @player-pos="updatePlayerPosition"
        />
        <div id="new-player" ref="player">7</div>
      </div>
    </div>
    <dialogue-box :text="text" @on-action="onAction" :options="actions"></dialogue-box>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import GridBlock from '@/components/GridBlock.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import Grid from '@/lib/Grid'
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
  private get gridSize(): GridPosition {
    return {
      x: this.theGrid[0].length,
      y: this.theGrid.length,
      z: 1
    }
  }

  private theGrid: MapSymbol[][] = Grid
  private blockWidth = 0.0
  private blockHeight = 0.0
  private gridRenderArray: GridBlockI[] = []

  private playerPos: GridPosition = { x: 3, y: 5, z: 1 }
  private playerCurrentRenderedPosition: any = { x: 0, y: 0 }
  private playerPosInArr = 0
  @Prop() private blockSize!: GridPosition

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

  private get actions(): DialogOption[] {
    if (this.observer.hasObservedEntities() === true) {
      const id = this.observer.getObservedEntities().id
      return [{ id: 1, text: 'observe', childIds: [id] }]
    } else {
      return [{ id: 0, text: 'nothing to do', childIds: [] }]
    }
  }

  private onAction(option: DialogOption) {
    console.log('TRIGGER ACTION:', JSON.stringify(option))
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
    const playerEl = this.$refs.player as HTMLElement
    const startCallback = () => {
      this.throttled = false
      playerEl.style.zIndex = newPosition.z ? newPosition.z.toString() : ''
    }
    const endCallback = () => {
      const curIndex = Number(
        playerEl.style.zIndex ? playerEl.style.zIndex : ''
      )
      if (curIndex < this.playerPos.y) {
        playerEl.style.zIndex = this.playerPos.y.toString()
      }
    }
    this.animater.animaterUnit(
      newPosition,
      playerEl,
      startCallback,
      endCallback,
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
  display: grid;
  border-radius: 20px;
}

.stage {
  background: black;
  width: 100vw;
  height: 70vh;
  display: flex;
  justify-content: center;
  overflow: auto;
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
