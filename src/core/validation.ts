import { RequestHandler } from 'express';
import { Schema } from 'zod';

const validationFactory = (target: 'body' | 'params' | 'query') => {
    return (schema: Schema): RequestHandler => {
        return async (req, _res, next) => {
            try {
                req[target] = await schema.parseAsync(req[target]);
                next();
            } catch (err) {
                next(err);
            }
        };
    };
};

export const applyQueryValidation = validationFactory('query');
export const applyBodyValidation = validationFactory('body');
