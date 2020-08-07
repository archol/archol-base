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
        t.check('ok')
        expect(t.pos).to.equal(6);
        expect(t.is('ok')).to.equal(false);
        expect(t.isEof()).to.be.false
        t.skipSpaces()
        expect(t.isEof()).to.be.true
    });
});