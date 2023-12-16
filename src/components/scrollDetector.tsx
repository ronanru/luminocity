import { useEffect, useRef } from "react";

export const ScrollDetector = ({ onInView }: { onInView: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onInView(),
    );
    ref.current && observer.observe(ref.current);
  }, [ref, onInView]);

  return <div ref={ref}></div>;
};
