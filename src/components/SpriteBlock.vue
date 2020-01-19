<template>
  <div
    class="sprite-block"
    :class="[imageTerrain, {entity: hasEntity, observed: isObserved}]"
    :id="entName"
    ref="entity"
  >
    <div ref="entityModel" v-if="hasEntity" class="entity-avatar" :style="imageMeta" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { TerrainSymbol } from '../models/TerrainSymbol'
import { Entity } from '@/models/Entity/Entity'
import { spriteConfig } from '@/lib/SpriteConfig'
import { TimelineLite } from 'gsap'

@Component
export default class SpriteBlock extends Vue {
  @Prop() private animating?: boolean
  @Prop() private isObserved?: boolean
  @Prop() private terrain?: TerrainSymbol
  @Prop() private entity?: Entity

  private get imageMeta(): string {
    if (this.entity) {
      const sprite = spriteConfig[this.entity.getSpriteName()]

      const spriteCss = `
        background-image: url(${require('../assets/spritesheet.png')});
        background-position: ${sprite.pos.x} ${sprite.pos.y};
      `
      return spriteCss
    }
    return ''
  }

  @Watch('animating')
  private animateModel() {
    // NEED TO ALSO CHECK WHICH ANIMATION SHOULD HAPPEN, NOW ONLY WORKS FOR WALK
    if (
      this.entity &&
      this.animating === true &&
      this.entity.getSpriteName() === 'player'
    ) {
      const el = this.$refs.entityModel
      const timeline = new TimelineLite()

      // NEED TO FINALISE THE TIMING BELOW, NOT 100% RIGHT
      timeline
        .to(el, 0, { backgroundPosition: '0 0' })
        .to(el, 0, { delay: 0.1, backgroundPosition: '0 -128px' })
        .to(el, 0, { delay: 0.1, backgroundPosition: '0 0' })
        .to(el, 0, { delay: 0.1, backgroundPosition: '0 -256px' })
        .to(el, 0, { delay: 0.1, backgroundPosition: '0 0' })
    }
  }

  private get hasEntity() {
    return this.entity ? true : false
  }

  private get entName() {
    return this.entity ? this.entity.getSpriteName() : ''
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
  background-size: 640px 384px;
}
</style>
