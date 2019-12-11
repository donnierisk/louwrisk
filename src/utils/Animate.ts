import { GridPosition } from '@/models/GridPosition'
import { TweenLite, Linear } from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin';
export class Animate {
  public animaterUnit(
    unitCoords: GridPosition,
    box: HTMLElement,
    callback: () => void,
    startCallBack?: () => void,
    isInitial?: boolean,
    window?: HTMLElement
  ) {
    function findPos(obj: HTMLElement): number {
      let curtop: number = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
          obj = obj.offsetParent as HTMLElement
        } while (obj)
        return curtop
      }
      return 0
    }
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
