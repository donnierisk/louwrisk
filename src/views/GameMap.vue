<template>
  <div id="container">
    <keyboard-events 
    @key-event="generateGrid()" 
    :throttled="throttled" 
    :level="Level"/>
    <div class="stage" id="stage" ref="stage">
      <div
        id="grid"
        ref="grid"
        :style="`
          grid-template-columns: repeat(${Level.GridSize.x - 1}, ${blockSize.x}px) minmax(0, ${blockSize.x}px);
          grid-template-rows: repeat(${Level.GridSize.y - 1}, ${blockSize.y}px) minmax(0, ${blockSize.y}px);
          width:${blockSize.x*Level.GridSize.x}px;height:${blockSize.y*Level.GridSize.y}px;
          padding:${blockSize.y}px ${blockSize.x}px;
          ${Scale}
        `"
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
import { LevelHandler } from '@/lib/LevelHandler'
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
  @Prop() private aspectRatio?: string

  private Scale: string = ''
  private Level = new LevelHandler()

  private blockWidth = 0.0
  private blockHeight = 0.0
  private gridRenderArray: GridBlockI[] = []

  private observedItems: TerrainSymbol[] = []

  private observer: Observer = new Observer()
  private animater: Animate = new Animate()

  private throttled = false

  private created() {
    this.generateGrid()
  }

  private mounted() {
    this.changeRatio()
  }

  private get description() {
    return this.observer.getDescription()
  }

  private get playerCurrentPosition() {
    return this.Level.GetPlayer().position
  }


  @Watch('aspectRatio')
  private onPositionChange(newVal: any) {
    this.changeRatio()
  }

  private changeRatio() {
    if (this.$refs.grid && this.$refs.stage && this.aspectRatio === 'fit') {
      const width: number  = (this.$refs.grid as HTMLElement).clientWidth as number
      const height: number = (this.$refs.grid as HTMLElement).clientHeight as number
      const screenWidth: number  = (this.$refs.stage as HTMLElement).clientWidth as number
      const screenHeight: number  = (this.$refs.stage as HTMLElement).clientHeight as number
      const aspect: number = width / height
      let resizedHeight: number = 0
      let resizedWidth: number  = 0

      if (screenHeight < screenWidth) {
        resizedHeight = screenHeight
        resizedWidth = resizedHeight * aspect
      } else {
        resizedWidth = screenWidth
        resizedHeight = resizedWidth / aspect
      }
      this.Scale = `
        transform: scale(${resizedHeight / height});
      `
    } else {
      this.Scale = ''
    }
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

  private AnimatePlayerPosition(
    newPosition: GridPosition,
    isInitial?: boolean
  ) {

    this.throttled = true
    const playerEl = this.$refs.player as HTMLElement

    const startCallback = () => {
      this.throttled = false
      this.Level.reloadingSave = false
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

    const speed = isInitial || this.Level.reloadingSave ? 0 : 0.5

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
    for (let gridRow = 0; gridRow < this.Level.GridSize.y; gridRow++) {
      for (let gridItem = 0; gridItem < this.Level.GridSize.x; gridItem++) {
        const gridObj: GridBlockI = {
          symbol: this.Level.GetTerrain()[gridRow][gridItem],
          id: Number(gridItem + '' + gridRow),
          zIndex: gridRow
        }

        const entity = this.Level.GetEntity(gridItem, gridRow)

        if (entity) {
          gridObj.containedEntity = entity
        }

        if (this.Level.IsInObserveRange(gridItem, gridRow)) {
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
}
</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Hide scrollbar for Chrome, Safari and Opera */
}

#grid {
  position: relative;
  display: grid;
  border-radius: 20px;
}

.stage {
  background: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  #new-player {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
  }
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
