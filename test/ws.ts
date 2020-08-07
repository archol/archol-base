import { expect } from 'chai';
import { ws } from '../src';

describe('ws', () => {
    it('can be initialized without an initializer', () => {
        const s = ws()
        expect(s).to.equal(1);
    });
});