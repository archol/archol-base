import { expect } from 'chai';
import { readdirSync, statSync, readFileSync, } from 'fs';
import { Environment, Diagnostic, SourceCode } from '../src';

const cacheSources: {
  [folder: string]: SourceCode[]
} = {}

export function createEnvironment(ws: string) {
  if (!ws) return null as unknown as Environment
  const diags: Diagnostic[] = []
  const r: Environment = {
    sources() {
      return getSources(ws)
    },
    diagnostics() {
      return diags
    },
    addDiagnostic(d) {
      diags.push(d)
    }
  }
  return r
}

export async function getSources(ws: string): Promise<SourceCode[]> {
  return cacheSources[ws] || (cacheSources[ws] = initCache())
  function initCache() {
    const sources: SourceCode[] = []
    readdir([])
    return sources
    function readdir(subdir: string[]) {
      const dir = __dirname + '/samples/' + ws + (subdir.length?'/' + subdir.join('/'):'/')
      for (const f of readdirSync(dir)) {
        const st = statSync(dir + f)
        if (st.isDirectory()) readdir(subdir.concat(f))
        else if (st.isFile()) sources.push({
          path: subdir.concat(f),
          code: readFileSync(dir + f, 'utf-8')
        })
      }
    }
  }
}

describe('testlib', () => {
  it('getSources', async () => {
    const sources = await getSources('ws1')
    expect(sources.map((s) => s.path.join('/'))).to.deep.equal([
      'app.yaml'
    ]);
  });
  it('createEnvironment', async () => {
    const env = createEnvironment('ws1')
    expect(await env.sources()).to.deep.equal(await getSources('ws1'));
    expect(env.diagnostics()).to.deep.equal([]);
  });
});
