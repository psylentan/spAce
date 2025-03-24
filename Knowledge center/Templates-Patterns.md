class Effect {
  constructor(
    public name: string,
    public stat: string,
    public modifier: number,
    public duration: number
  ) {}

  apply(target) { ... }
  remove(target) { ... }
}
