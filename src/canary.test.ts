import { describe, expect, it } from "@jest/globals";
import { hello } from "./canary";

describe("canary", () => {
  it("hello's as it should", () => {
    expect(hello("you")).toEqual("Hello you");
  });
});
