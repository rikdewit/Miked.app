// Module augmentation for React Three Fiber JSX elements.
// With "jsx": "react-jsx" (TypeScript 5+) JSX intrinsic elements are resolved
// from React.JSX.IntrinsicElements, so we augment the 'react' module directly.
import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
