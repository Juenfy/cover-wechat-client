import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";
// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue(), basicSsl()],
  plugins: [vue()],
  // 防止 Vite 清除 Rust 显示的错误
  clearScreen: false,
  // 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  optimizeDeps: {
    include: ["mitt"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      "/api/": {
        target: "http://localhost:8000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, ""),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'dist',
    // Tauri 在 Windows 上使用 Chromium，在 macOS 和 Linux 上使用 WebKit
    target:
        process.env.TAURI_ENV_PLATFORM === 'windows'
            ? 'chrome105'
            : 'safari13',
    // 在 debug 构建中不使用 minify
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    // 在 debug 构建中生成 sourcemap
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
