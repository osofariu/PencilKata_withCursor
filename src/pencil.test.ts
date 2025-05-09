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

      expect(result).toBe("text         ");
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
});
