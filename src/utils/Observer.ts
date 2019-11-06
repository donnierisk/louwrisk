import { GridBlockI } from '../models/GridBlockI'
import { EntityType } from '@/models/EntityType'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import DialogOption from '@/models/DialogOption'
import { Entity } from '@/models/Entity'
const tempEnt: Entity = {
  type: EntityType.EMPTY,
  position: { x: 0, y: 0 }
}
export class Observer {
  private observedEntity: Entity = tempEnt
  private descriptions: string[] = []
  public addToObserver(entity: Entity) {
    if (entity) {
      this.observedEntity = entity
      this.descriptions.push(entity.description ? entity.description : 'Nothing here')
    } else {
      this.observedEntity = tempEnt
      this.descriptions.push('Nothing here')
    }
  }

  public getDescription(): string[] {
    return this.descriptions;
  }

  public getObservedEntity(): Entity {
    return this.observedEntity;
  }

  public hasObservedEntity(): boolean {
    return this.observedEntity.type !== EntityType.EMPTY ? true : false
  }
}
