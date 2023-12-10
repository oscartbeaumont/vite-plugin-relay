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

## Contributing

```
git clone ...
pnpm i
# If you have never run Playwright run `npx playwright install` to setup your system.
cd examples/vite-3
pnpm dev

pnpm format # Do this before doing a commit
```
