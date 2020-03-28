import { Patrol } from '../Patrol';
import { Entity } from '../Entity/Entity';
import { GridPosition } from '../GridPosition';

export class PatrolHandler {
  private entities: {
    [k: number]: {
      patrols: Patrol,
      deviationPatrols: Patrol,
      entity: Entity,
      backtracking?: boolean
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
      deviationPatrols: {
        route: [],
        index: 0
      },
      entity: ent
    }
  }

  public startNextRoute(id: number) {
    const deviantRoute = this.entities[id].deviationPatrols.route
    const route = this.entities[id].patrols.route
    if (deviantRoute.length) {
      if (route.length > this.entities[id].deviationPatrols.index) {
        ++this.entities[id].deviationPatrols.index
      } else {
        this.entities[id].backtracking = true
      }

      if (this.entities[id].backtracking) {
        --this.entities[id].deviationPatrols.index
        deviantRoute.pop()
      }
    } else {
      const index = ++this.entities[id].patrols.index
      if (route.length <= index) {
        this.entities[id].patrols.index = 0
      }
    }
  }

  public getNextPoint(id: number): GridPosition {
    const deviationIndex = this.entities[id].deviationPatrols.index
    const deviantRoute = this.entities[id].deviationPatrols.route
    if (deviantRoute.length) {
      return deviantRoute[deviationIndex]
    }
    const index = this.entities[id].patrols.index
    const route = this.entities[id].patrols.route
    return route[index]
  }

  public deviate(id: number, target: GridPosition) {
    const route = this.entities[id].deviationPatrols.route
    if (route.length) {
      route.push(this.entities[id].entity.getPosition())
    }
    route.push(target)
  }
}
