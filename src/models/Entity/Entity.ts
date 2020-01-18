import { EntityInterface } from './EntityInterface';
import { GridPosition } from '@/models/GridPosition';

export class Entity {
  private entityFields: EntityInterface
  private id: number
  constructor(fields: EntityInterface, id: number) {
    this.entityFields = fields
    this.id = id
  }

  public setFields(fields: EntityInterface) {
    this.entityFields = fields
  }

  public getFields(): EntityInterface {
    return this.entityFields
  }

  public getSpriteName() {
    return this.entityFields.spriteName
  }

  public type() {
    return this.entityFields.type
  }

  public getPosition(): GridPosition {
    return this.entityFields.position
  }

  public setPosition(x: number, y: number) {
    this.entityFields.position.x = x
    this.entityFields.position.y = y
  }

  public damage(damageBy: number) {
    this.entityFields.health -= damageBy
  }

  public isBlocker(): boolean {
    return this.entityFields.blocks ? true : false
  }

  public getId(): number {
    return this.id
  }
}
