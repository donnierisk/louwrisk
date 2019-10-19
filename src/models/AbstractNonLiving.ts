import Action from './Action'

export default abstract class AbstractLiving {
  private name: string
  private description: string = ''
  private action: Action[]

  constructor(action: Action[], name: string) {
    this.name = name
    this.action = action
  }

  //#region Getters
  public getName() {
    return this.name
  }

  public getDescription() {
    return this.description
  }

  public getAction() {
    return this.action
  }
  //#endregion

  //#region Setters
  public setName(name: string) {
    this.name = name
  }

  public setDescription(description: string) {
    this.description = description
  }

  public setAction(action: Action[]) {
    this.action = action
  }
  //#endregion
}
