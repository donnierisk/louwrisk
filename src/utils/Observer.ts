import { GridBlockI } from '../models/GridBlockI'
import { MapSymbol } from '@/models/MapSymbol'
import DialogOption from '@/models/DialogOption'

export class Observer {
  private observedEntities: GridBlockI[] = []
  private text: string[] = []
  public addToObserver(grid: GridBlockI) {
    if (grid.symbol === MapSymbol.ROCK || grid.symbol === MapSymbol.WATER) {
      this.text.push(`There is rock ${grid.id}`)
      this.observedEntities.push(grid)
    }
  }

  public removeFromObserver(grid: GridBlockI) {
    this.observedEntities = this.observedEntities.filter((obj) => obj.id !== grid.id)
  }

  public getText() {
    return this.text
  }

  public getObservedEntities(): GridBlockI[] {
    return this.observedEntities;
  }

  public hasObservedEntities() {
    return this.observedEntities.length > 0 ? true : false
  }
}
