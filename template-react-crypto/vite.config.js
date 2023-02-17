import { createRequire } from "module"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import inject from "@rollup/plugin-inject"
import stdLibBrowser from "node-stdlib-browser"

const injectGlobals = () => {
  const options = {
    global: [createRequire(import.meta.url).resolve("node-stdlib-browser/helpers/esbuild/shim"), "global"],
    process: [createRequire(import.meta.url).resolve("node-stdlib-browser/helpers/esbuild/shim"), "process"],
    Buffer: [createRequire(import.meta.url).resolve("node-stdlib-browser/helpers/esbuild/shim"), "Buffer"],
  }

  return { ...inject(options), enforce: "post" }
}

export default defineConfig({
  plugins: [react(), injectGlobals()],
  resolve: { alias: stdLibBrowser },
  optimizeDeps: { include: ["buffer", "process"] },
})
