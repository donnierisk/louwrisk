<template></template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LevelHandler } from '@/lib/LevelHandler';

@Component
export default class KeyboardEvents extends Vue {
  @Prop() private Level!: LevelHandler
  @Prop() private throttled = false

  private created() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // this.$emit('key-event', e.code)
      this.OnEvent(e.code)
    })
  }

  private OnEvent(key: string, amount: number = 1) {
    switch (key) {
      case 'KeyR':
        this.Level.ReloadSave()
        this.$emit('reload-event')
        break
      case 'KeyW':
      case 'KeyS':
      case 'KeyA':
      case 'KeyD':
        this.movePlayer(key, amount)
        this.$emit('move-event', key)
        break
      default:
        break
    }

    this.$emit('key-event')
  }

  private movePlayer(direction: string, amount: number = 1) {
    // Need to only do stuff if the key is a directional one
    if (this.throttled === false) {
      let playerX = this.Level.GetPlayer().position.x
      let playerY = this.Level.GetPlayer().position.y

      switch (direction) {
        case 'KeyW':
          playerY -= amount
          break
        case 'KeyS':
          playerY += amount
          break
        case 'KeyA':
          playerX -= amount
          break
        case 'KeyD':
          playerX += amount
          break
      }

      if (!this.Level.IsOutOfBounds(playerX, playerY) && !this.Level.IsBlocked(playerX, playerY)) {
        this.Level.UpdatePlayerPosition(playerX, playerY)
      }
    }
  }
}
</script>