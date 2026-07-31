interface StickyHeaderCheckout {
  checkoutUrl: string;
  eventValue?: number;
}

let currentCheckout: StickyHeaderCheckout | null = null;
const listeners = new Set<() => void>();

export function setStickyHeaderCheckout(checkout: StickyHeaderCheckout | null) {
  currentCheckout = checkout;
  listeners.forEach((listener) => listener());
}

export function subscribeStickyHeaderCheckout(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStickyHeaderCheckout() {
  return currentCheckout;
}

export function getStickyHeaderCheckoutServerSnapshot() {
  return null;
}
