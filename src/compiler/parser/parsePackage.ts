import { Tokenizer } from '../../token';
import { Package } from '../decl';

export function parsePackage(t: Tokenizer, packages: Package[]): boolean {
 if (!t.skip('package')) return false
  t.readWhile((c) => c !== undefined)
  const pkg: Package = null as any as Package
  packages.push(pkg)
  return true
}
