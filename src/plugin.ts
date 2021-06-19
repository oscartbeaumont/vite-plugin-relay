import type { Plugin } from 'vite'
import { transformSync } from '@babel/core'

type PluginConfig = {}

export default (config: PluginConfig = {}): Plugin => {
  return {
    name: 'vite:relay',
    transform(src: any, id: any) {
      if (/.tsx/.test(id) && src.includes('graphql`')) {
        const out = transformSync(src, {
          plugins: [
            [
              'relay',
              {
                eagerESModules: true,
              },
            ],
          ],
          code: true,
        })

        if (out === null) throw new Error('vite-plugin-react Failed to build')
        src = out.code
      }

      return {
        code: src,
        map: null,
      }
    },
  }
}
