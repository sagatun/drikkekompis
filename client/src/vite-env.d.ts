/// <reference types="vite/client" />

interface ViteEnv {
  [key: string]: string;
}

interface ImportMeta {
  env: ViteEnv;
}
