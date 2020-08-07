import { expect } from 'chai';
import { readFileSync } from 'fs';
import { Environment, Diagnostic, SourceCode } from '../src';

const ws1Sources: SourceCode[] = [
  {
    path: 'app.yaml',
    code: readFileSync(__dirname + '/samples/ws1/app.yaml', 'utf-8')
  }
]

export function createEnvironment() {
  const diags: Diagnostic[] = []
  const r: Environment = {
    sources() {
      return ws1Sources
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

describe('testlib', () => {
  it('createEnvironment', () => {
    const env=createEnvironment()
    expect(env.sources()).to.deep.equal(ws1Sources);
    expect(env.diagnostics()).to.deep.equal([]);
  });
});
