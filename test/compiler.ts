import { expect } from 'chai';
import { compile } from '../src';
import { createEnvironment } from './testlib';

describe('compiler', () => {
  it('hw', async () => {
    const env = createEnvironment('ws1')

    const ast = await compile(env);
    expect(env.diagnostics()).to.deep.eq([])
    expect(ast.applications.length).to.eq(1)
    expect(ast.packages.length).to.eq(1)
    const app = ast.applications[0]

    expect(app).to.deep.eq({
      kind: 'Application',
      loc: {
        start: 0,
        length: 68,
      },
      name: {
        kind: 'Identifier',
        text: 'hw',
        loc: {
          start: 6,
          length: 2,
        }
      }
    })
  })
});