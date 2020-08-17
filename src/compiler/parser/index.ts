import { Environment } from '../../source';
import { AstDecl, Application, Package, View } from '../decl';
import { createTokenizer } from '../../token';
import { parseApp } from './parseApplication';
import { parseView } from './parseView';
import { parsePackage } from './parsePackage';

export async function parseWorkspace(env: Environment): Promise<AstDecl> {
  const applications: Application[] = []
  const packages: Package[] = []
  const views: View[] = []
  const sources = await env.sources()
  for (const src of sources) {
    const t = createTokenizer(env, src)
    const start = t.locStart()
    while (!t.isEof()) {
      t.skipSpaces(true)
      t.checkIdent(start)
      if (!parseApp(t, applications))
        if (!parsePackage(t, packages))
          if (!parseView(t, views)) {
            const w = t.nextWord()
            t.environment.fatal('comando inesperado: ' + w.str, w.loc)
          }
      t.skipSpaces(true)
    }
  }
  const ret: AstDecl = {
    applications: applications.sort((a, b) => a.name.fullname().localeCompare(b.name.fullname())),
    packages: packages.sort((a, b) => a.name.fullname().localeCompare(b.name.fullname())),
    views: views.sort((a, b) => a.name.fullname().localeCompare(b.name.fullname())),
  }
  return ret
}
