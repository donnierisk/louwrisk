<template>
  <div>
    <h2>Game Map:</h2>
    <!-- <div id="grid"><grid-block v-for</div> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { GridBlock } from '@/components/GridBlock.vue'
import Grid from '@/lib/grid'

@Component({
  components: {
    GridBlock
  }
})
export default class Map extends Vue {
  public gridSize: number[] = [8, 4]
  public theGrid: number[][] = [[1, 2, 3], [1, 2, 3]]
}
</script>
