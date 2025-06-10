import { constants } from 'node:http2';

import request from 'supertest';

import { app } from '../../src/app';

describe('Parser API', () => {
    it('should parse successfully', async () => {
        const res = await request(app).post('/parse').send({
            schema: 'foo$01 v:uint32 = Foo;bar$10 v:uint128 = Bar;',
            cell: 'te6cckEBAQEABwAACUAAAAqgsDZXlg==',
        });
        expect(res.statusCode).toEqual(constants.HTTP_STATUS_OK);
        expect(res.body.success).toBeTruthy();
        expect(res.body.result.parsedCell).toEqual({ kind: 'Foo', v: 42 });
        expect(res.body.result.meta).toBeUndefined();
    });

    it.each([
        { schema: 1, cell: 1 },
        { schema: 'foo$01 v:uint32 = Foo;bar$10 v:uint128 = Bar;' },
        { cell: 'te6cckEBAQEABwAACUAAAAqgsDZXlg==' },
        {
            schema: 'foo$01 v:uint32 = Foo;bar$10 v:uint128 = Bar;',
            cell: 'Invalid cell',
        },
        {
            schema: 'foo$01 v:uint32 = Foo;bar$10 v:uint128 = Bar;',
            cell: 'te6cckEBAQEABwAACUAAAAAAAAAAAAqgsDZXlg====',
        },
    ])('should fail parse on invalid body params', async (body) => {
        const res = await request(app).post('/parse').send(body);
        expect(res.statusCode).toEqual(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY);
        expect(res.body).toHaveProperty('error');
    });

    it.each([
        {
            schema: 'foo$01 some crap v:uint32 = Foo;bar$10 v:uint128 = Bar;',
            cell: 'te6cckEBAQEABwAACUAAAAqgsDZXlg==',
        },
    ])('should throw ParsingError if fails while parsing', async (body) => {
        const res = await request(app).post('/parse').send(body);
        expect(res.statusCode).toEqual(constants.HTTP_STATUS_BAD_REQUEST);
        expect(res.body).toHaveProperty('error');
    });
});
