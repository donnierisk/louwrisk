export default abstract class AbstractLiving {
  private hp: number;
  private attack: number;
  private name: string;
  private description: string = "";
  private isHostile: boolean = false;
  constructor(hp: number, attack: number, name: string) {
    this.hp = hp;
    this.attack = attack;
    this.name = name
  }
}
