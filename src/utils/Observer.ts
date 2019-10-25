import { GridBlockI } from '../models/GridBlockI'
import { MapSymbol } from '@/models/MapSymbol'

export class Observer {
  private observedEntitiesArray: GridBlockI[] = []
  private text: string[] = []
  public addToObserver(grid: GridBlockI) {
    if (grid.symbol === MapSymbol.ROCK) {
      this.text.push('Theres a rock')
    }
    this.observedEntitiesArray.push(grid)
  }

  public removeFromObserver(grid: GridBlockI) {
    this.observedEntitiesArray = this.observedEntitiesArray.filter((obj) => obj.id !== grid.id)
  }

  public getText() {
    return this.text
  }
}
