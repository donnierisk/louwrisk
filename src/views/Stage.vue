<template>
  <div id="container" :class="{perspective: perspectiveMode === true }">
    <keyboard-events @move-event="nextTurn" :throttled="throttled" :level="level" />
    <div id="perspective-button" @click="togglePerspective">Perspective</div>
    <camera
      ref="camera"
      :block-size="blockSize"
      :player-position="playerCurrentPosition"
      :camera-offset="cameraOffset"
      :perspectiveMode="perspectiveMode"
      camera-width="1024px"
      camera-height="768px"
    >
      <div id="grid" ref="grid" :style="gridStyle">
        <grid-block
          v-for="(gridItem, i) of gridRenderArray"
          :gridMeta="gridItem"
          :posInArr="i"
          :key="i"
          :terrain="gridItem.symbol"
          :block-size="blockSize"
          @observed="addToObserver"
          @entity-pos="AnimateEntityPosition"
          :is-observed="gridItem.inObserveRange"
        ></grid-block>
        <sprite-block
          v-for="(entity) of gridRenderArray.filter(ent => ent.containedEntity)"
          :is-observed="entity.inObserveRange"
          :block-size="blockSize"
          :animating="animating"
          :entity="entity.containedEntity"
          :ref="entity.containedEntity.type() + entity.containedEntity.getId()"
          :key="entity.containedEntity.type() + entity.containedEntity.getId()"
        />
      </div>
    </camera>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { LevelHandler } from '@/lib/LevelHandler'
import { ActionHandler } from '@/lib/ActionHandler'
import { AIHandler } from '@/lib/AIHandler'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import { GridBlockI } from '@/models/GridBlockI'
import { GridPosition } from '@/models/GridPosition'
import { Animate } from '@/utils/Animate'
import { EntityType } from '../models/Entity/EntityType'
import { Entity } from '@/models/Entity/Entity'
import { Position } from 'vue-router/types/router'
import { Observer } from '@/models/Observer/Observer'
import GridBlock from '@/components/GridBlock.vue'
import Camera from '@/components/Camera.vue'
import EntityComp from '@/components/EntityComp.vue'
import DialogueBox from '@/components/DialogueBox.vue'
import KeyboardEvents from '@/components/KeyboardEvents.vue'
import SpriteBlock from '@/components/SpriteBlock.vue'
import DialogOption from '@/models/DialogOption'
import { PathingHandler } from '../models/Pathing/PathingHandler'
import { EntityObserver } from '../utils/EntityObserver'

@Component({
  components: {
    GridBlock,
    DialogueBox,
    KeyboardEvents,
    EntityComp,
    Camera,
    SpriteBlock
  }
})
export default class Map extends Vue {
  @Prop() private blockSize!: GridPosition

  private Scale: string = ''
  private storeActive: boolean = false
  private level = new LevelHandler()
  private aiHandler = new AIHandler(
    this.level.getAllNPC(),
    new PathingHandler(this.level),
    new Observer(this.level, this.level.getAllNPC()),
    this.level.getPlayer()
  )

  private gridRenderArray: GridBlockI[] = []

  private observedItems: TerrainSymbol[] = []

  private observer: EntityObserver = new EntityObserver()

  private animation = 'idle'
  private animating: boolean = false
  private animater: Animate = new Animate(this.blockSize.x, this.blockSize.y)

  private perspectiveMode: boolean = false
  private throttled = false

  private created() {
    this.generateGrid()
  }

  private mounted() {
    this.storeActive = true
    this.camera.PanCameraToPlayer(false)
  }

  private togglePerspective() {
    this.perspectiveMode = !this.perspectiveMode
  }
  private get camera(): Camera {
    return this.$refs.camera as Camera
  }

  private get description() {
    return this.observer.getDescription()
  }

  private get playerCurrentPosition() {
    return this.level.getPlayer().getPosition()
  }

  private get gridStyle() {
    const _ = this
    let perspectiveCss = ''
    if (this.perspectiveMode === true) {
      const playerCameraPosY = _.playerCurrentPosition.y * _.blockSize.y
      const offsetY = _.blockSize.y * 5

      let cameraY = -(playerCameraPosY - offsetY)
      if (playerCameraPosY < offsetY) {
        cameraY = offsetY - playerCameraPosY
      }
      perspectiveCss = `transform: rotateX(15deg) translateY(${cameraY}px);`
    }
    return `
      ${perspectiveCss}
      grid-template-columns: repeat(${_.level.GridSize.x - 1}, ${
      _.blockSize.x
    }px) minmax(0, ${_.blockSize.x}px);
      grid-template-rows: repeat(${_.level.GridSize.y - 1}, ${
      _.blockSize.y
    }px) minmax(0, ${_.blockSize.y}px);
      width:${_.blockSize.x * _.level.GridSize.x}px;height:${_.blockSize.y *
      _.level.GridSize.y}px;
      padding:${_.blockSize.y * _.level.GridSize.y +
        'px ' +
        _.blockSize.x * _.level.GridSize.x +
        'px'}
      ${_.Scale}
    `
  }

