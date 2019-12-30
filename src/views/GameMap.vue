<template>
  <div id="container">
    <keyboard-events 
    @key-event="generateGrid()" 
    :throttled="throttled" 
    :level="level"/>
    <camera 
        ref="camera"
        :block-size="blockSize"
        :player-position="playerCurrentPosition"
        :camera-offset="cameraOffset"
        camera-width="500px"
        camera-height="500px"
      >
      <div
        id="grid"
        ref="grid"
        :style="gridStyle"
      >
        <grid-block
          v-for="(gridItem, i) of gridRenderArray"
          :gridMeta="gridItem"
          :posInArr="i"
          :key="i"
          @observed="addToObserver"
          @player-pos="AnimatePlayerPosition"
        >
          <template v-if="gridItem.containedEntity && !isPlayer(gridItem.containedEntity)">
            <entity-comp :entityparse="gridItem.containedEntity.name" />
          </template>
        </grid-block>
        <div id="new-player" ref="player">
          <div id="player-avatar" :class="{walking: throttled === true}" />
        </div>
      </div>
    </camera>
    <!-- <dialogue-box x:text="description" @on-action="onAction" :options="actions"></dialogue-box> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { LevelHandler } from '@/lib/LevelHandler'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import { GridBlockI } from '@/models/GridBlockI'
import { GridPosition } from '@/models/GridPosition'
import { Observer } from '@/utils/Observer'
import { Animate } from '@/utils/Animate'
import { increaseBy, decreaseBy } from '../utils/arithmetic'
import { EntityType } from '../models/EntityType'
import { Entity } from '@/models/Entity'
import { Position } from 'vue-router/types/router'
import GridBlock from '@/components/GridBlock.vue'
import Camera from '@/components/Camera.vue'
import EntityComp from '@/components/EntityComp.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import KeyboardEvents from '@/components/KeyboardEvents.vue'
import DialogOption from '@/models/DialogOption'

@Component({
  components: {
    GridBlock,
    DialogueBox,
    KeyboardEvents,
    EntityComp,
    Camera
  }
})
export default class Map extends Vue {
  @Prop() private blockSize!: GridPosition

  private Scale: string = ''
  private storeActive: boolean = false
  private level = new LevelHandler()

  private gridRenderArray: GridBlockI[] = []

  private observedItems: TerrainSymbol[] = []

  private observer: Observer = new Observer()
  private animater: Animate = new Animate(this.blockSize.x, this.blockSize.y)

  private throttled = false

  private created() {
    this.generateGrid()
  }

  private mounted() {
    this.storeActive = true
    this.camera.PanCameraToPlayer(false)
  }

  private get camera(): Camera {
    return (this.$refs.camera as Camera)
  }

  private get description() {
    return this.observer.getDescription()
  }

  private get playerCurrentPosition() {
    return this.level.GetPlayer().position
  }

  private get gridStyle() {
    const _ = this
    return `
      grid-template-columns: repeat(${_.level.GridSize.x - 1}, ${_.blockSize.x}px) minmax(0, ${_.blockSize.x}px);
      grid-template-rows: repeat(${_.level.GridSize.y - 1}, ${_.blockSize.y}px) minmax(0, ${_.blockSize.y}px);
      width:${_.blockSize.x * _.level.GridSize.x}px;height:${_.blockSize.y * _.level.GridSize.y}px;
      padding:${(_.blockSize.y * _.level.GridSize.y) + 'px ' + (_.blockSize.x * _.level.GridSize.x) + 'px'}
      ${_.Scale}
    `
  }

  private get gridDom() {
    return this.storeActive ? this.$refs.grid : {clientWidth: 0, clientHeight: 0}
  }

  private get gridWidth() {
    return (this.gridDom as HTMLElement).clientWidth as number
  }

  private get gridHeight() {
    return (this.gridDom as HTMLElement).clientHeight as number
  }

  private get aspectRatio() {
    return this.gridWidth / this.gridHeight
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

  private AnimatePlayerPosition(newPosition: GridPosition, isInitial?: boolean) {
    this.throttled = true
    const playerEl = this.$refs.player as HTMLElement

    const startCallback = () => {
      this.throttled = false
      this.level.reloadingSave = false
      playerEl.style.zIndex = newPosition.z ? newPosition.z.toString() : ''
    }

    const endCallback = () => {
      this.camera.PanCameraToPlayer(isInitial || this.level.reloadingSave ? false : true)

      const curIndex = Number(playerEl.style.zIndex ? playerEl.style.zIndex : '')

      if (curIndex < this.playerCurrentPosition.y) {
        playerEl.style.zIndex = this.playerCurrentPosition.y.toString()
      }
    }

    if (this.level.reloadingSave) {
      this.camera.PanCameraToPlayer(false)
    }
    
    const speed = isInitial || this.level.reloadingSave ? 0 : 0.5

    this.animater.animaterUnit(
      newPosition,
      playerEl,
      startCallback,
      endCallback,
      speed,
      this.$refs.stage as HTMLElement
    )
  }

  private generateGrid() {
    this.gridRenderArray = []
    this.observedItems = []
    for (let gridRow = 0; gridRow < this.level.GridSize.y; gridRow++) {
      for (let gridItem = 0; gridItem < this.level.GridSize.x; gridItem++) {
        const gridObj: GridBlockI = {
          symbol: this.level.GetTerrain()[gridRow][gridItem],
          id: Number(gridItem + '' + gridRow),
          zIndex: gridRow
        }

        const entity = this.level.GetEntity(gridItem, gridRow)

        if (entity) {
          gridObj.containedEntity = entity
        }

        if (this.level.IsInObserveRange(gridItem, gridRow)) {
          // Check if current gridItem's pos in 2d array matches the playerCurrentPosition
          gridObj.inObserveRange = true
          this.observedItems.push(gridObj.symbol)
        }

        this.gridRenderArray.push(gridObj)
      }
    }
  }

  private addToObserver(entity: Entity) {
    this.observer.addToObserver(entity)
  }

  private isPlayer(entity: Entity): boolean {
    return entity.type === EntityType.PLAYER
  }

  private get cameraOffset(): Position {
    return {
      x: this.blockSize.x * this.level.GridSize.x  - (this.blockSize.x / 2),
      y: this.blockSize.y * this.level.GridSize.y - (this.blockSize.y / 2)
    }
  }
}
</script>

<style scoped lang="scss">
#container {
  background: black;  
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  /* Hide scrollbar for Chrome, Safari and Opera */
}

#grid {
  position: relative;
  display: grid;
  border-radius: 20px;
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
