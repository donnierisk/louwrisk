<template>
  <div
    ref="block"
    id="gridItem"
    @click="observe"
    :class="gridClass()"
    :style="`z-index: ${gridMeta.zIndex};`"
  >
    <div ref="player" v-if="hasPlayer()" class="player">8</div>
    <div v-if="gridMeta.symbol" :class="gridClass()">
      <img :src="imagePath" />
    </div>
    <slot></slot>
  </div>
</template> 

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { TerrainSymbol } from '../models/TerrainSymbol'
import { GridBlockI } from '../models/GridBlockI'
import { GridPosition } from '../models/GridPosition'
import { EntityType } from '../models/EntityType'

@Component
export default class GridBlock extends Vue {
  @Prop() private gridMeta!: GridBlockI
  @Prop() private playerPos!: number
  @Prop() private posInArr!: number

  private position: GridPosition = {
    x: 0,
    y: 0,
    z: this.gridMeta.zIndex
  }

  private get imagePath() {
    let returnPath = 'blank'
    if (
      this.gridMeta.symbol !== TerrainSymbol.WATER &&
      this.gridMeta.symbol !== TerrainSymbol.GROUND &&
      this.gridMeta.symbol !== TerrainSymbol.EMPTY
    ) {
      returnPath = this.gridMeta.symbol
    }
    return require(`../assets/${returnPath}.png`)
  }

  private mounted() {
    if (
      this.gridMeta.containedEntity !== undefined &&
      this.gridMeta.containedEntity.type === EntityType.PLAYER
    ) {
      this.emitPosition(true)
    }
  }

  private hasPlayer() {
    return (
      this.gridMeta.containedEntity !== undefined &&
      this.gridMeta.containedEntity.type === EntityType.PLAYER
    )
  }

  private gridClass() {
    let classList = ''
    if (this.gridMeta.inObserveRange === true) {
      classList += 'observed '
    }
    switch (this.gridMeta.symbol) {
      case TerrainSymbol.GROUND:
        return classList + 'ground'
      case TerrainSymbol.WATER:
        return classList + 'water'
      case TerrainSymbol.ROCK:
        return classList + 'rock'
      default:
        return classList + 'grass'
    }
  }

  @Watch('gridMeta.containedEntity')
  private onPositionChange(newVal: any) {
    if (newVal && newVal.type === EntityType.PLAYER) {
      this.emitPosition(false)
    }
  }

  private emitPosition(isInitial?: boolean) {
    const elem = this.$refs.block as HTMLElement
    const player = this.$refs.player as HTMLElement
    this.position.x = elem.offsetLeft + elem.offsetWidth / 2
    this.position.y = elem.offsetTop + elem.offsetHeight / 2
    this.position.z = this.gridMeta.zIndex
    this.$emit('player-pos', this.position, isInitial)
  }

  private observe(e: Event) {
    if (this.gridMeta.inObserveRange) {
      this.$emit('observed', this.gridMeta.containedEntity)
    }
  }
}
</script>

<style scoped>
#gridItem {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: brightness(50%);
  z-index: 5;
}

#gridItem.observed:hover {
  box-shadow: 0 0 5px 1px purple inset;
}

#gridItem.observed {
  opacity: 1;
  filter: none;
  transition: filter 470ms ease-out;
}

img {
  position: absolute;
  width: 100%;
  height: auto;
  bottom: 0;
  left: 0;
}
p {
  margin: 0;
}
.rock {
  background: greenyellow;
}

.water {
  background: lightskyblue;
  overflow: hidden;
}
.ground {
  background: #a5742a;

  border-radius: 50%;
  width: 80%;
  height: 90%;
}

.grass {
  background: greenyellow;
}

.player {
  color: white;
  font-weight: bold;
  width: 10px;
  height: 20px;
  z-index: 1;
  background: red;
  padding: 5px;
  border-radius: 30%;
  opacity: 0;
}

.water .player {
  top: 60%;
}

.water .player:after {
  content: '';
  width: 100%;
  left: 0;
  height: 15px;
  background: lightskyblue;
  z-index: 11;
  position: absolute;
  bottom: 0;
}

#crate {
  width: 128px;
  height: 128px;
}
</style>
