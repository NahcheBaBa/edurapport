export function parseSpokenOption(transcript: string, options: string[]): number | null {
  const normalized = transcript.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  if (!normalized) return null;

  const letterMatch = normalized.match(/^(?:(?:option|answer|letter) )?([a-d])(?: (?:please|is correct))?$/);
  if (letterMatch?.[1]) {
    const index = letterMatch[1].charCodeAt(0) - "a".charCodeAt(0);
    return index < options.length ? index : null;
  }

  const matches = options.reduce<number[]>((found, option, index) => {
    const phrase = option.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    if (phrase && new RegExp(`(?:^| )${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$| )`).test(normalized)) {
      found.push(index);
    }
    return found;
  }, []);

  return matches.length === 1 ? matches[0] ?? null : null;
}