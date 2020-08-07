export interface SourceCode {
  path: string
  code: string
}

export interface SourceRef {
  sourceCode: SourceCode
  start: number
  length: number
}

export interface Environment {
  sources(): SourceCode[]
  diagnostics(): Diagnostic[]
  addDiagnostic(d: Diagnostic): void
}

export interface Diagnostic {
  ref: SourceRef
  msg: string
}