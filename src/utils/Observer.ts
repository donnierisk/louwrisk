import { GridBlockI } from '../models/GridBlockI'
import { EntityType } from '@/models/EntityType'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import DialogOption from '@/models/DialogOption'
import { Entity } from '@/models/Entity'
import { MortalState } from '@/models/MortalState'
const tempEnt: Entity = new Entity({
  type: EntityType.EMPTY,
  health: 1,
  invincible: true,
  mortalState: MortalState.INANIMATE,
  position: { x: 0, y: 0 }
}, -1)
export class Observer {
  private observedEntity: Entity = tempEnt
  private descriptions: string[] = []
  public addToObserver(entity: Entity) {
    if (entity) {
      this.observedEntity = entity
      // this.descriptions.push(entity.description ? entity.description : 'Nothing here')
      this.descriptions.push('Something here')
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
    return this.observedEntity.type() !== EntityType.EMPTY ? true : false
  }
}
