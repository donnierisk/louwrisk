<template>
  <div id="container">
    <keyboard-events @key-event="movePlayer" />
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
          :posInArr="i"
          :key="i"
          @observed="addToObserver"
          @player-pos="updatePlayerCurrentPositionition"
        >
          <template v-if="gridItem.containedEntity && !isPlayer(gridItem.containedEntity)">
            <entity-comp :entityparse="gridItem.containedEntity.name" />
          </template>
        </grid-block>
        <div id="new-player" ref="player">
          <div id="player-avatar" :class="{walking: throttled === true}" />
        </div>
      </div>
    </div>
    <dialogue-box :text="description" @on-action="onAction" :options="actions"></dialogue-box>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import GridBlock from '@/components/GridBlock.vue'
import EntityComp from '@/components/EntityComp.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import KeyboardEvents from '@/components/KeyboardEvents.vue'
import Level from '@/lib/Level'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import { GridBlockI } from '@/models/GridBlockI'
import { GridPosition } from '@/models/GridPosition'
import { Observer } from '@/utils/Observer'
import { Animate } from '@/utils/Animate'
import { increaseBy, decreaseBy } from '../utils/arithmetic'
import DialogOption from '@/models/DialogOption'
import { EntityType } from '../models/EntityType'
import { Entity } from '@/models/Entity'

@Component({
  components: {
    GridBlock,
    DialogueBox,
    KeyboardEvents,
    EntityComp
  }
})
export default class Map extends Vue {
  @Prop() private blockSize!: GridPosition

  private terrainFilterBlock: TerrainSymbol[] = [TerrainSymbol.ROCK]

  private theGrid: TerrainSymbol[][] = Level.terrain
  private entities: Entity[] = Level.entities
  private blockWidth = 0.0
  private blockHeight = 0.0
  private gridRenderArray: GridBlockI[] = []

  private playerCurrentRenderedPosition: any = { x: 0, y: 0 }
  private playerCurrentPosition: any = { x: 0, y: 0 }
  private observedItems: TerrainSymbol[] = []

  private observer: Observer = new Observer()
  private animater: Animate = new Animate()

  private throttled = false

  private created() {
    this.playerCurrentPosition = this.entities[0].position
    this.generateGrid()
  }

  private get gridSize(): GridPosition {
    return {
      x: this.theGrid[0].length,
      y: this.theGrid.length,
      z: 1
    }
  }

  private get description() {
    return this.observer.getDescription()
  }

  private get actions(): DialogOption[] {
    if (this.observer.hasObservedEntity() === true) {
      return [{ id: 1, text: 'Do something', childIds: [] }]
    } else {
      return [{ id: 0, text: 'Nothing to do', childIds: [] }]
    }
  }

  private onAction(option: DialogOption) {
    // console.log('TRIGGER ACTION:', JSON.stringify(option))
  }

  private movePlayer(direction: string, amount: number = 1) {
    // Need to only do stuff if the key is a directional one
    if (this.throttled === false) {
      let playerX = this.playerCurrentPosition.x
      let playerY = this.playerCurrentPosition.y

      switch (direction) {
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
      const entity = this.getEntity(playerX, playerY) as Entity
      if (entity && entity.blocks) {
        // console.log('Blocking')
      } else if (this.isOutOfBounds(playerX, playerY)) {
        // console.log('Out of bounds!')
      } else if (this.isBlockedByTerrian(this.theGrid[playerY][playerX])) {
        // console.log('Invalid move!')
      } else {
        // Successful move into grid
        this.playerCurrentPosition.x = playerX
        this.playerCurrentPosition.y = playerY
        this.generateGrid()
      }
    }
  }

  private updatePlayerCurrentPositionition(
    newPosition: GridPosition,
    isInitial?: boolean
  ) {
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
      if (curIndex < this.playerCurrentPosition.y) {
        playerEl.style.zIndex = this.playerCurrentPosition.y.toString()
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

        const entity = this.getEntity(gridItem, gridRow)

        if (entity) {
          gridObj.containedEntity = entity
        }

        if (this.isInObserveRange(gridItem, gridRow)) {
          // Check if current gridItem's pos in 2d array matches the playerCurrentPosition
          gridObj.inObserveRange = true
          this.observedItems.push(gridObj.symbol)
        }

        this.gridRenderArray.push(gridObj)
      }
    }
  }

  private getEntity(x: number, y: number) {
    return this.entities.find((ent: Entity) => {
      return ent.position.x === x && ent.position.y === y
    })
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

  private isEntityPosition(enity: Entity): boolean {
    let returnEntity: boolean = false
    this.entities.forEach((ent: Entity) => {
      if (
        ent.position.x === ent.position.x &&
        ent.position.y === ent.position.y
      ) {
        returnEntity = true
      }
    })

    return returnEntity
  }

  private addToObserver(entity: Entity) {
    this.observer.addToObserver(entity)
  }

  private isPlayer(entity: Entity): boolean {
    return entity.type === EntityType.PLAYER
  }
  private isBlockedByTerrian(terrain: TerrainSymbol): boolean {
    return this.terrainFilterBlock.includes(terrain)
  }

  private isInObserveRange(gridX: number, gridY: number): boolean {
    const range = 2

    const minX = this.playerCurrentPosition.x - range
    const minY = this.playerCurrentPosition.y - range

    const maxX = this.playerCurrentPosition.x + range
    const maxY = this.playerCurrentPosition.y + range

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
  z-index: 11;
}

#new-player #player-avatar {
  width: 128px;
  height: 128px;
  position: absolute;
  background-size: 100%;
  bottom: -32px;
  left: -64px;
  background-position: 0 0;
  background-image: url('../assets/character_main_walking.png');
}

.walking {
  animation: walking 0.5s steps(1) infinite;
}

@keyframes walking {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: 0 -128px;
  }
  50% {
    background-position: 0 0;
  }
  75% {
    background-position: 0 -256px;
  }
}
</style>
