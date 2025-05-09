import { describe, expect, it } from "@jest/globals";
import { Pencil } from "./pencil"; // Ensure the Pencil module is correctly imported or available

describe("Pencil", () => {
  describe("write", () => {
    it("should write text on paper", () => {
      const pencil = new Pencil();
      const paper = "";

      const result = pencil.write(paper, "Hello World");

      expect(result).toBe("Hello World");
    });

    it("should append to existing text on paper", () => {
      const pencil = new Pencil();
      const paper = "She sells sea shells";

      const result = pencil.write(paper, " down by the sea shore");

      expect(result).toBe("She sells sea shells down by the sea shore");
    });
  });

  describe("point degradation", () => {
    it("should degrade point durability when writing", () => {
      const pencil = new Pencil(5);
      expect(pencil.getDurability()).toBe(5);

      pencil.write("", "text");
      expect(pencil.getDurability()).toBe(1);
    });

    it("should write spaces when point durability is depleted", () => {
      const pencil = new Pencil(4);
      const result = pencil.write("", "text that is too long");

      expect(result).toBe("text                 ");
    });

    it("should degrade by 1 for lowercase letters", () => {
      const pencil = new Pencil(4);
      pencil.write("", "text");

      expect(pencil.getDurability()).toBe(0);
    });

    it("should degrade by 2 for uppercase letters", () => {
      const pencil = new Pencil(4);
      const result = pencil.write("", "Text");

      expect(result).toBe("Tex ");
      expect(pencil.getDurability()).toBe(0);
    });

    it("should not degrade for spaces and newlines", () => {
      const pencil = new Pencil(5);
      pencil.write("", "a b\nc");

      expect(pencil.getDurability()).toBe(2);
    });
  });

  describe("sharpen", () => {
    it("should restore the pencil's initial point durability", () => {
      const pencil = new Pencil(10, 2);
      pencil.write("", "text");
      expect(pencil.getDurability()).toBe(6);

      pencil.sharpen();
      expect(pencil.getDurability()).toBe(10);
    });

    it("should reduce the pencil's length by one", () => {
      const pencil = new Pencil(10, 2);
      expect(pencil.getLength()).toBe(2);

      pencil.sharpen();
      expect(pencil.getLength()).toBe(1);
    });

    it("should not restore point durability when length is zero", () => {
      const pencil = new Pencil(10, 1);
      pencil.write("", "text"); // Durability now 6
      expect(pencil.getDurability()).toBe(6);

      pencil.sharpen(); // Length becomes 0
      expect(pencil.getLength()).toBe(0);

      // Use more durability
      pencil.write("", "mor"); // 6 - 3 = 3 durability left

      // Check actual durability after writing "mor"
      const actualDurability = pencil.getDurability();

      pencil.sharpen(); // Should not restore durability
      expect(pencil.getDurability()).toBe(actualDurability);
    });
  });

  describe("erase", () => {
    it("should erase text from paper by replacing with spaces", () => {
      const pencil = new Pencil();
      const paper = "Hello World";

      const result = pencil.erase(paper, "World");

      expect(result).toBe("Hello      ");
    });

    it("should erase the last occurrence of the text", () => {
      const pencil = new Pencil();
      const paper =
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood?";

      let result = pencil.erase(paper, "chuck");
      expect(result).toBe(
        "How much wood would a woodchuck chuck if a woodchuck could       wood?"
      );

      result = pencil.erase(result, "chuck");
      expect(result).toBe(
        "How much wood would a woodchuck chuck if a wood      could       wood?"
      );
    });

    it("should do nothing if the text to erase is not found", () => {
      const pencil = new Pencil();
      const paper = "Hello World";

      const result = pencil.erase(paper, "Planet");

      expect(result).toBe("Hello World");
    });

    it("should handle case sensitivity correctly", () => {
      const pencil = new Pencil();
      const paper = "Hello World";

      const result = pencil.erase(paper, "world");

      expect(result).toBe("Hello World");
    });
  });

  describe("eraser degradation", () => {
    it("should degrade eraser durability when erasing", () => {
      const pencil = new Pencil(100, 10, 5);
      expect(pencil.getEraserDurability()).toBe(5);

      pencil.erase("Hello World", "World");
      expect(pencil.getEraserDurability()).toBe(0);
    });

    it("should degrade by 1 for each non-whitespace character", () => {
      const pencil = new Pencil(100, 10, 10);
      pencil.erase("Hello World", "World");
      expect(pencil.getEraserDurability()).toBe(5); // "World" has 5 non-whitespace chars
    });

    it("should not degrade for whitespace characters", () => {
      const pencil = new Pencil(100, 10, 5);
      pencil.erase("Hello World", "o W");
      expect(pencil.getEraserDurability()).toBe(3); // "o W" has 2 non-whitespace chars
    });

    it("should partially erase if durability runs out", () => {
      const pencil = new Pencil(100, 10, 3);
      const paper = "Buffalo Bill";

      const result = pencil.erase(paper, "Bill");
      expect(result).toBe("Buffalo B   ");
      expect(pencil.getEraserDurability()).toBe(0);
    });

    it("should not erase at all if durability is 0", () => {
      const pencil = new Pencil(100, 10, 0);
      const paper = "Hello World";

      const result = pencil.erase(paper, "World");
      expect(result).toBe("Hello World");
      expect(pencil.getEraserDurability()).toBe(0);
    });
  });

  describe("edit", () => {
    it("should write text over spaces", () => {
      const pencil = new Pencil();
      const paper = "An       a day keeps the doctor away";

      const result = pencil.edit(paper, 3, "onion");

      expect(result).toBe("An onion a day keeps the doctor away");
    });

    it("should handle collisions with @ symbol", () => {
      const pencil = new Pencil();
      const paper = "An       a day keeps the doctor away";

      const result = pencil.edit(paper, 3, "artichoke");

      expect(result).toBe("An artich@k@ay keeps the doctor away");
    });

    it("should handle writing past the end of the paper", () => {
      const pencil = new Pencil();
      const paper = "Hello     ";

      const result = pencil.edit(paper, 6, "World!!!");

      expect(result).toBe("Hello World!!!");
    });

    it("should respect point durability limitations", () => {
      const pencil = new Pencil(4);
      const paper = "An       a day keeps the doctor away";

      const result = pencil.edit(paper, 3, "onion");

      expect(result).toBe("An onio  a day keeps the doctor away");
    });

    it("should do nothing when position is out of bounds", () => {
      const pencil = new Pencil();
      const paper = "Hello World";

      const result = pencil.edit(paper, -1, "text");
      expect(result).toBe("Hello World");

      const result2 = pencil.edit(paper, 100, "text");
      expect(result2).toBe("Hello World");
    });
  });
});
