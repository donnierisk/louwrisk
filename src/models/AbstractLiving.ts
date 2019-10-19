export default abstract class AbstractLiving {
  private hp: Hitpoints
  private attack: number
  private name: string
  private description: string = ""
  private isHostile: boolean = false
  private movement: string[] = []
  constructor(hp: Hitpoints, attack: number, name: string) {
    this.hp = hp
    this.attack = attack
    this.name = name
  }

  public Damage(points: number) {
    this.hp.current -= points
    this.hp.current = this.hp.current < 0 ? 0 : this.hp.current
  }

  public Heal(points: number) {
    this.hp.current += points
    this.hp.current = this.hp.current > this.hp.max ? this.hp.max : this.hp.current
  }

}

interface Hitpoints {
  max: number
  current: number
}
