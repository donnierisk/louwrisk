import { GridPosition } from '@/models/GridPosition'
import { TweenLite } from 'gsap'

export class Animate {
  public animaterUnit(
    unitCoords: GridPosition,
    box: HTMLElement,
    callback: () => void
  ) {
    TweenLite.to(box, 1, { left: unitCoords.x, top: unitCoords.y, onComplete: () => callback() })

  }
}
