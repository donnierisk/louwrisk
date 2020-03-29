import { Patrol } from '../Patrol';
import { Entity } from '../Entity/Entity';
import { GridPosition } from '../GridPosition';

export class PatrolHandler {
  private entities: {
    [k: number]: {
      patrols: Patrol,
      entity: Entity
    }
  }

  constructor() {
    this.entities = {}
  }

  public addPatroller(id: number, ent: Entity, target: GridPosition) {
    this.entities[id] = {
      patrols: {
        route: [ent.getPosition(), target],
        index: 0
      },
      entity: ent
    }
  }

  public startNextRoute(id: number) {
    const patrols = this.entities[id].patrols

    const index = ++patrols.index
    if (patrols.route.length <= index) {
      patrols.index = 0
    }
  }

  public getNextPoint(id: number): GridPosition {
    const index = this.entities[id].patrols.index
    const route = this.entities[id].patrols.route
    return route[index]
  }
}
