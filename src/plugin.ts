import type { Plugin } from "vite";
import { transformSync } from "@babel/core";

export default {
  name: "vite:relay",
  config: () => ({
    define: {
      global: "globalThis",
    },
  }),
  transform(src, id) {
    let code = src;
    if (/.(t|j)sx?/.test(id) && src.includes("graphql`")) {
      const out = transformSync(src, {
        plugins: [
          [
            require.resolve("babel-plugin-relay"),
            {
              eagerESModules: true,
            },
          ],
        ],
        code: true,
      });

      if (!out?.code) throw new Error("vite-plugin-react Failed to build");
      code = out.code;
    }

    return {
      code,
      map: null,
    };
  },
} as Plugin;
