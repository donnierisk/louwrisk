<template></template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LevelHandler } from '@/lib/LevelHandler';

@Component
export default class KeyboardEvents extends Vue {
  @Prop() private level!: LevelHandler
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
          this.level.ReloadSave()
          this.$emit('reload-event')
          break
        case 'KeyW':
        case 'KeyS':
        case 'KeyA':
        case 'KeyD':
          if(!this.throttled) {
            this.movePlayer(key, amount)
            this.$emit('move-event', key)
          }
          break
        default:
          break
      }

      this.$emit('key-event')
  }

  private movePlayer(direction: string, amount: number = 1) {
    // Need to only do stuff if the key is a directional one
    if (this.throttled === false) {
      let playerX = this.level.GetPlayer().position.x
      let playerY = this.level.GetPlayer().position.y

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

      if (!this.level.IsOutOfBounds(playerX, playerY) && !this.level.IsBlocked(playerX, playerY)) {
        this.level.UpdatePlayerPosition(playerX, playerY)
      }
    }
  }
}
</script>