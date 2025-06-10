import { RequestHandler } from 'express';

import { ResponseDTO } from './dtos';

export const healthCheck: RequestHandler = async (_req, res, _next) => {
    res.send(
        ResponseDTO.fromResult({
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now(),
        }),
    );
};
