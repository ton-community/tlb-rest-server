import { RequestHandler } from 'express';

export type RequestHandlerBody<ReqBody> = RequestHandler<unknown, unknown, ReqBody>;
