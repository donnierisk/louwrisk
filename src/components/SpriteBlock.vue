<template>
  <div
    class="sprite-block"
    :class="[imageTerrain, {entity: hasEntity, observed: isObserved}, entName]"
    :id="entName"
    ref="entity"
    :style="entityStyle"
  >
    <div ref="entityModel" v-if="hasEntity" class="entity-avatar" :style="imageMeta" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { TerrainSymbol } from '../models/TerrainSymbol'
import { Entity } from '@/models/Entity/Entity'
import {
  spriteConfig,
  ISpriteConfig,
  ISpriteMeta
} from '@/lib/SpriteConfigEntity'
import { TimelineLite } from 'gsap'
import { GridPosition } from '@/models/GridPosition'

@Component
export default class SpriteBlock extends Vue {
  @Prop() private animating?: boolean
  @Prop() private isObserved?: boolean
  @Prop() private terrain?: TerrainSymbol
  @Prop() private entity?: Entity
  @Prop() private blockSize!: GridPosition

  private spriteMeta: ISpriteMeta = {
    pos: { x: '0px', y: '0px' },
    gridSpan: { x: 1, y: 1 },
    sourceBlock: { x: 0, y: 0 }
  }

  created() {
    if (this.entity) {
      this.spriteMeta = spriteConfig[this.entity.getSpriteName()]
    }
  }
  private get imageMeta(): any {
    if (this.entity) {
      const width = this.spriteMeta.gridSpan.x * this.blockSize.x
      const height = this.spriteMeta.gridSpan.y * this.blockSize.y

      const spriteCss = {
        backgroundImage: `url(${require('../assets/spritesheet.png')})`,
        backgroundPosition: `${this.spriteMeta.pos.x} ${this.spriteMeta.pos.y}`,
        width: width + 'px',
        height: height + 'px',
        top:
          -(this.spriteMeta.sourceBlock.y * this.blockSize.y) -
          this.blockSize.y / 2 +
          'px',
        left:
          -(this.spriteMeta.sourceBlock.x * this.blockSize.x) -
          this.blockSize.x / 2 +
          'px'
      }
      return spriteCss
    }
    return ''
  }

  private get entityStyle() {
    const width = this.spriteMeta.gridSpan.x * this.blockSize.x
    const height = this.spriteMeta.gridSpan.y * this.blockSize.y
    if (this.hasEntity) {
      return {
        top: -height + 'px',
        left: width / 2 + 'px'
      }
    } else return {}
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
.entity {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
}

.sprite-block {
  width: 100%;
  height: 100%;
  filter: brightness(50%);
}

.entity .entity-avatar {
  position: absolute;
  background-size: 896px 640px;
  display: block;
}

.sprite-block.observed {
  filter: none;
  transition: filter 470ms ease-out;
}

.crate {
}

.tree .entity-avatar {
}

.wagon .entity-avatar {
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
  background: #4baf50;
  background-image: url(../assets/r.png);
  background-size: 100% 100%;
}

.gridItem:nth-child(11n + 1) .grass,
.gridItem:nth-child(7n + 1) .grass {
  background: url(../assets/terrainsheet.png);
  background-position: 0 -83px;
  background-size: 650px 260px;
}

/* .grass {
  background: url(../assets/terrainsheet.png);
  background-size: 650px 384px;
  background-position: 0 0;
} */
</style>
