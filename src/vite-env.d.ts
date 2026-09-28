/// <reference types="vite/client" />

interface Window {
  /** Gesetzt von scripts/prerender.mjs: im vorgerenderten HTML steht kein Sperrfenster. */
  __PRERENDER__?: boolean;
}
