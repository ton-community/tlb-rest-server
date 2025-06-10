import { RequestHandler } from 'express';
import promBundle from 'express-prom-bundle';
import promClient from 'prom-client';

const defaultMetrics = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    promClient: {
        collectDefaultMetrics: {},
    },
    formatStatusCode(res) {
        return `${res.statusCode.toString()[0]}xx`;
    },
});

const requestTotal = new promClient.Counter({
    name: 'request_total',
    help: 'Total number of requests received',
    labelNames: ['method', 'path'],
});

const requestErrorsTotal = new promClient.Counter({
    name: 'request_errors_total',
    help: 'Total number of error responses',
    labelNames: ['method', 'path'],
});

export const customMetrics: RequestHandler = (req, res, next) => {
    const counterProps = { method: req.method, path: req.path };
    requestTotal.inc(counterProps);

    res.on('finish', () => {
        if (res.statusCode >= 400) {
            requestErrorsTotal.inc(counterProps);
        }
    });

    next();
};

export const metrics = [defaultMetrics, customMetrics];
