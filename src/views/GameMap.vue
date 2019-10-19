<template>
  <div>
    <h2>Game Map:</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GridBlock } from "@/components/GridBlock.vue";

@Component({
  components: {
    GridBlock
  }
})
export default class Map extends Vue {
  gridSize: number[] = [8, 4];
}
</script>
