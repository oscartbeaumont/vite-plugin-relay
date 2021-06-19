import type { Plugin } from 'vite'
import crypto from 'crypto'
import { print, parse } from 'graphql'

type PluginConfig = {}

export default (config: PluginConfig = {}): Plugin => {
  return {
    name: 'vite:relay',
    transform(src: any, id: any) {
      if (/.tsx/.test(id) && src.includes('graphql`')) {
        let imports: any[] = []

        src = src.replaceAll(
          /graphql`([\s\S]*?)`/gm,
          (match: any, query: any) => {
            const formatted = print(parse(query))
            const name = /(fragment|mutation|query) (\w+)/.exec(formatted)![2]

            let id = `graphql__${crypto.randomBytes(10).toString('hex')}`
            imports.push(
              `import ${id} from "./__generated__/${name}.graphql.ts";`
            )
            return id
          }
        )

        src = imports.join('\n') + src
      }

      return {
        code: src,
        map: null,
      }
    },
  }
}
