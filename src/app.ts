import express, { type Express } from 'express';
import helmet from 'helmet';

import { router as parserRouter } from './api/parser';
import { errorHandler } from './core/error-handler';
import { healthCheck } from './core/healthcheck';
import { jsonReplacer } from './core/json-replacer';
import { metrics } from './core/metrics';

const app: Express = express();

app.use(express.json());
app.set('json replacer', jsonReplacer);

app.set('trust proxy', true);
app.use(helmet());

app.get('/health', healthCheck);

app.use(metrics);

app.use(parserRouter);

app.use(errorHandler);

export { app };
