<template>
  <div ref="block" class="gridItem" @click="observe" :class="gridClass()" :style="terrainStyles">
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

  private terrainStyles = {}
  private position: GridPosition = {
    x: 0,
    y: 0,
    z: this.gridMeta.zIndex
  }

  private created() {
    const terrainSprite = spriteConfig[this.terrain]
    this.terrainStyles = {
      backgroundImage: `url(${require('../assets/terrainsheet.png')}`,
      backgroundPosition: `${terrainSprite.x} ${terrainSprite.y}`,
      zIndex: this.gridMeta.zIndex
    }
  }
  private mounted() {
    if (this.gridMeta.containedEntity) {
      this.emitPosition(this.gridMeta.containedEntity, true)
    }
  }

  private gridClass() {
    let classList = ''
    if (this.gridMeta.inObserveRange === true) {
      classList += 'observed '
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

  private observe(e: Event) {
    if (this.gridMeta.inObserveRange) {
      this.$emit('observed', this.gridMeta.containedEntity)
    }
  }
}
</script>

<style scoped lang="scss">
.gridItem {
  background-size: 640px 384px;
}
#gridItem {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

#gridItem.observed:hover {
  box-shadow: 0 0 5px 1px purple inset;
}
</style>
