import { GridPosition } from '@/models/GridPosition'
import { TweenLite, Linear } from 'gsap'

export class Animate {
  public animaterUnit(
    unitCoords: GridPosition,
    box: HTMLElement,
    callback: () => void,
    startCallBack?: () => void,
    isInitial?: boolean,
  ) {
    const options = {
      left: unitCoords.x,
      top: unitCoords.y,
      ease: Linear.easeNone,
      onComplete: callback,
      onStart: startCallBack
    }

    TweenLite.to(box, isInitial === true ? 0 : 0.5, options)
  }
}
