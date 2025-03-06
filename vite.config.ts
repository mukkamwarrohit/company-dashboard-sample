import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://app.beeceptor.com/mock-server/json-placeholder",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
