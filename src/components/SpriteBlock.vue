<template>
  <div class="sprite-block" :class="[imageTerrain, {entity: hasEntity, observed: isObserved}]" :id="entName" ref="entity">
    <div v-if="hasEntity" class="entity-avatar" :class="{walking: animating}" :style="`background-image: url(${imageEntity})`"/>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { TerrainSymbol } from '../models/TerrainSymbol'
import { Entity } from '@/models/Entity';

@Component
export default class SpriteBlock extends Vue {
  @Prop() private animating?: boolean
  @Prop() private isObserved?: boolean
  @Prop() private terrain?: TerrainSymbol
  @Prop() private entity?: Entity

  private get imageEntity(): string {
    return this.entity ? require(`../assets/${this.entity.name}.png`) : require(`../assets/blank.png`)
  }

  private get hasEntity() {
    return this.entity ? true : false
  }


  private get entName() {
    return this.entity ? this.entity.name : ''
  }

  private get imageTerrain(): TerrainSymbol {
    return this.terrain ? this.terrain : TerrainSymbol.EMPTY
  }

  public get entityRef() {
    return this.$refs.entity
  }
}
</script>

<style>
.sprite-block {
  width: 100%;
  height: 100%;
  filter: brightness(50%);
}

.sprite-block.observed {
  filter: none;
  transition: filter 470ms ease-out;
}

.crate {
  width: 128px;
  height: 128px;
}

.water {
  background: lightskyblue;
  overflow: hidden;
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

.ground {
  background: #a5742a;
  border-radius: 50%;
}

.rock {
  background: greenyellow;
  background-image: url(../assets/r.png);
  background-size: 100% 100%;
}

.grass {
  background: greenyellow;
}

.player {
  color: white;
  font-weight: bold;
  height: 20px;
  z-index: 1;
  background: red;
  padding: 5px;
  border-radius: 30%;
  opacity: 0;
}

.entity {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
}

.entity .entity-avatar {
  width: 128px;
  height: 128px;
  top: -87px;
  left: -63px;
  position: absolute;
  background-size: 100%;
  background-position: 0 0;
}

.walking {
  animation: walking 0.5s steps(1) infinite;
}

@keyframes walking {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: 0 -128px;
  }
  50% {
    background-position: 0 0;
  }
  75% {
    background-position: 0 -256px;
  }
}
</style>
