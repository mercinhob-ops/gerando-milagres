import "@testing-library/jest-dom";

// jsdom doesn't implement IntersectionObserver. Components that use it for
// scroll-reveal animations need this to exist to avoid crashing on mount.
// Firing synchronously (rather than via a real async callback) keeps the
// state update inside whatever act() scope called render()/observe(),
// so tests asserting on the post-reveal state don't need to await anything.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ],
      this
    );
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof window !== "undefined") {
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
if (typeof globalThis !== "undefined") {
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
