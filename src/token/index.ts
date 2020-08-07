import { SourceCode, Environment } from '../source'

export function createTokenizer(environment: Environment, src: SourceCode, spaces: string = ' \t\n\r') {
  let pos = 0
  return {
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
  }
}
