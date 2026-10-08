import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/svg-preview-tool/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
