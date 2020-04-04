<template>
  <div
    class="sprite-block"
    :class="[imageTerrain, {entity: hasEntity, observed: isObserved}, entName]"
    :id="entName"
    ref="entity"
    :style="entityStyle"
    @click="inspect"
  >
    <div
      ref="entityModel"
      v-if="hasEntity"
      :class="{isDead: entity.getFields().mortalState === 'd'}"
      class="entity-avatar"
      :style="imageMeta"
    />
    <health
      v-if="hasEntity && entity.getFields().mortalState === 'a' || entity.getFields().mortalState === 'd'"
      :health="entityStatus.health"
    />
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
import { TweenLite, TimelineMax } from 'gsap'
import { GridPosition } from '@/models/GridPosition'
import { EntityType } from '@/models/Entity/EntityType'
import { Direction } from '../models/Direction'
import Health from '@/components/Health.vue'
import { MortalState } from '../models/MortalState'

@Component({
  components: {
    Health
  }
})
export default class SpriteBlock extends Vue {
  @Prop() private animating?: boolean
  @Prop() private isObserved?: boolean
  @Prop() private terrain?: TerrainSymbol
  @Prop() private entity?: Entity
  @Prop() private blockSize!: GridPosition

  private spriteMeta: ISpriteMeta = {
    pos: { x: 0, y: 0 },
    gridSpan: { x: 1, y: 1 },
    sourceBlock: { x: 0, y: 0 },
    animations: {}
  }

  private created() {
    if (this.entity) {
      this.spriteMeta = spriteConfig.entities[this.entity.getSpriteName()]
    }
  }
  private get imageMeta(): any {
    if (this.entity && this.isObserved === true) {
      const width = this.spriteMeta.gridSpan.x * this.blockSize.x
      const height = this.spriteMeta.gridSpan.y * this.blockSize.y

      const ratioX = this.blockSize.x / spriteConfig.blockSize.x
      const ratioY = this.blockSize.y / spriteConfig.blockSize.y
      const spritePosX =
        this.spriteMeta.pos.x * (spriteConfig.blockSize.x * ratioX)
      const spritePosY =
        this.spriteMeta.pos.y * (spriteConfig.blockSize.y * ratioY)

      // NEED TO NEXT MOVE THE RATIO CODE INTO STAGE.VUE AS WELL AS
      // BACKGROUND SIZE CSS SO THAT IT"S NOT RECALCULATED EACH TIME;
      const spriteCss = {
        backgroundImage: `url(${require('../assets/spritesheet.png')})`,
        backgroundSize: `${spriteConfig.sheetSize.x * ratioX}px ${spriteConfig
          .sheetSize.y * ratioY}px`,
        backgroundPosition: `${spritePosX}px ${spritePosY}px`,
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
    } else {
      return {}
    }
  }

  @Watch('animating')
  private animateModel() {
    if (this.entity && this.animating === true) {
      if (
        this.entity.type() === EntityType.PLAYER ||
        this.entity.type() === EntityType.NPC
      ) {
        // TEMPORARY HEALTH / DAMAGE CODE
        if (this.entity.getFields().status.health.curr > 0) {
          if (this.terrain === 'mud') {
            this.entity.damage(2)
            this.entity.addItemToInventory('mud')
          }
          if (this.entity.getFields().status.health.curr <= 0) {
            this.entity.setMortalState(MortalState.DEAD)
          }
        } else if (this.entity.getFields().mortalState === 'a') {
          this.entity.setMortalState(MortalState.DEAD)
        }
        // END OF TEMPORAY HEALTH / DAMAGE CODE
      }
      // NEED TO ALSO CHECK WHICH ANIMATION SHOULD HAPPEN, NOW ONLY WORKS FOR WALK
      if (this.entity.type() === EntityType.PLAYER) {
        const el = this.$refs.entityModel
        const timeline = new TimelineMax()
        const animationName = this.entity.getAnimation()
        const animation = this.spriteMeta.animations[animationName]
        const blockSize = this.blockSize.x
        const frameNo = 0

        for (const frame of animation) {
          timeline.to(el, 0, {
            delay: 0.1,
            backgroundPosition: `-${frame.x * blockSize}px -${frame.y *
              blockSize}px`
          })
        }
      }
    }
  }

  private get hasEntity() {
    return this.entity ? true : false
  }

  private get entityStatus() {
    return this.entity ? this.entity.getFields().status : ''
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

  private inspect(e: Event) {
    this.$emit('inspected', this.entity)
  }
}
</script>

<style lang="scss">
.entity {
  position: absolute;
}

.entity:hover {
  cursor: pointer;
  filter: brightness(1.3);
}

.entity .entity-avatar {
  position: absolute;
  display: block;
}

.sprite-block {
  display: none;
}

.isDead {
  filter: grayscale(1);
  opacity: 0.6;
}
.sprite-block.observed {
  display: block;
}
</style>
