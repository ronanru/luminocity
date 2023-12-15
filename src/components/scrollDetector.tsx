import { useEffect, useRef } from "react";

export const ScrollDetector = ({ onInScroll }: { onInScroll: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onInScroll(),
    );
    ref.current && observer.observe(ref.current);
  }, [ref, onInScroll]);

  return <div ref={ref}></div>;
};
