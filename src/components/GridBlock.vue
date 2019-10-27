<template>
  <div ref="block" id="gridItem" :class="gridClass()" :style="`z-index: ${gridMeta.zIndex}`">
    <img v-if="isRock() === true" src="../assets/rock.png" />
    <div ref="player" v-if="gridMeta.containsPlayer === true" class="player">8</div>
  </div>
</template> 

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { MapSymbol } from '../models/MapSymbol'
import { GridBlockI } from '../models/GridBlockI'
import { GridPosition } from '../models/GridPosition'

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

  mounted() {
    if (this.gridMeta.containsPlayer === true) {
      this.emitPosition(true)
    }
  }

  public isRock() {
    return this.gridMeta.symbol === MapSymbol.ROCK
  }

  public gridClass() {
    let classList = ''
    if (this.gridMeta.inObserveRange === true) {
      classList += 'observed '
    }
    switch (this.gridMeta.symbol) {
      case MapSymbol.GROUND:
        return classList + 'ground'
      case MapSymbol.ROCK:
        return classList + 'rock'
      case MapSymbol.WATER:
        return classList + 'water'
      default:
        // const randomTerr = Math.floor(Math.random() * 10)
        // if (randomTerr > 8) {
        //   return 'ground'
        // }
        // if (randomTerr > 6) {
        //   return 'water'
        // } else {
        return classList + 'grass'
      // }
    }
  }

  @Watch('gridMeta.inObserveRange')
  public onObserveChange(newVal: string) {
    if (newVal) {
      this.emitObserver('enter-vision')
    } else {
      this.emitObserver('leave-vision')
    }
  }

  @Watch('gridMeta.containsPlayer')
  public onPositionChange(newVal: boolean) {
    if (newVal) {
      this.emitPosition()
    }
  }

  private emitPosition(isInitial?: boolean) {
    const elem = this.$refs.block as HTMLElement
    const player = this.$refs.player as HTMLElement
    this.position.x = elem.offsetLeft + elem.offsetWidth / 2
    this.position.y = elem.offsetTop + elem.offsetHeight / 2
    this.position.z = this.gridMeta.zIndex
    this.$emit('player-pos', this.position)
    this.$emit('player-pos', this.position, isInitial)
  }

  private emitObserver(functionName: string) {
    this.$emit(functionName, this.gridMeta)
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

#gridItem.observed {
  opacity: 1;
  filter: none;
  transition: filter 470ms ease-out;
}

img {
  position: absolute;
  width: 80%;
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
</style>
