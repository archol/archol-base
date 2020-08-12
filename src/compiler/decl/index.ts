import { SourceRef } from '../../source'

export interface AstDecl {
  applications: Application[]
  packages: Package[]
  views: View[]
}

export type NodeKind = 'Identifier'
  | 'Literal' | 'LiteralBoolean' | 'LiteralString' | 'LiteralNumber' | 'LiteralArray' | 'LiteralObject'
  | 'Icon' | 'Role'
  | 'Application'
  | 'Package' | 'PackageUses'
  | 'Type'
  | 'Field' | 'Index'
  | 'Document'
  | 'DocAction' | 'DocActions'
  | 'DocField' | 'DocFields'
  | 'DocumentState' | 'DocumentStates'
  | 'Processes' | 'Process'

export interface DeclNode<KIND extends NodeKind> {
  kind: KIND
  loc: SourceRef
}

export interface Identifier extends DeclNode<'Identifier'> {
  name: string
}

export interface Literal<KIND extends NodeKind> extends DeclNode<KIND> {
  GetAsAny(): any
}

export interface LiteralBoolean extends Literal<'LiteralBoolean'> {
  val: boolean
}

export interface LiteralNumber extends Literal<'LiteralNumber'> {
  val: number
}

export interface LiteralString extends Literal<'LiteralString'> {
  val: string
}

export interface LiteralArray<T extends DeclNode<any>> extends Literal<'LiteralArray'> {
  items: T[]
  getitem(idx: number): T | undefined
}

export interface LiteralObject<T extends DeclNode<any>, KIND extends NodeKind = 'LiteralObject'> extends Literal<KIND> {
  props: Array<LiteralProp<T>>
  get(name: string): T | undefined
}

export interface LiteralProp<T extends DeclNode<any>> {
  name: LiteralString
  val: T
}

export interface Icon extends DeclNode<'Icon'> {
  name: Identifier
}

export interface Application extends DeclNode<'Application'> {
  name: Identifier
  description: I18N,
  icon: Icon,
  uses: PackageUses,
  packages: {
    [uri in PackageURI]: Package
  },
  langs: Lang[]
  builders: {
    [builderName: string]: BuilderConfig
  }
  mappings: AppMappings
}

export interface AppMappings {
  [uri: string]: string
}

export type I18N = LiteralString | {
  [lang in Lang]?: LiteralString
}

export type Lang = 'pt' | 'en'

export type PackageURI = '$PackageURI'

export type PackageUses = LiteralObject<LiteralString, 'PackageUses'>

export interface Package extends DeclNode<'Package'> {
  name: Identifier
  uri: {
    id: string
    full: PackageURI
    ns: string
    path: string
  },
  redefines?: PackageURI
  uses: PackageUses,
  types: Types,
  documents: Documents,
  processes: Processes,
  roles: Roles
  views: Views,
  functions: Functions,
}

export type Roles = {
  [typeName: string]: Role
}

export interface Role extends DeclNode<'Role'> {
  description: I18N,
  icon: Icon
}

export type Types = {
  [typeName: string]: Type
}

export const basicTypes = {
  string: true,
  number: true,
  boolean: true,
  date: true
}

export interface Ast {
  func: any
}

export interface Type extends DeclNode<'Type'> {
  base: keyof typeof basicTypes
  validate: Ast | false
  format: Ast | false
  parse: Ast | false
}

export type Fields = {
  [typeName: string]: Field
}

export interface Field extends DeclNode<'Field'> {
  type: string
}

export type Indexes = {
  [typeName: string]: Index
}

export interface Index extends DeclNode<'Index'> {
  type: string
}

export type Documents = {
  [typeName: string]: Document
}

export interface Document extends DeclNode<'Document'> {
  identification: LiteralString
  primaryFields: DocFields
  secondaryFields: DocFields
  // indexes: DocIndexes,
  persistence: 'session' | 'persistent'
  states: DocumentStates
  actions: DocActions
}

// export type DocIndexes = LiteralObject<DocIndex, 'DocIndexes'>

export type DocActions = LiteralObject<DocAction, 'DocActions'>

export interface DocAction extends DeclNode<'DocAction'> {
  from: LiteralString[]
  to: LiteralString[]
  icon: Icon
  description: I18N
  run: Ast | false
}

export type DocFields = LiteralObject<DocField, 'DocFields'>

export interface DocField extends DeclNode<'DocField'> {
  description: I18N
  type: LiteralString
}

export type DocumentStates = LiteralObject<DocumentState, 'DocumentStates'>

export interface DocumentState extends DeclNode<'DocumentState'> {
  icon: Icon
  description: I18N
}

export type Processes = LiteralObject<Process, 'Processes'>

export interface Process extends DeclNode<'Process'> {
  start: LiteralString
  icon: Icon
  title: I18N
  caption: I18N
  tasks: Tasks
  vars: {
    input: Fields,
    output: Fields,
    local: Fields,
  }
  roles: LiteralString[]
  volatile: LiteralBoolean
}

export type Tasks = {
  [typeName: string]: Task
}

export type Task = UITask | SystemTask
export type NextTask = LiteralString | {
  [task: string]: Ast
}

export interface BaseTask {
  pool?: LiteralString,
  lane?: LiteralString,
  roles: LiteralString[]
  next: NextTask | NextTask[]
}

export interface UITask extends BaseTask {
  useView: UseView
}

export interface BindFields {
  [field: string]: LiteralString
}

export interface UseView {
  view: LiteralString
  bind: BindFields,
}

export interface SystemTask extends BaseTask {
  useFunction: UseFunction
}

export interface UseFunction {
  function: string
  input: BindFields,
  output: BindFields,
}

export type Views = {
  [typeName: string]: View
}

export interface View {
  name: Identifier
  content: Widget[]
  primaryAction?: ViewAction
  secondaryAction?: ViewAction
  othersActions?: ViewAction[]
}

export interface ViewAction {
  caption: I18N
  run: "next" | "back" | UseFunction
}

export interface Widget {
  kind: "entry" | "show",
  children?: Widget[]
  field?: LiteralString,
  type?: LiteralString
}

export type Functions = {
  [typeName: string]: FunctionDef
}

export type FunctionLevel = "cpu" | "io" | "net"

export interface FunctionDef {
  level: FunctionLevel
  input: Fields
  output: Fields
  code: Ast
}

export interface BuilderConfig {
  rootDir: LiteralString
}
