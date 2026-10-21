import { isAbsolute, resolve } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { transformSync } from "@babel/core";

export interface RelayPluginOptions {
  /**
   * The directory the Relay compiler writes artifacts to (the
   * `artifactDirectory` option in your Relay config). Relative paths are
   * resolved against the Vite project root.
   */
  artifactDirectory?: string;
  /**
   * Emit `import` statements (ESM) instead of `require()` calls.
   *
   * Vite only understands ESM, so this needs to be `true` for the output of the
   * Relay compiler to work. `babel-plugin-relay` defaults it to `false` before
   * v21; pass `true` here if your Relay config sets it per project/workspace and
   * `babel-plugin-relay` cannot discover it.
   */
  eagerEsModules?: boolean;
  /** Forwarded to `babel-plugin-relay` unchanged. */
  [option: string]: unknown;
}

/**
 * Create the Relay plugin, forwarding `options` to `babel-plugin-relay`.
 *
 * Most projects can just use the default export (`plugins: [relay]`), because
 * `babel-plugin-relay` reads `relay.config.js`/`relay.config.json`/the `relay`
 * field of `package.json`. This factory is for the cases where it cannot: a
 * Vitest workspace or monorepo where the process cwd is not the package
 * directory, or a Relay config using the multi-project `projects` format.
 *
 * ```ts
 * // vite.config.ts
 * import { createRelayPlugin } from "vite-plugin-relay";
 *
 * export default defineConfig({
 *   plugins: [
 *     createRelayPlugin({
 *       artifactDirectory: "./src/__generated__",
 *       eagerEsModules: true,
 *     }),
 *   ],
 * });
 * ```
 */
export function createRelayPlugin(userOptions: RelayPluginOptions = {}): Plugin {
  let root = process.cwd();

  return {
    name: "vite:relay",
    configResolved(config: ResolvedConfig) {
      root = config.root;
    },
    transform(src, id) {
      if (/.(t|j)sx?/.test(id) && src.includes("graphql`")) {
        const options: RelayPluginOptions = { ...userOptions };
        if (options.artifactDirectory && !isAbsolute(options.artifactDirectory)) {
          // `babel-plugin-relay` resolves `artifactDirectory` against the
          // process cwd, which is wrong in workspaces/monorepos where Vite is
          // run from a parent directory. Resolve it against the Vite root and
          // hand over an absolute path instead.
          options.artifactDirectory = resolve(root, options.artifactDirectory);
        }

        const out = transformSync(src, {
          plugins: [["babel-plugin-relay", options]],
          code: true,
          filename: id,
          sourceMaps: true,
        });

        if (!out?.code) {
          throw new Error(`vite-plugin-relay: Failed to transform ${id}`);
        }

        const code = out.code;
        const map = out.map;

        return {
          code,
          map,
        };
      }
    },
  };
}

// The historical default export: a plugin that relies on `babel-plugin-relay`
// discovering the Relay config by itself. Kept as an object (rather than a
// callable factory) so existing `plugins: [relay]` configs keep working.
const relay: Plugin = createRelayPlugin();

export default relay;
