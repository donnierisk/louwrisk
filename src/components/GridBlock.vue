<template>
  <div id="gridItem" :class="gridClass()">
    <img v-if="isRock() === true" src="../assets/rock.png" />
    <p v-if="playerPos === posInArr">8</p>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MapSymbol } from '../models/MapSymbol'

@Component
export default class GridBlock extends Vue {
  @Prop() private type!: MapSymbol
  @Prop() private playerPos!: number
  @Prop() private posInArr!: number

  public isRock() {
    return this.type === MapSymbol.ROCK
  }
  public gridClass() {
    switch (this.type) {
      case MapSymbol.GROUND:
        return 'ground'
      case MapSymbol.ROCK:
        return 'rock'
      case MapSymbol.WATER:
        return 'water'
      default:
        const randomTerr = Math.floor(Math.random() * 10)
        if (randomTerr > 8) {
          return 'ground'
        }
        if (randomTerr > 6) {
          return 'water'
        } else {
          return 'grass'
        }
    }
  }
}
</script>

<style scoped>
#gridItem {
  position: relative;
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
  border-radius: 50%;
  width: 80%;
  height: 80%;
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
</style>
