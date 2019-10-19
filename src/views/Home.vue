<template>
  <div class="home">
    <game-map />
    <dialogue-option text:="text" :options="options" />
  </div>
</template>

<script lang='ts'>
// @ is an alias to /src
// import LouwRisk from "@/components/Map.vue";

import { Component, Vue } from 'vue-property-decorator'
import DialogueOption from '@/components/DialogueOption.vue'
import GameMap from './GameMap.vue'

@Component({
  components: {
    GameMap,
    DialogueOption
  }
})
export default class Home extends Vue {}
</script>
