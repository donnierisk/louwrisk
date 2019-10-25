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
      />
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
import { GridBlockI } from '@/models/GridBlockI'
import { GridPosition } from '@/models/GridPosition'
import { Observer } from '@/utils/Observer'
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
  public blockWidth = 0.00;
  public blockHeight = 0.00;
  public gridRenderArray: GridBlockI[] = []

  public playerPos: GridPosition = { x: 3, y: 5 }
  public playerRenderPos: any = { x: 100, y: 0 }
  public playerPosInArr = 0

  private observedItems: MapSymbol[] = []
  private observer: Observer = new Observer()

  private throttled = false;
  private moveTimeout: any;
  private moveInterval: any;
  private options = [
    // MoveSymbol.NORTH,
    // MoveSymbol.SOUTH,
    // MoveSymbol.WEST,
    // MoveSymbol.EAST
  ]

  private created() {
    this.generateGrid()

    document.addEventListener('keydown', (e) => this.movePlayer(e));
  }

  private mounted() {

    // @ts-ignore
    const block = this.$refs.grid.lastChild.getBoundingClientRect();

    if (block.width) {
      // `width` is available for IE9+
      this.blockWidth = block.width;
      this.blockHeight = block.height;

      this.playerRenderPos.x = this.blockWidth * this.playerPos.x + (this.blockWidth / 2);
      this.playerRenderPos.y = this.blockHeight * this.playerPos.y + (this.blockHeight * 0.3);
      // @ts-ignore
      this.$refs.player.style.left = this.playerRenderPos.x + 'px';
      // @ts-ignore
      this.$refs.player.style.top = this.playerRenderPos.y + 'px';
    }
  }

  private get text() {
    return this.observer.getText()
  }

  private movePlayer(e: KeyboardEvent, amount: number = 1) {

    // Need to only do stuff if the key is a directional one
    if (this.throttled === false) {

      let playerX = this.playerPos.x
      let playerY = this.playerPos.y
      let moveFunc: any;
      let playerDirection = '';

      switch (e.code) {
        case 'KeyW':
          playerY -= amount
          moveFunc = () => {
            this.playerRenderPos.y = decreaseBy(this.playerRenderPos.y, this.blockHeight / 5)
            // @ts-ignore
            this.$refs.player.style.top = this.playerRenderPos.y + 'px';
          }
          break
        case 'KeyS':
          playerY += amount
          moveFunc = () => {
            this.playerRenderPos.y = increaseBy(this.playerRenderPos.y, this.blockHeight / 5)
            // @ts-ignore
            this.$refs.player.style.top = this.playerRenderPos.y + 'px';
          }
          break
        case 'KeyA':
          playerX -= amount
          moveFunc = () => {
            this.playerRenderPos.x = decreaseBy(this.playerRenderPos.x, this.blockWidth / 5)
            // @ts-ignore
            this.$refs.player.style.left = this.playerRenderPos.x + 'px';
          }
          break
        case 'KeyD':
          playerX += amount
          moveFunc = () => {
            this.playerRenderPos.x = increaseBy(this.playerRenderPos.x, this.blockWidth / 5)
            // @ts-ignore
            this.$refs.player.style.left = this.playerRenderPos.x + 'px';
          }
          break
      }

      if (this.isOutOfBounds(playerX, playerY)) {
        console.log('Out of bounds!')
      } else if (this.theGrid[playerY][playerX] === MapSymbol.ROCK) {
        console.log('Invalid move!')
      } else {

        // Successful move into grid
        this.playerPos.x = playerX
        this.playerPos.y = playerY

        this.throttled = true;

        // moves at a rate of 50 ms for a total of 500 ms (time it takes for throttle to finish)
        this.moveInterval = setInterval(() => {
          moveFunc();
        }, 100);

        clearTimeout(this.moveTimeout)
        this.moveTimeout = setTimeout(() => {
          this.throttled = false
          clearInterval(this.moveInterval)
          this.generateGrid()
        }, 500)

      }

    }
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

    const minX = this.playerPos.x - range;
    const minY = this.playerPos.y - range;

    const maxX = this.playerPos.x + range;
    const maxY = this.playerPos.y + range;

    if ((gridX >= minX && gridY >= minY) &&
      (gridX >= minX && gridY <= maxY) &&
      (gridX <= maxX && gridY >= minY)) {
      return true
    }
    return false;
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
