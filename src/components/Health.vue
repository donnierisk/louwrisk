<template>
  <div>
    <div id="health" v-if="health.curr > 0">
      <span id="text">{{ (health.curr / health.base) * 100 + '%'}}</span>
      <div id="green" :style="{'width': (health.curr / health.base) * 100 + '%'}"></div>
    </div>
    <div id="halo" v-else></div>
  </div>
</template>

<script lang='ts'>
// This component might become absolute the SpriteBlock.vue
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Entity } from '@/models/Entity/Entity'
import { SingleStatus } from '../models/Entity/EntityInterface'
@Component
export default class Health extends Vue {
  @Prop() private health?: SingleStatus
}
</script>

<style scoped lang="scss">
#health {
  position: absolute;
  width: 6rem;
  height: 0.5rem;
  background: red;
  z-index: 1;
  top: -4.8rem;
  left: -3rem;
  text-align: center;
  #text {
    color: white;
    font-weight: bolder;
    font-size: 0.4rem;
    position: relative;
    top: -0.6rem;
    z-index: 3;
  }
  #green {
    transition: width 0.2s linear;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #00ff00;
    z-index: 2;
  }
}

#halo {
  border: 0.3rem solid gold;
  position: absolute;
  border-radius: 50%;
  height: 1rem;
  width: 3rem;
  top: -5rem;
  left: -1.5rem;
  filter: drop-shadow(0px 1px 4px yellow);
}
</style>
