import { RefObject, useEffect } from 'react';
type AnyEvent = MouseEvent | TouchEvent;

function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: AnyEvent) => void,
): void {
  useEffect(() => {
    // const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    // if (!ref.current || ref.current.contains(event.target as Node)) {
    //   return;
    // }

    // if (!ref || !ref.current || ref.current.contains(event.target as Node)) {
    //   return;
    // }
    const listener = (event: AnyEvent) => {
      const el = ref.current;

      // This logic correctly handles the null case at runtime.
      // If the ref isn't attached yet, or the click is inside the element, do nothing.
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };
    // };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;
