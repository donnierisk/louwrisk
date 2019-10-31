import { GridBlockI } from '../models/GridBlockI'
import { EntityType } from '@/models/EntityType'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import DialogOption from '@/models/DialogOption'

export class Observer {
  private observedEntities: GridBlockI = {
    symbol: TerrainSymbol.EMPTY,
    id: 0,
    containedEntity: {
      type: EntityType.EMPTY,
      position: { x: 1, y: 1, z: 1 },
      span: { x: 1, y: 1, z: 1 },
      name: '',
      description: 'Nothing',
      blocks: false
    }
  }

  private text: string[] = []
  public addToObserver(grid: GridBlockI) {
    if (grid.symbol === TerrainSymbol.WATER) {
      this.text.push(`There is water ${grid.id}`)
    } else {
      this.text.push(`There is nothing`)
    }
    this.observedEntities = grid
  }

  public getText() {
    return this.text
  }

  public getObservedEntities(): GridBlockI {
    return this.observedEntities;
  }

  public hasObservedEntities(): boolean {
    return this.observedEntities.symbol !== TerrainSymbol.EMPTY
  }
}
