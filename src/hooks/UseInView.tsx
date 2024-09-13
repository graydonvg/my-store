import { useState, useEffect } from 'react';

// Custom hook to detect if an element is in view using IntersectionObserver
function useInView(options: IntersectionObserverInit) {
  // State to store whether the element is in view and the element itself
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Only proceed if the element exists
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect(); // Disconnect once it's in view to avoid multiple triggers
      }
    }, options);

    // Start observing the element
    observer.observe(element);

    // Cleanup: Disconnect observer when component unmounts or dependencies change
    return () => observer.disconnect();
  }, [element, options]);

  return [isIntersecting, setElement] as const;
}

export default useInView;
