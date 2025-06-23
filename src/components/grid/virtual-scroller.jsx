// src/components/grid/VirtualScroller.jsx
import React, { useState, useRef } from 'react';

function VirtualScroller({ rowCount, rowHeight, height, children }) {
  const ref = useRef();
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = () => setScrollTop(ref.current.scrollTop);

  const start = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(height / rowHeight) + 2;
  const end = Math.min(rowCount, start + visibleCount);
  const offsetY = start * rowHeight;

  const visibleChildren = React.Children.toArray(children).slice(start, end);

  return (
    <div ref={ref} onScroll={onScroll} style={{ overflowY: 'auto', height }}>
      <div style={{ transform: `translateY(${offsetY}px)` }}>
        {visibleChildren}
      </div>
    </div>
  );
}

export default VirtualScroller;
