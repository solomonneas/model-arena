import { useEffect, RefObject } from 'react'

/**
 * Observes an element's size via ResizeObserver and calls the callback
 * whenever the element's dimensions change. More accurate than
 * window.resize because it detects container-level changes.
 */
export function useResizeObserver(
  ref: RefObject<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void
): void {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      // ResizeObserver batches; we only care about our single element
      const entry = entries[0]
      if (entry) {
        callback(entry)
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, callback])
}
