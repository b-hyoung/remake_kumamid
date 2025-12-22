import { useRef, useEffect, useCallback } from 'react';

type FadeInHookResult = {
  ref: React.RefObject<HTMLDivElement>;
  style: React.CSSProperties;
};

const useScrollFadeIn = (direction: 'up' | 'left' | 'right' = 'up', duration = 0.5, delay = 0) : FadeInHookResult => {
  const dom = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(([entry]: IntersectionObserverEntry[]) => {
    const targetElement = entry.target as HTMLElement; // Cast to HTMLElement for style access
    if (entry.isIntersecting) {
      targetElement.style.opacity = '1';
      targetElement.style.transform = 'translateY(0) translateX(0)'; // Reset transform for all directions
      targetElement.style.transition = `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`;
    } else {
        // Optional: Reset for re-animation if element scrolls out and then back in
        // targetElement.style.opacity = '0';
        // if (direction === 'up') targetElement.style.transform = 'translateY(20px)';
        // if (direction === 'left') targetElement.style.transform = 'translateX(-20px)';
        // if (direction === 'right') targetElement.style.transform = 'translateX(20px)';
        // targetElement.style.transition = 'none'; // Disable transition when out of view
    }
  }, [direction, duration, delay]);

  useEffect(() => {
    let observer: IntersectionObserver;
    const { current } = dom;

    if (current) {
      observer = new IntersectionObserver(handleScroll, { threshold: 0.1 });
      observer.observe(current);

      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [handleScroll]);

  const getInitialTransform = () => {
    if (direction === 'up') return 'translateY(20px)';
    if (direction === 'left') return 'translateX(-20px)';
    if (direction === 'right') return 'translateX(20px)';
    return 'none';
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
