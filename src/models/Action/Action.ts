import { ActionTypes } from './ActionTypes';

export default interface Action {
  type: ActionTypes
  id: number
}

export interface Dialogue {
  text: string
  dialogueOptions: DialogueOption[]
}

export interface DialogueOption {
  text: string
  triggersActionId: number
}
