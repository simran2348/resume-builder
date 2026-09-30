// Splits a rendered resume into A4 pages without cutting through text.
//
// `root` is an unscaled, full-width render of the template. Every line-level element (paragraphs, list
// items, headings) is an unbreakable block, and entries marked `break-inside-avoid` (a job, a degree, ...)
// are kept whole when they fit on a page. Section headings are glued to the start of their content.
//
// Returns [{ start, end, offset }]: page N shows content from `start` to `end` (px from the top of the
// resume), drawn `offset` px below the top edge of the page. Page 1 has offset 0 because the template
// already has its own top padding; later pages get `margin`, and every page keeps `margin` free at the bottom.

const BLOCK_SELECTOR = "p, li, h1, h2, h3, img, [data-block], .break-inside-avoid";
const HEADING_GLUE = 48; // keep at least this much of a section's content with its heading
const MAX_PAGES = 30;

// Distance from the top of `root` using layout offsets, which (unlike getBoundingClientRect) ignore CSS
// transforms, so measuring inside a zooming dialog or a scaled container still gives real sizes.
// `root` must be positioned (position: relative) so it's in every block's offsetParent chain.
function offsetTopWithin(el, root) {
  let top = 0;
  let node = el;
  while (node && node !== root) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return node === root ? top : null;
}

function collectBlocks(root) {
  const blocks = [];
  for (const el of root.querySelectorAll(BLOCK_SELECTOR)) {
    const top = offsetTopWithin(el, root);
    if (top === null || el.offsetHeight < 1) continue;
    const block = {
      top,
      bottom: top + el.offsetHeight,
      // "Strong" blocks (whole entries) may be split as a last resort when taller than a page.
      strong: el.matches(".break-inside-avoid, [data-block]"),
    };
    // Glue a section heading to the start of the content below it.
    const next = el.tagName === "H2" ? el.nextElementSibling : null;
    const nextTop = next ? offsetTopWithin(next, root) : null;
    if (nextTop !== null) {
      block.bottom = Math.max(block.bottom, Math.min(nextTop + next.offsetHeight, block.bottom + HEADING_GLUE));
    }
    blocks.push(block);
  }
  return blocks;
}

// Highest cut ≤ limit that doesn't fall inside a block starting on this page.
function findCut(blocks, start, limit, respectStrong) {
  let cut = limit;
  let moved = true;
  while (moved) {
    moved = false;
    for (const b of blocks) {
      if (!respectStrong && b.strong) continue;
      if (b.top > start + 0.5 && b.top < cut - 0.5 && b.bottom > cut + 0.5) {
        cut = b.top;
        moved = true;
      }
    }
  }
  return cut;
}

export function paginate(root, { pageHeight, margin }) {
  const blocks = collectBlocks(root);
  // Ignore trailing empty space (e.g. a full-height sidebar background).
  const contentEnd = Math.max(0, ...blocks.map((b) => b.bottom));
  const pages = [];
  let start = 0;

  while (pages.length < MAX_PAGES) {
    const offset = pages.length === 0 ? 0 : margin;
    const limit = start + pageHeight - offset - margin;
    if (limit >= contentEnd) {
      pages.push({ start, end: Math.max(contentEnd, start), offset });
      break;
    }
    let cut = findCut(blocks, start, limit, true);
    if (cut <= start + 1) cut = findCut(blocks, start, limit, false); // entry taller than a page
    if (cut <= start + 1) cut = limit; // a single block taller than a page
    pages.push({ start, end: cut, offset });
    start = cut;
  }
  return pages;
}
