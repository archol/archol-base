import { expect } from 'chai';
import { SourceCode, createTokenizer } from '../src';
import { createEnvironment } from './testlib';

describe('tokenizer', () => {
    it('skipSpaces / check', () => {
        const src: SourceCode = {
          code: ' \n\t\rok\n \t\r',
          path: '',
        }
        const t = createTokenizer(createEnvironment(), src)        
        expect(t.pos).to.equal(0);
        t.skipSpaces()
        expect(t.pos).to.equal(4);
    });
});