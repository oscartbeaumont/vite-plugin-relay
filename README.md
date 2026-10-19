<h1 align="center">Vite Plugin Relay</h1>

<div align="center">

[![NPM](https://img.shields.io/npm/v/vite-plugin-relay)](https://www.npmjs.com/package/vite-plugin-relay)
[![CI workflow](https://github.com/oscartbeaumont/vite-plugin-relay/actions/workflows/ci.yml/badge.svg)](https://github.com/oscartbeaumont/vite-plugin-relay/actions)

</div>

<div align="center">
    Add relay support to your <a href="https://vitejs.dev">Vite</a> projects.
</div>

<br />

❤️ Special thanks to:

- [@Brendonovich](https://github.com/Brendonovich) for general help
- [@kesne](https://github.com/kesne) for adding [pnpm](https://pnpm.io) support
- [@tobias-tengler](https://github.com/tobias-tengler) for adding Vite 3 support

I **do not** actively use this project anymore, however, it will still receive periodic updates.

## Usage

Follow Relay's guide on [how to add Relay to your project](https://relay.dev/docs/getting-started/installation-and-setup/).

> ⚠️ Note: Install `babel-plugin-relay` (>= 13.0.1) as devDependencies as instructed, but skip its configuration. `vite-plugin-relay` will invoke the babel plugin for you!

Add `vite-plugin-relay` to your `devDependencies`:

```bash
yarn add vite-plugin-relay -D
```

Add `vite-plugin-relay` to your Vite configuration (`vite.config.ts` or `vite.config.js`):

```typescript
import { defineConfig } from "vite";
import relay from "vite-plugin-relay";

export default defineConfig({
  plugins: [..., relay],
});
```

If `babel-plugin-relay` cannot discover your Relay config by itself (see [Monorepos, workspaces and multi-project configs](#monorepos-workspaces-and-multi-project-configs)), pass the options explicitly with `createRelayPlugin` instead:

```typescript
import { defineConfig } from "vite";
import { createRelayPlugin } from "vite-plugin-relay";

export default defineConfig({
  plugins: [
    ...,
    createRelayPlugin({
      artifactDirectory: "./src/__generated__",
      eagerEsModules: true,
    }),
  ],
});
```

Configure `relay-compiler` to output artifacts with `export default` syntax, by setting `eagerEsModules` to `true`:

```json
{
  "relay": {
    "src": "./src",
    "schema": "./src/schema.graphql",
    "language": "typescript",
    "eagerEsModules": true,
    "exclude": ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"]
  }
}
```

Now your project is setup to use Relay with Vite!

## How this plugin works

Under the hood we are invoking the official `babel-plugin-relay`. This ensures that our plugin and `babel-plugin-relay` do not get out of sync over time and also reduces the maintainance costs of this project.

Since v13 `babel-plugin-relay` automatically gets its configuration from either the `package.json`, `relay.config.js` or `relay.config.json`, so our plugin also doesn't have to expose a configuration API. It searches for that config starting from the **current working directory**, which works for most projects but not all (see below). When it guesses wrong, use `createRelayPlugin(options)` to pass the options explicitly.

## Monorepos, workspaces and multi-project configs

`babel-plugin-relay` reads its config from the process working directory and only understands the top-level `eagerEsModules`/`artifactDirectory` options. That breaks in a few setups:

- **Vitest workspaces / monorepos** where Vite is run from the repository root, so the working directory is not the package directory and the package's `relay.config.js` is never found.
- **Multi-project Relay configs** (the `projects`/`sources` format). `eagerEsModules` and the artifact directory are configured per project and are ignored, which shows up as `ReferenceError: require is not defined` in the browser when `babel-plugin-relay` emits a `require()` call.

For these, pass the options yourself with `createRelayPlugin`:

```typescript
import { createRelayPlugin } from "vite-plugin-relay";

export default defineConfig({
  plugins: [
    createRelayPlugin({
      // Relative to the Vite root.
      artifactDirectory: "./src/__generated__",
      // Required for Vite; defaults to false in babel-plugin-relay before v21.
      eagerEsModules: true,
    }),
  ],
});
```

Every other option is forwarded to `babel-plugin-relay` unchanged.

## Common Issues

### `Uncaught ReferenceError: global is not defined`

If you experience this error in your browser console when using the plugin add the following define to your `index.html` file before importing your Javascript:

```html
<script>
  let global = globalThis;
</script>
```

## Server Side Rendering

If you are planning to use this plugin with server side rendering you may need to define `window`. You could do this by putting the following snippet in your [`entry-server.js`](https://vitejs.dev/guide/ssr.html#source-structure) file.

```js
if (typeof (window as any).global === 'undefined') {
  (window as any).global = globalThis;
}
```

## Contributing

```
git clone ...
pnpm i
# If you have never run Playwright run `npx playwright install` to setup your system.
cd examples/vite-3
pnpm dev

pnpm format # Do this before doing a commit
```
