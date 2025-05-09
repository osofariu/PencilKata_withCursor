export class Pencil {
  private durability: number;
  private initialDurability: number;
  private length: number;

  constructor(durability: number = 100, length: number = 10) {
    this.durability = durability;
    this.initialDurability = durability;
    this.length = length;
  }

  write(paper: string, text: string): string {
    let result = paper;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === " " || char === "\n") {
        // Spaces and newlines don't degrade point durability
        result += char;
      } else if (this.durability <= 0) {
        // Pencil is dull, write a space instead
        result += " ";
      } else {
        // Degrade durability based on character type
        const degradation = this.getDegradationForChar(char);

        if (this.durability >= degradation) {
          result += char;
          this.durability -= degradation;
        } else {
          // Not enough durability left, write a space
          result += " ";
          this.durability = 0;
        }
      }
    }

    return result;
  }

  getDurability(): number {
    return this.durability;
  }

  getLength(): number {
    return this.length;
  }

  sharpen(): void {
    if (this.length > 0) {
      this.durability = this.initialDurability;
      this.length -= 1;
    }
  }

  private getDegradationForChar(char: string): number {
    // Uppercase letters degrade by 2, lowercase by 1
    return /[A-Z]/.test(char) ? 2 : 1;
  }
}
