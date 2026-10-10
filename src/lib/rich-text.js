// Minimal inline formatting for body text, stored as Markdown-style markers:
//   **bold**   *italic*   (***both***)
// Markers are written by the editor toolbar / shortcuts and rendered by <RichText> in the templates.
// Fields that allow lists also treat lines starting with "- " as bullet points (see parseBlocks).

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

// ---------- Bullet lists ----------

export const BULLET = "- ";
// A bullet line: "- text" (also "• text" or "* text", as pasted from other documents).
const BULLET_LINE_RE = /^\s*[-•*]\s+/;
const isBulletLine = (line) => BULLET_LINE_RE.test(line) || /^\s*[-•]$/.test(line);

// Splits text into blocks for rendering: consecutive bullet lines become one list, other lines stay
// together as a paragraph (blank lines start a new one).
//   [{ type: "paragraph", text }, { type: "list", items: [...] }]
export function parseBlocks(text) {
  const blocks = [];
  for (const line of text.split("\n")) {
    const last = blocks[blocks.length - 1];
    if (BULLET_LINE_RE.test(line)) {
      const item = line.replace(BULLET_LINE_RE, "").trim();
      if (!item) continue;
      if (last?.type === "list") last.items.push(item);
      else blocks.push({ type: "list", items: [item] });
    } else if (!line.trim()) {
      // A blank line ends the current paragraph / list.
      if (last && !last.closed) last.closed = true;
    } else if (last?.type === "paragraph" && !last.closed) {
      last.text += `\n${line}`;
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }
  return blocks.map(({ closed, ...block }) => block);
}

// Turns the lines touched by the selection [start, end) into bullets, or back into plain lines when they
// all are bullets already. Returns the new text and selection.
export function toggleBulletLines(text, start, end) {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = text.indexOf("\n", end);
  const lineEnd = nextBreak === -1 ? text.length : nextBreak;
  const lines = text.slice(lineStart, lineEnd).split("\n");
  const filled = lines.filter((line) => line.trim());
  const remove = filled.length > 0 && filled.every(isBulletLine);

  const nextLines = lines.map((line) => {
    if (remove) return line.replace(BULLET_LINE_RE, "").replace(/^\s*[-•]$/, "");
    // Leave blank lines alone, unless the selection is a single empty line (start a new list there).
    if (!line.trim()) return lines.length === 1 ? BULLET : line;
    return isBulletLine(line) ? line : BULLET + line.trimStart();
  });
  const replaced = nextLines.join("\n");
  const delta = replaced.length - (lineEnd - lineStart);
  const firstDelta = nextLines[0].length - lines[0].length;

  return {
    text: text.slice(0, lineStart) + replaced + text.slice(lineEnd),
    start: Math.max(lineStart, start + firstDelta),
    end: Math.max(lineStart, end + delta),
  };
}

// Enter inside a bullet line: continue the list on a new line, or end it when the bullet is empty.
// Returns the new text and caret position, or null when the caret isn't on a bullet line.
export function continueBulletList(text, caret) {
  const lineStart = text.lastIndexOf("\n", caret - 1) + 1;
  const nextBreak = text.indexOf("\n", caret);
  const line = text.slice(lineStart, nextBreak === -1 ? text.length : nextBreak);
  if (!isBulletLine(line)) return null;

  if (!line.replace(BULLET_LINE_RE, "").replace(/^\s*[-•]$/, "").trim()) {
    // Empty bullet: drop the marker so the next line is a normal paragraph.
    return { text: text.slice(0, lineStart) + text.slice(lineStart + line.length), caret: lineStart };
  }
  const insert = `\n${BULLET}`;
  return { text: text.slice(0, caret) + insert + text.slice(caret), caret: caret + insert.length };
}
