<template>
  <div id="gridItem" :class="gridClass()"></div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MapSymbol } from '../models/MapSymbol'

@Component
export default class GridBlock extends Vue {
  @Prop() private type!: MapSymbol

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
        return randomTerr > 5 ? 'ground' : 'grass'
    }
  }
}
</script>

<style scoped>
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
