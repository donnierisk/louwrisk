<template>
  <div
    ref="block"
    class="gridItem"
    @click="inspect"
    :class="{observed: isObserved}"
    :style="terrainStyles"
  >
    <slot></slot>
  </div>
</template> 

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { GridBlockI } from '../models/GridBlockI'
import { GridPosition } from '../models/GridPosition'
import { EntityType } from '@/models/Entity/EntityType'
import { Entity } from '@/models/Entity/Entity'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import {
  spriteConfig,
  ISpriteTerrainConfig,
  ISpriteTerrainMeta
} from '@/lib/SpriteConfigTerrain'

@Component
export default class GridBlock extends Vue {
  @Prop() private gridMeta!: GridBlockI
  @Prop() private terrain!: TerrainSymbol
  @Prop() private isObserved?: boolean
  @Prop() private blockSize!: GridPosition

  private terrainStyles = {}
  private position: GridPosition = {
    x: 0,
    y: 0,
    z: this.gridMeta.zIndex
  }

  private created() {
    const terrainSprite = spriteConfig.terrains[this.terrain]
    const ratioX = this.blockSize.x / spriteConfig.blockSize.x
    const ratioY = this.blockSize.y / spriteConfig.blockSize.y
    const posX = terrainSprite.x * (spriteConfig.blockSize.x * ratioX)
    const posY = terrainSprite.y * (spriteConfig.blockSize.y * ratioY)
    this.terrainStyles = {
      backgroundImage: `url(${require('../assets/terrainsheet.png')}`,
      backgroundSize: `${spriteConfig.sheetSize.x * ratioX}px ${spriteConfig
        .sheetSize.y * ratioY}px`,
      backgroundPosition: `${posX}px ${posY}px`,
      zIndex: this.gridMeta.zIndex
    }
  }
  private mounted() {
    if (this.gridMeta.containedEntity) {
      this.emitPosition(this.gridMeta.containedEntity, true)
    }
  }

  @Watch('gridMeta.containedEntity')
  private onPositionChange(newVal: any) {
    if (newVal) {
      this.emitPosition(newVal, false)
    }
  }

  private emitPosition(entity: Entity, isInitial?: boolean) {
    const elem = this.$refs.block as HTMLElement
    this.position.x = elem.offsetLeft + elem.offsetWidth / 2
    this.position.y = elem.offsetTop + elem.offsetHeight / 2
    this.position.z = this.gridMeta.zIndex
    this.$emit(
      'entity-pos',
      this.position,
      entity.type(),
      isInitial,
      entity.getId()
    )
  }

  private inspect(e: Event) {
    if (this.gridMeta.inObserveRange) {
      this.$emit('inspected', this.gridMeta)
    }
  }
}
</script>

<style scoped lang="scss">
// .gridItem {
//   background-size: 640px 384px;
// }
.gridItem {
  filter: brightness(50%);
}

.gridItem.observed {
  filter: none;
}

.gridItem.observed:hover {
  box-shadow: 0 0 5px 1px purple inset;
}
</style>
