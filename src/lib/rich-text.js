// Minimal inline formatting for body text, stored as Markdown-style markers:
//   **bold**   *italic*   (***both***)
// Markers are written by the editor toolbar / shortcuts and rendered by <RichText> in the templates.

export const BOLD = "**";
export const ITALIC = "*";

// One inline token: ***bold italic*** | **bold** | *italic*. Markers must hug the text so "5 * 3" stays literal.
const TOKEN_RE =
  /\*\*\*(?=\S)(.+?)(?<=\S)\*\*\*|\*\*(?=\S)(.+?)(?<=\S)\*\*|\*(?=[^\s*])(.+?)(?<=[^\s*])\*/g;

// Splits text into [{ text, bold, italic }] segments.
export function parseRichText(text, inherited = {}) {
  const segments = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN_RE)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index), ...inherited });
    if (match[1] !== undefined) segments.push(...parseRichText(match[1], { ...inherited, bold: true, italic: true }));
    else if (match[2] !== undefined) segments.push(...parseRichText(match[2], { ...inherited, bold: true }));
    else segments.push(...parseRichText(match[3], { ...inherited, italic: true }));
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), ...inherited });
  return segments;
}

export function stripRichText(text) {
  return parseRichText(text)
    .map((segment) => segment.text)
    .join("");
}

// Wraps / unwraps the selection [start, end) in `marker`. Returns the new text and selection.
export function toggleMarker(text, start, end, marker) {
  const len = marker.length;

  // Don't wrap surrounding spaces ("**word **" wouldn't render).
  while (start < end && /\s/.test(text[start])) start++;
  while (end > start && /\s/.test(text[end - 1])) end--;

  const selected = text.slice(start, end);
  const isWrappedOutside = text.slice(start - len, start) === marker && text.slice(end, end + len) === marker;
  // For italic, "**x**" around the selection is bold, not italic.
  const isBoldAround = marker === ITALIC && text.slice(start - 2, start) === BOLD && text.slice(start - 3, start) !== "***";

  if (isWrappedOutside && !isBoldAround) {
    return {
      text: text.slice(0, start - len) + selected + text.slice(end + len),
      start: start - len,
      end: end - len,
    };
  }
  if (selected.length > len * 2 && selected.startsWith(marker) && selected.endsWith(marker)) {
    const inner = selected.slice(len, -len);
    return { text: text.slice(0, start) + inner + text.slice(end), start, end: start + inner.length };
  }
  return {
    text: text.slice(0, start) + marker + selected + marker + text.slice(end),
    start: start + len,
    end: end + len,
  };
}
