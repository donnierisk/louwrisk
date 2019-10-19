<template>
  <div id="gridItem" :class="gridClass()">
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
        if (randomTerr > 8) return 'ground'
        if (randomTerr > 6) return 'water'
        else return 'grass'
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
}
.empty {
  background: white;
}

.rock {
  background: #676767;
}

.water {
  background: lightskyblue;
}

.ground {
  background: #a5742a;
}

.grass {
  background: greenyellow;
}
</style>
