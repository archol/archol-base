import { SourceCode, Environment } from '../source'

export function createTokenizer(environment: Environment, src: SourceCode) {
  let offset = 0
  let ident = 0
  let row = 1
  let col = 1
  let rowIsEmpty = true
  const self = {
    environment,
    get pos() {
      return offset
    },
    get row() {
      return row
    },
    get col() {
      return col
    },
    isEof() {
      return offset >= src.code.length
    },
    skipSpaces() {
      while (offset < src.code.length) {
        const c = src.code[offset]
        const n = src.code[offset + 1]
        if (c === '\n' && n === '\r') {
          rowIsEmpty = true
          ident = 0
          offset++
          row++
          col = 0
        } else if (c === '\r' && n === '\n') {
          rowIsEmpty = true
          ident = 0
          offset++
          row++
          col = 0
        } else if (c === '\r' || c === '\n') {
          rowIsEmpty = true
          ident = 0
          row++
          col = 0
        } else if (c !== ' ' && c !== '\t') break
        offset++
        col++
      }
    },
    getIdent() {
      return ident
    },
    rowIsEmpty() {
      return rowIsEmpty
    },
    checkIdent(val: number) {
      if (val !== ident) environment.addDiagnostic({
        msg: 'Ident atual=' + ident + ' esperadado=' + val,
        ref: {
          sourceCode: src,
          start: offset,
          length: 0
        }
      })
    },
    is(str: string) {
      const l = str.length
      const r = src.code.substr(offset, l) === str
      if (r) {
        offset += l
        col += l
      }
      return r
    },
    check(str: string) {
      if (!self.is(str))
        environment.addDiagnostic({
          msg: 'Esperadado ' + str,
          ref: {
            sourceCode: src,
            start: offset,
            length: str.length
          }
        })
    },
    readString() {
      const start = offset
      const quote = src.code[offset++]
      const ret: string[] = []
      while (offset < src.code.length) {
        const c = src.code[offset]
        if (c === quote) break
        const n = src.code[offset + 1]
        if (c === '\n' && n === '\r') {
          rowIsEmpty = true
          ident = 0
          offset++
          row++
          col = 0
          ret.push('\n')
        } else if (c === '\r' && n === '\n') {
          rowIsEmpty = true
          ident = 0
          offset++
          row++
          col = 0
          ret.push('\n')
        } else if (c === '\r' || c === '\n') {
          rowIsEmpty = true
          ident = 0
          offset++
          row++
          col = 0
          ret.push('\n')
        } else ret.push(c)
        offset++
        col++
      }
      offset++
      col++
      return {
        kind: quote,
        str: ret.join(''),
        start,
        length: offset - start
      }
    }
  }
  return self
}
