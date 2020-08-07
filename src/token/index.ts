import { SourceCode, Environment } from '../source'

export function createTokenizer(environment: Environment, src: SourceCode, spaces: string = ' \t\n\r') {
  let pos = 0
  const self = {
    environment,
    get pos() {
      return pos
    },
    isEof() {
      return pos >= src.code.length
    },
    skipSpaces() {
      while (pos < src.code.length) {
        const c = src.code[pos]
        if (spaces.indexOf(c) === -1) break
        pos++
      }
    },
    is(str: string) {
      const l = str.length
      const r = src.code.substr(pos, l) === str
      if (r) pos += l
      return r
    },
    check(str: string) {
      if (self.is(str))
        environment.addDiagnostic({
          msg: 'Esperadado ' + str,
          ref: {
            sourceCode: src,
            start: pos,
            length: str.length
          }
        })
    }
  }
  return self
}
