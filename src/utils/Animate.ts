import { GridPosition } from '@/models/GridPosition'
import { TweenLite, Linear } from 'gsap'

export class Animate {
  public animaterUnit(
    unitCoords: GridPosition,
    box: HTMLElement,
    callback: () => void
  ) {
    TweenLite.to(
      box, 0.5,
      { left: unitCoords.x, top: unitCoords.y, ease: Linear.easeNone, onComplete: () => callback() })

  }
}
