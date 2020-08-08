import { expect } from 'chai';
import { SourceCode, createTokenizer } from '../src';
import { createEnvironment } from './testlib';

describe('tokenizer', () => {
  it('skipSpaces / is / check / isEof', () => {
    const src: SourceCode = {
      code: ' \n\t\rok\n \t\r',
      path: [''],
    }
    const t = createTokenizer(createEnvironment(''), src)
    expect(t.pos).to.equal(0);
    expect(t.is('ok')).to.equal(false);
    t.skipSpaces()
    expect(t.pos).to.equal(4);
    expect(t.is('ok')).to.equal(true);    
    expect(t.pos).to.equal(6);
    expect(t.is('ok')).to.equal(false);
    expect(t.isEof()).to.be.false
    t.skipSpaces()
    expect(t.isEof()).to.be.true
    expect(t.environment.diagnostics()).to.deep.eq([])
  });

  it('String Single', () => {
    const src: SourceCode = {
      code: "'ok'",
      path: [''],
    }
    const t = createTokenizer(createEnvironment(''), src)

    const s1 = t.readString()
    expect(s1.kind).to.be.eq("'")
    expect(s1.str).to.be.eq('ok')
    expect(s1.start).to.be.eq(0)
    expect(s1.length).to.be.eq(4)

    expect(t.environment.diagnostics()).to.deep.eq([])
  });

  it('String Double', () => {
    const src: SourceCode = {
      code: '"ok"',
      path: [''],
    }
    const t = createTokenizer(createEnvironment(''), src)

    const s1 = t.readString()
    expect(s1.kind).to.be.eq('"')
    expect(s1.str).to.be.eq('ok')
    expect(s1.start).to.be.eq(0)
    expect(s1.length).to.be.eq(4)

    expect(t.environment.diagnostics()).to.deep.eq([])
  });

  it('hw.app', async () => {
    const env = createEnvironment('ws1')
    const sources = await env.sources()
    const hwapp = sources.filter((s) => s.path[0] === 'hw.app')[0]
    expect(sources).not.to.be.undefined
    const t = createTokenizer(env, hwapp)

    t.checkIdent(0);
    t.check('application')
    t.skipSpaces()
    expect(t.row).to.eq(1)
    expect(t.col).to.eq(13)
    t.check('hw')

    t.skipSpaces()
    expect(t.row).to.eq(3)
    expect(t.col).to.eq(1)
    t.check('uses')
    t.skipSpaces()
    expect(t.row).to.eq(3)
    expect(t.col).to.eq(6)
    t.check('hw')

    t.skipSpaces()
    expect(t.row).to.eq(5)
    expect(t.col).to.eq(1)
    t.check('routes')

    t.skipSpaces()
    expect(t.row).to.eq(6)
    expect(t.col).to.eq(3)
    const s1 = t.readString()
    expect(s1.kind).to.be.eq("'")
    expect(s1.str).to.be.eq('/')
    t.check(':')
    t.skipSpaces()
    t.check('hi')

    t.skipSpaces()
    expect(t.row).to.eq(7)
    expect(t.col).to.eq(3)
    const s2 = t.readString()
    expect(s2.kind).to.be.eq("'")
    expect(s2.str).to.be.eq('/${n:number}')
    t.check(':')
    t.skipSpaces()
    t.check('hi(n)')

    expect(t.environment.diagnostics()).to.deep.eq([])
  })
});