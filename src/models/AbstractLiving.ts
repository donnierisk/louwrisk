export default abstract class AbstractLiving {
  private hp: HitPoints
  private attack: number
  private name: string
  private description: string = ''
  private isHostile: boolean = false
  private movement: string[] = []

  constructor(hp: HitPoints, attack: number, name: string) {
    this.hp = hp
    this.attack = attack
    this.name = name
  }

  public Damage(points: number) {
    const tempHP = this.hp.current - points
    this.hp.current = tempHP < 0 ? 0 : tempHP
  }

  public Heal(points: number) {
    const tempHP = this.hp.current + points
    this.hp.current = tempHP > this.hp.max ? this.hp.max : tempHP
  }

  public Aggro() {
    this.isHostile = true
  }

  public MakeAmends() {
    this.isHostile = false
  }

  //#region Getters
  public getHp() {
    return this.hp
  }

  public getAttack() {
    return this.attack
  }

  public getName() {
    return this.name
  }

  public getDescription() {
    return this.description
  }

  public getIsHostile() {
    return this.isHostile
  }

  public getMovement() {
    return this.movement
  }
  //#endregion

  //#region Setters
  public setHp(hp: HitPoints) {
    this.hp = hp
  }

  public setAttack(attack: number) {
    this.attack = attack
  }

  public setName(name: string) {
    this.name = name
  }

  public setDescription(description: string) {
    this.description = description
  }

  public setIsHostile(isHostile: boolean) {
    this.isHostile = isHostile
  }

  public setMovement(movement: string[]) {
    this.movement = movement
  }
  //#endregion
}

interface HitPoints {
  max: number
  current: number
}
