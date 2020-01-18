import { ActionHandler } from './ActionHandler';

export class Action {
  private actionHandler: ActionHandler
  constructor(handler: ActionHandler) {
    this.actionHandler = handler
  }
}