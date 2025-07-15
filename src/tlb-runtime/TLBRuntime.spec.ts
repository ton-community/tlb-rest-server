import { readFileSync } from 'fs';
import { join } from 'path';

import { parseCell, encodeCell } from './parser';
import { unwrap } from './Result';
import { ParsedCell, parseTLB, TLBRuntime } from './TLBRuntime';
import { corpus } from './tesdata';

function loadTestData(name: string): { tlb: TLBRuntime; cases: [ParsedCell, string][] } {
    const dataPath = join(__dirname, 'testdata');
    const tlb = parseTLB(readFileSync(join(dataPath, `${name}.tlb`), 'utf8'));
    const cases = JSON.parse(readFileSync(join(dataPath, `${name}.json`), 'utf8'));
    return {
        tlb,
        cases,
    };
}

const testSchema = loadTestData('test');

describe('TLBRuntime', () => {
    describe('TLBRuntime deserialize', () => {
        describe.each(Object.keys(corpus))('%s', (group) => {
            it.each(corpus[group])('deserialize corpus %s', (schema, expected, boc) => {
                const actual = parseCell(schema, boc);
                expect(actual).toEqual(expected);
            });
        });

        it.each(testSchema.cases)('deserialize test %s', (expected, boc) => {
            const actual = unwrap(testSchema.tlb.deserialize(boc));
            expect(actual).toEqual(expected);
        });
    });

    describe('TLBRuntime serialize', () => {
        describe.each(Object.keys(corpus))('serialize corpus %s', (group) => {
            it.each(corpus[group])('serialize %s', (schema, data, expected) => {
                const actual = encodeCell(schema, data).toBoc().toString('base64');
                expect(actual).toEqual(expected);
            });
        });

        it.each(testSchema.cases)('serialize test %s', (data, expected) => {
            const actual = unwrap(testSchema.tlb.serialize(data)).endCell().toBoc().toString('base64');
            expect(actual).toEqual(expected);
        });
    });
});
