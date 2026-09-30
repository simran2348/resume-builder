"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { PAGE_HEIGHT } from "@/components/builder/paged-document";
import { paginate } from "@/lib/paginate";

// Splits a resume into pages (see paginate.js). Render the template inside an unscaled, 794px-wide
// element with `measureRef`; `pages` updates whenever `deps` change, the content resizes or fonts load.
export function usePagination(margin, deps) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState([{ start: 0, end: PAGE_HEIGHT, offset: 0 }]);

  useLayoutEffect(() => {
    const node = measureRef.current;
    const update = () => {
      const next = paginate(node, { pageHeight: PAGE_HEIGHT, margin });
      setPages((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    document.fonts?.ready.then(update);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers pass what the layout depends on
  }, [margin, ...deps]);

  return { measureRef, pages };
}
