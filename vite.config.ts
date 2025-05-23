import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "https://sunmoonebe-production.up.railway.app",
        // target: "http://localhost:8080",
        changeOrigin: true,
      },
      // "/api/v1/auth/register": {
      //   target: "http://103.179.191.149:8080/api/v1/auth/register",
      //   // target: "http://localhost:8080",
      //   changeOrigin: false,
      // },
      "/kiot": {
        target: "https://public.kiotapi.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kiot/, ""),
      },
      "/token": {
        target: "https://id.kiotviet.vn/connect/token",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/token/, ""),
      },
    },
  },
  plugins: [react()],
});
