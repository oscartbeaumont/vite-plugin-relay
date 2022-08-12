<h1 align="center">Vite Plugin Relay</h1>

[![NPM](https://img.shields.io/npm/v/vite-plugin-relay)](https://www.npmjs.com/package/vite-plugin-relay)
[![CI workflow](https://github.com/oscartbeaumont/vite-plugin-relay/actions/workflows/ci.yml/badge.svg)](https://github.com/oscartbeaumont/vite-plugin-relay/actions)

Add relay support to your [Vite](https://vitejs.dev) projects.

❤️ Special thanks to:

- [@Brendonovich](https://github.com/Brendonovich) for general help
- [@kesne](https://github.com/kesne) for adding [pnpm](https://pnpm.io) support
- [@tobias-tengler](https://github.com/tobias-tengler) for adding Vite 3 support

Created with the help of [@Brendonovich](https://github.com/Brendonovich) and thanks to [@kesne](https://github.com/kesne) for adding [pnpm](https://pnpm.io) support.

## Usage

Follow Relay's guide on [how to add Relay to your project](https://relay.dev/docs/getting-started/installation-and-setup/).

> ⚠️ Note: Install `babel-plugin-relay` (>= 13.0.0) and `graphql` as devDependencies as instructed, but skip the configuration of the babel plugin. `vite-plugin-relay` will invoke it for you!

Install `vite-plugin-relay`:

```bash
yarn add -D vite-plugin-relay
```

Add `vite-plugin-relay` to your Vite configuration (`vite.config.ts` or `vite.config.js`):

```typescript
import { defineConfig } from "vite";
import relay from "vite-plugin-relay";

export default defineConfig({
  plugins: [..., relay],
});
```

Now your project is setup to use Relay with Vite!

## How this plugin works

Under the hood we are inovking the official `babel-plugin-relay`. This ensures that our plugin and `babel-plugin-relay` do not get out of sync over time and also reduces the maintainance costs of this project.

Since v13 `babel-plugin-relay` automatically gets its configuration from either the `package.json`, `relay.config.js` or `relay.config.json`, so our plugin also doesn't have to expose a configuration API.

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
