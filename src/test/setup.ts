import '@testing-library/jest-dom';

// Polyfill global Iterator for WebContainer Node environment compatibility
if (typeof (globalThis as any).Iterator === 'undefined') {
  (globalThis as any).Iterator = class Iterator {
    static from(iterable: any) {
      const iterator = iterable[Symbol.iterator]();
      return {
        next: () => iterator.next(),
        [Symbol.iterator]() {
          return this;
        },
      };
    }
  };
}
