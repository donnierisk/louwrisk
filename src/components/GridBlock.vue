<template>
  <div id="gridItem" :class="gridClass()">
    <img v-if="isRock() === true" src="../assets/rock.png" />
    <div v-if="gridMeta.containsPlayer === true" class="player">8</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MapSymbol } from '../models/MapSymbol'
import { GridBlockI } from '../models/GridBlockI'

@Component
export default class GridBlock extends Vue {
  @Prop() private gridMeta!: GridBlockI

  @Prop() private playerPos!: number
  @Prop() private posInArr!: number

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
}
</script>

<style scoped>
#gridItem {
  position: relative;
}

#gridItem:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
}

#gridItem.observed:after {
  content: none;
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
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  font-weight: bold;
  z-index: 1;
  background: red;
  padding: 5px;
  border-radius: 30%;
}

.water .player {
  top: 75%;
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