  private get gridDom() {
    return this.storeActive
      ? this.$refs.grid
      : { clientWidth: 0, clientHeight: 0 }
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

  private getEntityRef(type: EntityType, id: number) {
    return ((this.$refs[type + id] as SpriteBlock[])[0] as SpriteBlock)
      .entityRef as HTMLElement
  }

  private AnimateEntityPosition(
    newPosition: GridPosition,
    type: EntityType,
    animate?: boolean,
    id?: number
  ) {
    this.throttled = true
    this.animating = true

    const entity = this.getEntityRef(type, id ? id : 0)
    const startCallback = () => {
      this.throttled = false
      this.animating = false
      this.level.reloadingSave = false
      entity.style.zIndex = newPosition.z ? newPosition.z.toString() : ''
    }

    const endCallback = () => {
      const curIndex = Number(entity.style.zIndex ? entity.style.zIndex : '')
      const entityCurrentPosition: GridPosition = this.level
        .getAllEntities()
        .filter((ent) => ent.type() === type)
        [id ? id : 0].getPosition()

      if (curIndex < entityCurrentPosition.y) {
        entity.style.zIndex = entityCurrentPosition.y.toString()
      }

      if (type === EntityType.PLAYER) {
        this.camera.PanCameraToPlayer(
          animate || this.level.reloadingSave ? false : true
        )
      }
    }

    if (this.level.reloadingSave && type === EntityType.PLAYER) {
      this.camera.PanCameraToPlayer(false)
    }

    const speed = animate || this.level.reloadingSave ? 0 : 0.5

    this.animater.animaterUnit(
      newPosition,
      entity,
      startCallback,
      endCallback,
      speed
    )
  }

  private nextTurn(animation: string) {
    // this.aiHandler.interruptAtPosition(this.playerCurrentPosition)
    this.animation = animation
    this.aiHandler.nextTurn()
    this.generateGrid()
  }

  private generateGrid() {
    this.gridRenderArray = []
    this.observedItems = []
    for (let gridRow = 0; gridRow < this.level.GridSize.y; gridRow++) {
      for (let gridCol = 0; gridCol < this.level.GridSize.x; gridCol++) {
        const gridObj: GridBlockI = {
          symbol: this.level.getTerrain()[gridRow][gridCol],
          id: Number(gridCol + '' + gridRow),
          zIndex: gridRow
        }

        const entity = this.level.getEntityAtPosition(gridCol, gridRow)
        if (entity) {
          if (entity.getSpriteName() === 'player') {
            entity.setAnimation(this.animation)
          }
          gridObj.containedEntity = entity
        }

        if (this.level.isInObserveRange(gridCol, gridRow)) {
          // Check if current gridCol's pos in 2d array matches the playerCurrentPosition
          gridObj.inObserveRange = true
          this.observedItems.push(gridObj.symbol)
        }

        this.gridRenderArray.push(gridObj)
      }
    }
  }

  // Only the observed blocks animate.
  private addToObserver(entity: Entity) {
    this.observer.addToObserver(entity)
  }

  private isPlayer(entity: Entity): boolean {
    return entity.type() === EntityType.PLAYER
  }

  private get cameraOffset(): Position {
    return {
      x: this.blockSize.x * this.level.GridSize.x - this.blockSize.x / 2,
      y: this.blockSize.y * this.level.GridSize.y - this.blockSize.y / 2
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
  transition: transform 1s ease;
  /* Hide scrollbar for Chrome, Safari and Opera */
}

#grid {
  position: relative;
  display: grid;
  border-radius: 20px;
  transform: rotateX(0deg);
  transform-style: preserve-3d;
  transition: transform 1s ease;
}

.entity {
  transform-origin: 0px 0px;
  transform: translateZ(0px) translateX(0px) rotateX(0deg);
  transition: transform 1s ease;
}

.perspective {
  &#container {
    perspective: 100px;
  }
  .entity {
    transform: translateZ(17px) translateX(0px) rotateX(-15deg);
  }
}

#perspective-button {
  cursor: pointer;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background: white;
}
</style>
