import { Tokenizer } from '../../token'
import { Application } from '../decl'
import { parseIdentifier, parseIcon, parseProperties } from './libParser'

export function parseApp(t: Tokenizer, apps: Application[]): boolean {
  const start = t.locStart()
  if (!t.skip('application')) return false
  t.skipSpaces(false)
  const name = parseIdentifier(t)
  const props = parseProperties(
    t,
    {
      // description() {
      //   return parseI18N(t)
      // }
      icon() {
        return parseIcon(t)
      },
      uses(multline) {        
        return t.runIdented(parsePackageUses(t))
      },
      // packages: {
      //   [uri in PackageURI]: Package
      // },
      // langs: Lang[]
      // builders: {
      //   [builderName: string]: BuilderConfig
      // }      
    },
    ['package'],
    'PackageUses'
  )
  // parseProperies<Omit<Application,'name'>

  // mappings: AppMappings
  // const ret:Application={
  //   name: LiteralString
  //   description: I18N,
  //   icon: Icon,
  //   uses: PackageUses,
  //   packages: {
  //     [uri in PackageURI]: Package
  //   },
  //   langs: Lang[]
  //   builders: {
  //     [builderName: string]: BuilderConfig
  //   }
  //   mappings: AppMappings
  // }

  const app: Application = { name, props, start } as any
  apps.push(app)
  return true
}
