<template>
  <div id="keyboard">
    <button @click="OnEvent('KeyW')">up</button>
    <button @click="OnEvent('KeyS')">down</button>
    <button @click="OnEvent('KeyA')">left</button>
    <button @click="OnEvent('KeyD')">right</button>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LevelHandler } from '@/lib/LevelHandler'
import { Entity } from '@/models/Entity/Entity'

@Component
export default class KeyboardEvents extends Vue {
  @Prop() private level!: LevelHandler
  @Prop() private throttled = false

  private created() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // this.$emit('key-event', e.code)
      if (!this.throttled) {
        this.OnEvent(e.code)
      }
    })
  }

  private OnEvent(key: string, amount: number = 1) {
    switch (key) {
      case 'KeyR':
        this.level.reloadSave()
        this.$emit('reload-event')
        break
      case 'KeyW':
      case 'KeyS':
      case 'KeyA':
      case 'KeyD':
        this.moveEntity(this.level.getPlayer(), key, amount)
        this.$emit('move-event', key)
        break
      default:
        break
    }

    this.$emit('key-event')
  }

  private moveEntity(entity: Entity, direction: string, amount: number = 1) {
    // Need to only do stuff if the key is a directional one
    if (this.throttled === false) {
      let entityX = entity.getPosition().x
      let entityY = entity.getPosition().y

      switch (direction) {
        case 'KeyW':
          entityY -= amount
          break
        case 'KeyS':
          entityY += amount
          break
        case 'KeyA':
          entityX -= amount
          break
        case 'KeyD':
          entityX += amount
          break
      }

      if (
        !this.level.isOutOfBounds(entityX, entityY) &&
        !this.level.isBlocked(entityX, entityY)
      ) {
        entity.setPosition(entityX, entityY)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#keyboard {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 100;
  button {
    width: 4rem;
    font-size: 1rem;
    height: 4rem;
    border: 1px solid black;
  }
}
</style>