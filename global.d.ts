// Script-style (no top-level import) so the global augmentation applies to all files.
// Uses inline import() to reference R3F types without converting this file into a module.
declare global {
  namespace JSX {
    interface IntrinsicElements extends import('@react-three/fiber').ThreeElements {}
  }
}
