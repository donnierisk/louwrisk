<template>
  <div id="container">
    <keyboard-events 
    @key-event="generateGrid()" 
    :throttled="throttled" 
    :level="Level"/>
    <div class="stage" id="stage" ref="stage" :class="{'stage-fit': aspectRatioType === 'fit'}">
      <vue-scroll ref="vs">
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
      </vue-scroll>
    </div>
    <dialogue-box x:text="description" @on-action="onAction" :options="actions"></dialogue-box>
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
import vuescroll from 'vuescroll';

interface ScrollEventPar {
  barSize: number
  process: number
  scrollTop?: number
  scrollLeft?: number
  type: string
}

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
  @Prop() private aspectRatioType?: string

  private Scale: string = ''
  private Level = new LevelHandler()

  private gridRenderArray: GridBlockI[] = []

  private observedItems: TerrainSymbol[] = []

  private observer: Observer = new Observer()
  private animater: Animate = new Animate(this.blockSize.x, this.blockSize.y)

  private throttled = false

  private created() {
    this.generateGrid()
  }

  private mounted() {
    this.changeRatio()
    this.scrollToPlayer(1, 1, false, true)
  }

  private get description() {
    return this.observer.getDescription()
  }

  private get gridDom() {
    return this.$refs.grid ? this.$refs.grid : {clientWidth: 0, clientHeight: 0}
  }

  private get stageDom() {
    return this.$refs.stage ? this.$refs.stage : {clientWidth: 0, clientHeight: 0}
  }

  private get gridWidth() {
    return (this.gridDom as HTMLElement).clientWidth as number
  }

  private get gridHeight() {
    return (this.gridDom as HTMLElement).clientHeight as number
  }

  private get screenWidth() {
    return (this.stageDom as HTMLElement).clientWidth as number
  }

  private get screenHeight() {
    return (this.stageDom as HTMLElement).clientHeight as number
  }

  private get aspectRatio() {
    return this.gridWidth / this.gridHeight
  }

  private get playerCurrentPosition() {
    return this.Level.GetPlayer().position
  }


  @Watch('aspectRatioType')
  private onPositionChange(newVal: any) {
    this.changeRatio()
  }

  private changeRatio() {
    if (this.aspectRatioType === 'fit') {
      let resizedHeight: number = 0
      let resizedWidth: number  = 0

      if (this.screenHeight < this.screenWidth) {
        resizedHeight = this.screenHeight
        resizedWidth = resizedHeight * this.aspectRatio
      } else {
        resizedWidth = this.screenWidth
        resizedHeight = resizedWidth / this.aspectRatio
      }
      this.Scale = `
        transform: scale(${resizedHeight / this.gridHeight});
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
      const absX = newPosition.x > playerEl.offsetLeft ? 1 : newPosition.x === playerEl.offsetLeft ? 0 : -1
      const absY = newPosition.y > playerEl.offsetTop ? 1 : newPosition.y === playerEl.offsetTop ? 0 : -1
      if (this.aspectRatioType !== 'fit') {
        this.scrollToPlayer(
          absX,
          absY,
          true,
          false
        )
      }
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

  private scrollToPlayer(
    absX: number = 1,
    absY: number = 1,
    animate: boolean = false,
    initial: boolean = false
  ) {
    if (initial) {
      (this.$refs.vs as vuescroll).scrollIntoView('#new-player', 0 as any);
      (this.$refs.vs as vuescroll).scrollBy({dy: -this.screenHeight / 2, dx: -this.screenWidth / 2} as any, 0 as any);
    } else {
      (this.$refs.vs as vuescroll).scrollBy(
        {
          dx: absX * this.blockSize.x,
          dy: absY * this.blockSize.y
        } as any,
        animate ? 500 : 0 as any
      );
    }
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
  align-items: flex-start;
  overflow: hidden;
  &.stage-fit {
    align-items: center;
  }
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
