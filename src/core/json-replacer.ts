import { Address } from '@ton/core';

export function jsonReplacer(_key: string, value: unknown): unknown {
    if (typeof value === 'bigint') {
        return value.toString();
    } else if (value instanceof Address) {
        return value.toString();
    }
    return value;
}
