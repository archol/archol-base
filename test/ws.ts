import { expect } from 'chai';
import { ws } from '../src';

describe('ws', () => {
    it('FAZER', () => {
        const s = ws()
        expect(s).to.equal(1);
    });
});