import { constants } from 'node:http2';

import { ResponseDTO } from '../../core/dtos';
import { findMetaForSchema } from '../../core/tlb-meta/tlb-meta';
import { RequestHandlerBody } from '../../core/types';
import { tryParseCell } from '../../tlb-parser';
import { parseCell } from '../../tlb-runtime';
import { ParseTlbBody, TryParseTlbBody } from './parser.schemas';

export const handleParseRequest: RequestHandlerBody<ParseTlbBody> = async (req, res, next) => {
    try {
        const { schema, cell } = req.body;

        const parsedCell = parseCell(schema, cell);
        const meta = findMetaForSchema(schema, parsedCell);

        res.status(constants.HTTP_STATUS_OK).json(
            ResponseDTO.fromResult({
                meta: meta,
                parsedCell,
            }),
        );
        return;
    } catch (err) {
        next(err);
    }
};

export const handleTryParseRequest: RequestHandlerBody<TryParseTlbBody> = async (req, res, next) => {
    try {
        const { cell } = req.body;

        const parsedCell = tryParseCell(cell);

        res.status(constants.HTTP_STATUS_OK).json(
            ResponseDTO.fromResult({
                parsedCell,
            }),
        );
        return;
    } catch (err) {
        next(err);
    }
};
