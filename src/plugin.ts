import type { PluginOption } from "vite";
import { transformSync } from "@babel/core";

export default {
  name: "vite:relay",
  transform(src, id) {
    let code = src;

    if (/.(t|j)sx?/.test(id) && src.includes("graphql`")) {
      const out = transformSync(src, {
        plugins: [
          [
            "babel-plugin-relay",
            {
              eagerEsModules: true,
            },
          ],
        ],
        code: true,
        filename: id,
      });

      if (!out?.code) {
        throw new Error(`vite-plugin-relay: Failed to transform ${id}`);
      }

      code = out.code;
    }

    return {
      code,
      map: null,
    };
  },
} as PluginOption;
