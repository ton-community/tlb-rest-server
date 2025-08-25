import { ParsedCell } from '@ton-community/tlb-runtime';

import { cleanSchema } from './utils';

type TlbMeta = {
    schema: string;
    metaSelector: (obj: unknown) => unknown;
};

const tlbMetaArray = <TlbMeta[]>[];

export function findMetaForSchema(schema: string, parsedCell: ParsedCell): unknown {
    const cleanedSchema = cleanSchema(schema);
    const tlbMeta = tlbMetaArray.find((meta) => cleanSchema(meta.schema) === cleanedSchema);
    if (!tlbMeta) return;

    return tlbMeta.metaSelector(parsedCell);
}
