import { Cell } from '@ton/core';
import { parseWithPayloads } from '@truecarry/tlb-abi';

import { TryParseError } from './try-parse.error';

function loadCellFromData(data: Cell | string) {
    if (data instanceof Cell) {
        return data;
    }

    try {
        return Cell.fromBase64(data);
    } catch (cause) {
        throw new TryParseError('Cell has an invalid format', { cause });
    }
}

export function tryParseCell(data: Cell | string) {
    const cell = loadCellFromData(data);
    try {
        return parseWithPayloads(cell.beginParse());
    } catch (cause) {
        throw new TryParseError('Unknown cell parsing error', { cause });
    }
}
