import { GridPosition } from '@/models/GridPosition'
import { TweenLite, Linear } from 'gsap'

export class Animate {
  private segmentWidth: number
  private segmentHeight: number

  constructor(segmentWidth: number, segmentHeight: number) {
    this.segmentWidth = segmentWidth
    this.segmentHeight = segmentHeight
  }

  public animaterUnit(
    unitCoords: GridPosition,
    box: HTMLElement,
    callback: () => void,
    startCallBack?: () => void,
    speed: number = 0.5
  ) {
    const options = {
      left: unitCoords.x,
      top: unitCoords.y,
      ease: Linear.easeNone,
      onComplete: callback,
      onStart: startCallBack
    }
    TweenLite.to(box, speed, options)
  }
}
