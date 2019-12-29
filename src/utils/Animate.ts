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
    speed: number = 0.5,
    window?: HTMLElement
  ) {

    const options = {
      left: unitCoords.x,
      top: unitCoords.y,
      ease: Linear.easeNone,
      onComplete: callback,
      onStart: startCallBack
    }
    TweenLite.to(box, speed, options)
    const scrolloptions = {
      container: '#stage',
      easing: 'ease-in-out',
      offset: -367, // (-1 * (950 / 2)),
      force: true,
      cancelable: true,
      x: true,
      y: true
    }
    if (window) {
      // const cancelScroll = VueScrollTo.scrollTo(box, speed * 1000, scrolloptions)
    }
  }
}
