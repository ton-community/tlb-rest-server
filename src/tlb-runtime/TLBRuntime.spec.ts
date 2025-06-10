import { readFileSync } from 'fs';
import { join } from 'path';

import { parseCell, encodeCell } from './parser';
import { ParsedCell } from './TLBRuntime';

const tesdata: [string, ParsedCell, string][] = JSON.parse(readFileSync(join(__dirname, 'tesdata.json'), 'utf8'));

describe('TLBRuntime', () => {
    it.each(tesdata)('deserialize %s', (schema, expected, boc) => {
        const actual = parseCell(schema, boc);
        expect(actual).toEqual(expected);
    });

    it.each([tesdata[1]])('serialize %s', (schema, data, expected) => {
        const actual = encodeCell(schema, data).toBoc().toString('base64');
        expect(actual).toEqual(expected);
    });
});
