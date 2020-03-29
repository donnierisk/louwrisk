import { EntityInterface } from './EntityInterface';
import { GridPosition } from '@/models/GridPosition';
import { Direction } from '../Direction';
import { MortalState } from '../MortalState';

export class Entity {
  private entityFields: EntityInterface
  private id: number

  constructor(fields: EntityInterface, id: number) {
    this.entityFields = fields
    this.id = id
  }

  public setFields(fields: EntityInterface) {
    Object.assign(this.entityFields, fields);
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
    return JSON.parse(JSON.stringify(this.entityFields.position))
  }

  public getDirection(): Direction {
    return this.entityFields.direction;
  }

  public getAnimation(): string {
    return this.entityFields.animation
  }

  public setPosition(x: number, y: number) {
    this.entityFields.position.x = x
    this.entityFields.position.y = y
  }

  public setDirection(direction: Direction) {
    this.entityFields.direction = direction
  }

  public setAnimation(animation: string) {
    this.entityFields.animation = animation
  }

  public damage(damageBy: number) {
    this.entityFields.status.health.curr -= damageBy
  }

  public isBlocker(): boolean {
    return this.entityFields.blocks ? true : false
  }

  public getId(): number {
    return this.id
  }

  public getInventory(): string[] {
    return Array.from(this.entityFields.inventory.values());
  }

  public addItemToInventory(itemName: string): boolean {
    let objectAdded = false;
    let hasNext = true;
    const itemSlot: IterableIterator<string> = this.entityFields.inventory.keys();

    while (objectAdded === false && hasNext === true) {

      const slotNo = itemSlot.next().value;
      const itemInSlot = this.entityFields.inventory.get(slotNo);
      hasNext = !!slotNo;
      if (hasNext === false) {
        break;
      }
      if (itemInSlot === 'empty') {
        this.entityFields.inventory.set(slotNo, itemName);
        objectAdded = true;
      }
    }
    return objectAdded;
  }

  public setMortalState(state: MortalState) {
    this.entityFields.mortalState = state;
  }
}
