import 'react-native-gesture-handler';

globalThis._REANIMATED_IS_REDUCED_MOTION = false;

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const originalMatchMedia = window.matchMedia.bind(window);
  window.matchMedia = (query, ...rest) => {
    const result = originalMatchMedia(query, ...rest);
    if (query === '(prefers-reduced-motion: reduce)' && result && result.matches === true) {
      const overridden = Object.create(result);
      Object.defineProperty(overridden, 'matches', { value: false });
      return overridden;
    }
    return result;
  };
}

const makeLogFilter =
  (original, needles) =>
  (...args) => {
    try {
      const msg = args.map((a) => String(a)).join(' ');
      if (needles.some((needle) => msg.includes(needle))) {
        return;
      }
    } catch (_e) {}
    original(...args);
  };

console.warn = makeLogFilter(console.warn, ['props.pointerEvents is deprecated']);
console.info = makeLogFilter(console.info, [
  'Running application',
  'Development-level warnings',
  'Performance optimizations',
]);

const App = require('./App').default;
const { registerRootComponent } = require('expo');
registerRootComponent(App);
