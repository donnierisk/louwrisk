import Buffs from './Buffs'
import Dialog from './Dialog'

export default class Client {
  private dialogOptions: Dialog[]
  private buffs: Buffs[] = []
  private includedDialog: string[] = []
  private excludedDialog: string[] = []
  constructor(dialog: Dialog[], buffs: Buffs[]) {
    this.dialogOptions = dialog
    this.buffs = buffs
  }
}
