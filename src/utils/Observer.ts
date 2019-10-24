import { GridBlockI } from '../models/GridBlockI'
import { MapSymbol } from '@/models/MapSymbol'

export class Observer {
  private observedEntitiesArray: GridBlockI[] = []
  public addToObserver(grid: GridBlockI) {
    this.observedEntitiesArray.push(grid)
  }

  public removeFromObserver(grid: GridBlockI) {
    this.observedEntitiesArray = this.observedEntitiesArray.filter((obj) => obj.id !== grid.id)
  }
}
