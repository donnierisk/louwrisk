<template>
  <div class="stage" id="stage" ref="stage" :style="stageStyle">
    <vue-scroll ref="vs" @handle-scroll-complete="HandleScrollComplete">
      <slot></slot>
    </vue-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { GridPosition } from '@/models/GridPosition'
import vuescroll from 'vuescroll'

interface ScrollEventPar {
  barSize: number
  process: number
  scrollTop?: number
  scrollLeft?: number
  type: string
}

@Component
export default class Camera extends Vue {
  @Prop() private blockSize!: GridPosition
  @Prop() private playerPosition!: GridPosition
  @Prop() private cameraOffset!: GridPosition
  @Prop() private cameraWidth?: number
  @Prop() private cameraHeight?: number

  private cameraPanningToPlayer: boolean = false
  private storeActive: boolean = false

  public get stageDom() {
    return this.storeActive ? this.$refs.stage : {clientWidth: 0, clientHeight: 0}
  }

  public get playerCurrentCameraPosition(): GridPosition {
    return {
      x: (((this.playerPosition.x + 1) * this.blockSize.x) - (this.screenWidth / 2)) + this.cameraOffset.x,
      y: (((this.playerPosition.y + 1) * this.blockSize.y) - (this.screenHeight / 2)) + this.cameraOffset.y
    }
  }

  public PanCameraToPlayer(animate: boolean = false) {
    this.cameraPanningToPlayer = true
    const pos: GridPosition = this.playerCurrentCameraPosition
    this.PanCameraTo(pos.x, pos.y)
  }

  public PanCameraTo(panX: number = 0, panY: number = 0, animate: boolean = false) {
    this.camera.scrollTo({x: panX, y: panY}, 500 as any)
  }

  private mounted() {
    this.storeActive = true
  }

  private get stageStyle() {
    return `
      width: ${this.cameraWidth ? this.cameraWidth : '100%'};
      height: ${this.cameraHeight ? this.cameraHeight : '100vh'}
    `
  }

  private get screenWidth() {
    return ((this.stageDom as HTMLElement).clientWidth as number)
  }

  private get screenHeight() {
    return ((this.stageDom as HTMLElement).clientHeight as number)
  }

  private get camera() {
    return (this.$refs.vs as vuescroll)
  }

  private HandleScrollComplete(vertical: ScrollEventPar, horizontal: ScrollEventPar) {
    if (this.cameraPanningToPlayer) {
      this.cameraPanningToPlayer = false
    }
  }

  private CameraPosX(pos: number = 0) {
    return pos - (this.screenWidth / 2)
  }

  private CameraPosY(pos: number = 0) {
    return pos - (this.screenHeight / 2)
  }
}
</script>

<style scoped lang="scss">
.stage {
  background: black;
  overflow: hidden;
}
</style>
