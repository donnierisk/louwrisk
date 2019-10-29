import { GridBlockI } from '../models/GridBlockI'
import { MapSymbol } from '@/models/MapSymbol'
import DialogOption from '@/models/DialogOption'

export class Observer {
  private observedEntities: GridBlockI = { symbol: MapSymbol.EMPTY, id: 0 }
  private text: string[] = []
  public addToObserver(grid: GridBlockI) {
    if (grid.symbol === MapSymbol.ROCK) {
      this.text.push(`There is rock ${grid.id}`)
    } else
      if (grid.symbol === MapSymbol.WATER) {
        this.text.push(`There is water ${grid.id}`)
      } else {
        this.text.push(`There is nothing`)
      }
    this.observedEntities = grid
  }

  // public removeFromObserver(grid: GridBlockI) {
  //   this.observedEntities = this.observedEntities.filter((obj) => obj.id !== grid.id)
  // }

  public getText() {
    return this.text
  }

  public getObservedEntities(): GridBlockI {
    return this.observedEntities;
  }

  public hasObservedEntities() {
    return this.observedEntities.symbol !== MapSymbol.EMPTY
  }
}
