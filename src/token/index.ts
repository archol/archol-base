import { SourceCode, Environment, SourceRef } from '../source'

export interface Tokenizer {
  environment: Environment,
  offset: number
  row: number
  col: number
  locStart(): TokenLoc
  locSet(loc: TokenLoc): void
  loc(start?: TokenLoc): SourceRef
  isEof(): boolean
  skipSpaces(includeLineBreaks: boolean): void
  skipLinefeed(): boolean
  getIdent(): number
  isIdented(parentIdent: number): boolean
  rowIsEmpty(): boolean
  checkIdent(val: number): void
  is(str: string): boolean
  skip(str: string): boolean
  check(str: string): void
  isString(): boolean
  checkString(): void
  readString(): TokenString
  nextWord(): Token
  readWhile(fn: (c: string, n: string) => boolean): Token
  toString(): string
}

export interface TokenLoc {
  offset: number
  row: number
  col: number
  ident: number
  rowIsEmpty: boolean
}

export interface Token {
  str: string,
  loc: SourceRef
}

export interface TokenString extends Token {
  kind: string,
}

export function createTokenizer(environment: Environment, src: SourceCode): Tokenizer {
  let offset = 0
  let ident = 0
  let row = 1
  let col = 1
  let rowIsEmpty = true
  const self: Tokenizer = {
    environment,
    get offset() {
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
    locStart(): TokenLoc {
      return {
        offset, row, col, ident, rowIsEmpty
      }
    },
    locSet(loc: TokenLoc) {
      offset = loc.offset
      row = loc.row
      col = loc.col
      ident = loc.ident
      rowIsEmpty = loc.rowIsEmpty
    },
    loc(start?: TokenLoc): SourceRef {
      if (!start) start = self.locStart()
      return {
        sourceCode: src,
        start: start.offset,
        length: offset - start.offset,
        pos: {
          start: {
            line: start.row,
            column: start.col
          },
          end: {
            line: row,
            column: col
          }
        }
      }
    },
    skipSpaces(includeLineBreaks: boolean) {
      while (offset < src.code.length) {
        const c = src.code[offset]
        if (c === ' ' || c === '\t') {
          offset++
          col++
        }
        else if (includeLineBreaks) self.skipLinefeed()
        else break
      }
    },
    skipLinefeed(): boolean {
      const c = src.code[offset]
      const n = src.code[offset + 1]
      if (c === '\n' && n === '\r') {
        rowIsEmpty = true
        ident = 0
        offset+=2
        row+=2
        col = 0
        return true
      } else if (c === '\r' && n === '\n') {
        rowIsEmpty = true
        ident = 0
        offset+=2
        row+=2
        col = 0
        return true
      } else if (c === '\r' || c === '\n') {
        rowIsEmpty = true
        ident = 0
        row++
        col = 0
        offset++
        col++
        return true
      }
      return false
    },
    getIdent() {
      return ident
    },
    isIdented(parentIdent) {
      return (offset < src.code.length) && (parentIdent < ident)
    },
    rowIsEmpty() {
      return rowIsEmpty
    },
    checkIdent(val: number) {
      if (val !== ident) environment.fatal(
        'Ident atual=' + ident + ' esperadado=' + val,
        self.loc()
      )
    },
    is(str: string) {
      const l = str.length
      const r = src.code.substr(offset, l) === str
      return r
    },
    skip(str: string) {
      const l = str.length
      const r = src.code.substr(offset, l) === str
      if (r) {
        offset += l
        col += l
      }
      return r
    },
    check(str: string) {
      if (!self.skip(str))
        environment.fatal(
          'Esperadado ' + str + ' mas está ' + src.code.substr(offset, str.length),
          self.loc()
        )
    },
    isString() {
      const c = src.code[offset]
      return c === "'" || c === '"'
    },
    checkString() {
      if (!self.isString()) environment.fatal(
        'String era esperada aqui',
        self.loc()
      )
    },
    readString() {
      self.checkString()
      const start = self.locStart()
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
      const r: TokenString = {
        kind: quote,
        str: ret.join(''),
        loc: self.loc(start)
      }
      return r
    },
    readWhile(fn: (c: string, n: string) => boolean): Token {
      const start = self.locStart()
      while (offset < src.code.length) {
        if (!fn(src.code[offset], src.code[offset + 1])) break
        offset++
        col++
      }
      const r: Token = {
        str: src.code.substr(start.offset, offset - start.offset),
        loc: self.loc(start)
      }
      return r
    },
    nextWord() {
      const start = self.locStart()
      self.skipSpaces(true)
      const w = self.readWhile((c, n) => !(c === ' ' || c === '\n' || c === '\r' || c === '\n' || n === undefined))
      self.locSet(start)
      return w
    },
    toString(): string {
      return self.nextWord().str
    }
  }
  return self
}
