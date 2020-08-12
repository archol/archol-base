import { Environment } from '../source';
import { parseWorkspace } from './parser';
import { compileDefinitions } from './linker';

export async function compile(env: Environment) {
  const decl = await parseWorkspace(env)
  return compileDefinitions(decl)
}
