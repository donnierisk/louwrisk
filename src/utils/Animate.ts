import { GridPosition } from '@/models/GridPosition'
import VueScrollTo from 'vue-scrollto'
import { TweenLite, Linear } from 'gsap'

export class Animate {
  public animaterUnit(
    unitCoords: GridPosition,
    box: HTMLElement,
    callback: () => void,
    startCallBack?: () => void,
    isInitial?: boolean,
    window?: HTMLElement
  ) {

    const options = {
      left: unitCoords.x,
      top: unitCoords.y,
      ease: Linear.easeNone,
      onComplete: callback,
      onStart: startCallBack
    }
    TweenLite.to(box, isInitial === true ? 0 : 0.5, options)
    const scrolloptions = {
      container: '#stage',
      easing: 'ease-in-out',
      offset: (-1 * (950 / 2)),
      force: true,
      cancelable: true,
      x: true,
      y: true
    }
    if (window) {
      const cancelScroll = VueScrollTo.scrollTo(box, 500, scrolloptions)
    }
  }
}
