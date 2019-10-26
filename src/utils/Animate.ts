import { GridPosition } from '@/models/GridPosition'
import TWEEN from '@tweenjs/tween.js'

function animate(time: number) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}
requestAnimationFrame(animate)

export class Animate {
  public animaterUnit(
    unitCoords: GridPosition,
    currentCoords: GridPosition,
    box: HTMLElement,
    callback: () => void
  ) {
    new TWEEN.Tween(currentCoords)
      .to({ x: unitCoords.x, y: unitCoords.y }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        box.style.setProperty('left', currentCoords.x + 'px')
        box.style.setProperty('top', currentCoords.y + 'px')
      })
      .start()
      .onComplete(
        () => { callback() }
      )
  }
}
