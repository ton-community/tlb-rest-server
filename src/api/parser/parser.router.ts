import express from 'express';

import { applyBodyValidation } from '../../core/validation';
import { handleParseRequest, handleTryParseRequest } from './parser.handlers';
import { parseTlbBodySchema, tryParseTlbBodySchema } from './parser.schemas';

const router = express.Router();

router.post('/parse', applyBodyValidation(parseTlbBodySchema), handleParseRequest);
router.post('/try-parse', applyBodyValidation(tryParseTlbBodySchema), handleTryParseRequest);

export { router };
