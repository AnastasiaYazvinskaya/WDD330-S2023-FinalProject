import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        listing: resolve(__dirname, "src/order-listing/index.html"),
        order: resolve(__dirname, "src/order/index.html"),
        new: resolve(__dirname, "src/order-work/newOrder.html"),
        close: resolve(__dirname, "src/order-work/closeOrder.html"),
      },
    },
  },
});
