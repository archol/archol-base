import { Identifier, DeclNode, Icon, NodeKind, LiteralProp, LiteralObject, LiteralString } from '../decl';
import { Tokenizer, TokenLoc } from '../../token';
import { SourceRef } from '../../source';

export function parseIdentifier(t: Tokenizer, requiredMsg?: string): Identifier {
  t.skipSpaces(false)
  const p = t.readWhile((c) =>
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9') ||
    (c === '_')
  )
  if (requiredMsg && p.loc.length < 1) t.environment.fatal(requiredMsg, p.loc)
  return {
    kind: 'Identifier',
    name: p.str,
    loc: p.loc
  }
}

export function parseIcon(t: Tokenizer): Icon {
  const p = parseIdentifier(t)
  return {
    kind: 'Icon',
    name: p,
    loc: p.loc
  }
}

// export function parsePackageUses(t: Tokenizer) {
//   const initialIdent = t.getIdent()
//   const p = parseProperties(
//     t,
//     {
//       '*'() {
//         const pkg = t.readString()
//         return pkg
//       },
//     },
//     [''],
//     ''
//   )
//   const ret: PackageUses = {
// kind: ,

//   }
//   return 
// }

// function parseI18N(t: Tokenizer, requiredMsg?: string): I18N {
//   const initialIdent=t.getIdent()
//   t.skipSpaces()
//   const p = t.readWhile((c) =>
//     (c >= 'a' && c <= 'z') ||
//     (c >= 'A' && c <= 'Z') ||
//     (c >= '0' && c <= '9') ||
//     (c === '_')
//   )
//   if (requiredMsg && p.loc.length < 1) t.environment.error('Identificador era esperado aqui', p.loc)
//   return {
//     name: p.str,
//     loc: p.loc
//   }
// }

export type ParsedProperties<
  PROPTYPE extends DeclNode<any>,
  PROPS extends { [prop: string]: (multline: boolean) => PROPTYPE }
  > = {
    [prop in keyof PROPS]: {
      name: LiteralString
      value: ReturnType<PROPS[prop]>
    }
  }

export type ParsedPropertiesRet<
  PROPTYPE extends DeclNode<any>,
  KIND extends NodeKind,
  PROPS extends { [prop: string]: (multline: boolean) => PROPTYPE }
  > = {
    start: TokenLoc
    propsObj: ParsedProperties<PROPTYPE, PROPS>
    propsArr: Array<LiteralProp<PROPTYPE>>
    obj: LiteralObject<PROPTYPE, KIND>
  }

export function parseProperties<
  PROPTYPE extends DeclNode<any>,
  KIND extends NodeKind,
  PROPS extends { [prop: string]: (multline: boolean) => PROPTYPE }
>(t: Tokenizer, parseProps: PROPS, stopWords: string[], kind: KIND): ParsedPropertiesRet<PROPTYPE, KIND, PROPS> {
  const start = t.locStart()
  const propsObj: ParsedProperties<PROPTYPE, PROPS> = {} as any
  const propsArr: Array<LiteralProp<PROPTYPE>> = []
  const obj: LiteralObject<PROPTYPE, KIND> = {
    GetAsAny() {
      return propsArr
    },
    kind,
    loc: null as any as SourceRef,
    props: propsArr,
    get(name: string): PROPTYPE | undefined {
      const r = propsArr.filter((i) => i.name.val === name)[0]
      return r && r.val
    }
  }
  const ret: ParsedPropertiesRet<PROPTYPE, KIND, PROPS> = {
    start,
    propsObj,
    propsArr,
    obj
  }
  t.skipSpaces(false)
  const wild = parseProps['*']
  while (t.isIdented(start.ident)) {
    if (stopWords.some((w) => t.skip(w))) break
    const propNameToken = t.readWhile((c) => {
      if (c === ':' || c === '=') return false
      if (c === '\r' || c === '\n') t.environment.fatal('nome de propriedade deve ser seguido de : ou =', t.loc())
      return true
    })
    const propName: keyof PROPS = propNameToken.str
    const parsePropValue = parseProps[propName] || wild
    t.skipSpaces(false)
    if (!(t.skip('=') || t.skip(':'))) t.environment.fatal('Esperado = ou : após nome da propriedade', t.loc())
    t.skipSpaces(false)
    const value = parsePropValue(t.skipLinefeed())
    if (value) {
      const propNameIdentifier: LiteralString = {
        kind: "LiteralString",
        loc: propNameToken.loc,
        val: propNameToken.str,
        GetAsAny() {
          return propName
        }
      }
      propsArr.push({
        name: propNameIdentifier,
        val: value
      })
      propsObj[propName] = {
        name: propNameIdentifier,
        value: value as any
      }
    }
  }
  return ret
  // t.skipSpaces()
  // const p = t.readWhile((c) =>
  //   (c >= 'a' && c <= 'z') ||
  //   (c >= 'A' && c <= 'Z') ||
  //   (c >= '0' && c <= '9') ||
  //   (c === '_')
  // )
  // if (requiredMsg && p.loc.length < 1) t.environment.error('Identificador era esperado aqui', p.loc)
  // return {
  //   name: p.str,
  //   loc: p.loc
  // }
}