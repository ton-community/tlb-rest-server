import { Cell } from '@ton/core';

import { parseCell, encodeCell } from './parser';
import { groupCorpusFlat } from './tesdata';

describe('TLBRuntime', () => {
    describe('deserialize', () => {
        describe.each(Object.keys(groupCorpusFlat))('%s', (group) => {
            it.each(groupCorpusFlat[group])('deserialize %s', (schema, expected, boc) => {
                const actual = parseCell(schema, Cell.fromHex(boc));
                expect(actual).toEqual(expected);
            });
        });
    });

    describe('serialize', () => {
        describe.each(Object.keys(groupCorpusFlat))('serialize %s', (group) => {
            it.each(groupCorpusFlat[group])('serialize %s', (schema, data, expected) => {
                const actual = encodeCell(schema, data).toBoc().toString('hex');
                expect(actual).toEqual(expected);
            });
        });
    });
});
