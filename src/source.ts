export interface SourceCode {
  path: string[]
  code: string
  createRef(start: number, length: number): SourceRef
}

export interface SourceRef {
  sourceCode: SourceCode
  start: number
  length: number
  pos: {
    start: {
      line: number
      column: number
    },
    end: {
      line: number
      column: number
    }
  }
}

export interface Token {
  str: string,
  loc: SourceRef
}

export interface Environment {
  languages: string[]
  sources(): Promise<SourceCode[]>
  diagnostics(): Diagnostic[]
  warn(msg: string, ref: SourceRef): void
  error(msg: string, ref: SourceRef): void
  fatal(msg: string, ref: SourceRef): void
}

export interface Diagnostic {
  ref: SourceRef
  msg: string
  kind: 'fatal' | 'error' | 'warn'
}