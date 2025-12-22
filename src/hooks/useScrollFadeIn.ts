import { useRef, useEffect, useCallback } from "react";

type FadeInResult = {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
};

const useScrollFadeIn = (
  direction: "up" | "left" | "right" = "up",
  duration = 0.5,
  delay = 0
): FadeInResult => {
  const dom = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const targetElement = entry.target as HTMLElement;

      if (entry.isIntersecting) {
        targetElement.style.opacity = "1";
        targetElement.style.transform = "translateY(0) translateX(0)";
        targetElement.style.transition = `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`;
      }
    },
    [duration, delay]
  );

  useEffect(() => {
    const current = dom.current;
    if (!current) return;

    const observer = new IntersectionObserver(handleScroll, { threshold: 0.1 });
    observer.observe(current);

    return () => observer.disconnect();
  }, [handleScroll]);

  const getInitialTransform = () => {
    if (direction === "up") return "translateY(20px)";
    if (direction === "left") return "translateX(-20px)";
    if (direction === "right") return "translateX(20px)";
    return "none";
  };

  return {
    ref: dom,
    style: {
      opacity: 0,
      transform: getInitialTransform(),
    },
  };
};

export default useScrollFadeIn;
