export class Pencil {
  private durability: number;
  private initialDurability: number;

  constructor(durability: number = 100) {
    this.durability = durability;
    this.initialDurability = durability;
  }

  write(paper: string, text: string): string {
    return paper + text;
  }

  getDurability(): number {
    return this.durability;
  }
}
