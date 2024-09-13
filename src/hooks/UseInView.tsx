import { useState, useEffect, useRef } from 'react';

// Custom hook to detect if an element is in view using IntersectionObserver
function useInView(options: IntersectionObserverInit) {
  // State to store whether the element is currently in view or not
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Ref to keep a reference to the IntersectionObserver instance
  const observerRef = useRef<IntersectionObserver | null>(null);

  // State to store the element that needs to be observed
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // If the element is available, set up the IntersectionObserver
    if (element) {
      // Disconnect any existing observer to avoid multiple observers
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create a new IntersectionObserver instance
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          // Update the state only if the intersection status has changed
          if (entry.isIntersecting !== isIntersecting) {
            setIsIntersecting(entry.isIntersecting);
          }
        },
        options // Pass the options to configure the observer
      );

      // Start observing the element
      observerRef.current.observe(element);
    }

    // Cleanup function to disconnect the observer when the component unmounts or dependencies change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [element, isIntersecting, options]);

  return [isIntersecting, setElement] as const;
}

export default useInView;
