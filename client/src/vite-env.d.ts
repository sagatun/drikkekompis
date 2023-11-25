/// <reference types="vite/client" />

type ViteEnv = Record<string, string>

interface ImportMeta {
  env: ViteEnv
}
