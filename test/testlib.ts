import { expect } from 'chai';
import { readdirSync, statSync, readFileSync, } from 'fs';
import { Environment, Diagnostic, SourceCode } from '../src';

const cacheSources: {
  [folder: string]: SourceCode[]
} = {}

export function createEnvironment(ws: string, languages?: string[]) {
  const diags: Diagnostic[] = []
  const r: Environment = {
    languages: languages || ['pt-br'],
    sources() {
      return getSources(ws)
    },
    diagnostics() {
      return diags
    },
    warn(msg, ref) {
      diags.push({ msg, ref, kind: 'warn' })
    },
    error(msg, ref) {
      diags.push({ msg, ref, kind: 'error' })
    },
    fatal(msg, ref) {
      diags.push({ msg, ref, kind: 'fatal' })
      throw new Error(msg + ' at ' + ref.sourceCode.path + ':' + ref.pos.start.line + ':' + ref.pos.start.column)
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
      const dir = __dirname + '/samples/' + ws + (subdir.length ? '/' + subdir.join('/') : '/')
      for (const f of readdirSync(dir)) {
        const st = statSync(dir + f)
        if (st.isDirectory()) readdir(subdir.concat(f))
        else if (st.isFile()) {
          const src: SourceCode = {
            path: subdir.concat(f),
            code: readFileSync(dir + f, 'utf-8'),
            createRef(start, length) {
              return {
                sourceCode: src,
                start, length,
                pos: 0 as any,
              }
            }
          }
          sources.push(src)
        }
      }
    }
  }
}

describe('testlib', () => {
  it('getSources', async () => {
    const sources = await getSources('ws1')
    expect(sources.map((s) => s.path.join('/')).sort()).to.deep.equal([
      'hi.pug',
      'hi2.pug',
      'hw.app',
      'hw.pkg',
    ]);
  });
  it('createEnvironment', async () => {
    const env = createEnvironment('ws1')
    expect(await env.sources()).to.deep.equal(await getSources('ws1'));
    expect(env.diagnostics()).to.deep.equal([]);
  });
});
