import { useState, useEffect, useRef } from 'react';

export const useVideoVisibility = () => {
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisiblePostId(entry.target.id);
          }
        });
      },
      {
        threshold: 0.7,
      }
    );

    const postContainers = document.querySelectorAll('.post-container');
    postContainers.forEach((container) => {
      observerRef.current?.observe(container);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return visiblePostId;
}; 