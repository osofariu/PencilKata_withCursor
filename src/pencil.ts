export class Pencil {
  private durability: number;
  private initialDurability: number;
  private length: number;
  private eraserDurability: number;

  constructor(
    durability: number = 100,
    length: number = 10,
    eraserDurability: number = 20
  ) {
    this.durability = durability;
    this.initialDurability = durability;
    this.length = length;
    this.eraserDurability = eraserDurability;
  }

  write(paper: string, text: string): string {
    let result = paper;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (this.isWhitespace(char)) {
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

  getEraserDurability(): number {
    return this.eraserDurability;
  }

  sharpen(): void {
    if (this.length > 0) {
      this.durability = this.initialDurability;
      this.length -= 1;
    }
  }

  erase(paper: string, textToErase: string): string {
    // If text is not found or eraser is worn out, return paper unchanged
    if (!paper.includes(textToErase) || this.eraserDurability <= 0) {
      return paper;
    }

    // Find the last occurrence of the text to erase
    const lastIndex = paper.lastIndexOf(textToErase);
    if (lastIndex === -1) {
      return paper;
    }

    let erasedText = "";
    let remainingDurability = this.eraserDurability;

    // Process characters from right to left
    for (let i = textToErase.length - 1; i >= 0; i--) {
      const char = textToErase[i];

      // Whitespace is free to erase
      if (this.isWhitespace(char)) {
        erasedText = " " + erasedText;
        continue;
      }

      // Non-whitespace characters reduce durability
      if (remainingDurability > 0) {
        erasedText = " " + erasedText;
        remainingDurability--;
      } else {
        // No more durability, keep the original character
        erasedText = char + erasedText;
      }
    }

    // Update eraser durability
    this.eraserDurability = remainingDurability;

    // Replace the text with our erased version
    return (
      paper.substring(0, lastIndex) +
      erasedText +
      paper.substring(lastIndex + textToErase.length)
    );
  }

  edit(paper: string, position: number, textToAdd: string): string {
    // Validate position is within bounds
    if (position < 0 || position >= paper.length) {
      return paper;
    }

    const beforeEdit = paper.substring(0, position);
    const editArea = paper.substring(position);
    const editedText = this.processEdit(editArea, textToAdd);

    return beforeEdit + editedText;
  }

  private processEdit(editArea: string, textToAdd: string): string {
    let editedText = "";
    let i = 0;

    // Process each character of the text to add
    while (i < textToAdd.length) {
      const charToAdd = textToAdd[i];
      const pastEndOfPaper = i >= editArea.length;
      const currentPaperChar = pastEndOfPaper ? " " : editArea[i];

      // Add the appropriate character based on the scenario
      editedText += this.processCharacterEdit(currentPaperChar, charToAdd);
      i++;
    }

    // Add any remaining characters from the original paper
    if (i < editArea.length) {
      editedText += editArea.substring(i);
    }

    return editedText;
  }

  private processCharacterEdit(
    currentPaperChar: string,
    charToAdd: string
  ): string {
    // If we don't have durability for non-whitespace, return a space
    if (this.durability <= 0 && !this.isWhitespace(charToAdd)) {
      return " ";
    }

    // If both characters are spaces, just return a space
    if (currentPaperChar === " " && charToAdd === " ") {
      return " ";
    }

    // If existing character is a space, add the new character (respecting durability)
    if (currentPaperChar === " ") {
      return this.writeCharacterWithDurability(charToAdd);
    }

    // If there's a collision (both chars are non-space), add @ symbol
    return this.handleCollision();
  }

  private writeCharacterWithDurability(char: string): string {
    // Spaces and newlines don't degrade durability
    if (this.isWhitespace(char)) {
      return char;
    }

    // Check if we have enough durability
    const degradation = this.getDegradationForChar(char);
    if (this.durability >= degradation) {
      this.durability -= degradation;
      return char;
    }

    // Not enough durability, write a space
    this.durability = 0;
    return " ";
  }

  private handleCollision(): string {
    // Collisions are represented by @, which still costs durability
    if (this.durability >= 1) {
      this.durability -= 1;
      return "@";
    }

    // No durability left, write a space
    return " ";
  }

  private getDegradationForChar(char: string): number {
    // Uppercase letters degrade by 2, lowercase by 1
    return /[A-Z]/.test(char) ? 2 : 1;
  }

  private isWhitespace(char: string): boolean {
    return char === " " || char === "\n";
  }
}
