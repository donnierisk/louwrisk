import Buffs from './Buffs'
import Action from './Action/Action'

export default class Client {
  private action: Action[]
  private buffs: Buffs[] = []
  private includedDialog: string[] = []
  private excludedDialog: string[] = []
  constructor(action: Action[], buffs: Buffs[]) {
    this.action = action
    this.buffs = buffs
  }
}
