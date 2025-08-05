import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: "VITE_", // این خط برای تشخیص متغیرهای با پیشوند VITE_ هست

  resolve: {
    alias: {
      "date-fns": "date-fns",
      "date-fns-jalali": "date-fns-jalali",
    },
  },
  server: {
    port: 5173,
  },
});
