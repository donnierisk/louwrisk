import Dialog from './Dialog'

export default abstract class AbstractLiving {
  private name: string
  private description: string = ''
  private dialogOptions: Dialog[]

  constructor(dialog: Dialog[], name: string) {
    this.name = name
    this.dialogOptions = dialog
  }

  //#region Getters
  public getName() {
    return this.name
  }

  public getDescription() {
    return this.description
  }

  public getDialogOptions() {
    return this.dialogOptions
  }
  //#endregion

  //#region Setters
  public setName(name: string) {
    this.name = name
  }

  public setDescription(description: string) {
    this.description = description
  }

  public setDialogOptions(dialogOptions: Dialog[]) {
    this.dialogOptions = dialogOptions
  }
  //#endregion
}
