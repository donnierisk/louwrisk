<template>
  <div>
    <div id="dashboard">
      <div id="inventory">
        <div v-for="(item, i) in inventory" :key="i">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
// This component might become absolute the SpriteBlock.vue
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Entity } from '@/models/Entity/Entity'

@Component
export default class Dashboard extends Vue {
  @Prop() inventory!: string[]
}
</script>

<style scoped lang="scss">
#dashboard {
  #inventory {
    position: fixed;
    left: 0;
    right: 0;
    width: 30rem;
    background: #c7832e;
    display: flex;
    margin: 0 auto;
    bottom: 0;
    z-index: 1;
    padding: 0.5rem;
    width: fit-content;

    > div {
      width: 3rem;
      height: 3rem;
      background: white;
      margin: 0.3rem;
    }
  }
}
</style>
