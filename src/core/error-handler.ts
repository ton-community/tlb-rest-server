import { constants } from 'node:http2';

import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { TryParseError } from '../tlb-parser/try-parse.error';
import { TLBRuntimeError } from '../tlb-runtime';
import { ResponseDTO } from './dtos';
import { logger } from './logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    logger.debug(err);
    if (err instanceof ZodError) {
        res.status(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY).json(ResponseDTO.fromError(err.message, err.errors));
        return;
    }

    if (err instanceof TryParseError) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json(ResponseDTO.fromError(err.message));
        return;
    }

    if (err instanceof TLBRuntimeError) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json(ResponseDTO.fromError(err.message));
        return;
    }

    logger.error(err);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(ResponseDTO.fromError('Internal server error'));
    return;
};
