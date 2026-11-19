import { describe, expect, it } from "vitest";
import { parseSpokenOption } from "@/lib/voice-answer";

const options = ["Quickly", "Knowledge", "Hopeful", "Teacher"];

describe("spoken quiz answers", () => {
  it("recognizes a spoken option letter", () => {
    expect(parseSpokenOption("Option C", options)).toBe(2);
  });

  it("recognizes an option phrase inside a sentence", () => {
    expect(parseSpokenOption("I think the answer is Quickly", options)).toBe(0);
  });

  it("recognizes an exact option without matching it inside another word", () => {
    expect(parseSpokenOption("verb", ["Verb", "Adverb"])).toBe(0);
  });

  it("does not guess when speech is unclear, ambiguous, or outside the available options", () => {
    expect(parseSpokenOption("maybe", options)).toBeNull();
    expect(parseSpokenOption("verb and adverb", ["Verb", "Adverb"])).toBeNull();
    expect(parseSpokenOption("Option D", ["Yes", "No"])).toBeNull();
  });
});