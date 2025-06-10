import { constants } from 'node:http2';

import request from 'supertest';

import { app } from '../../src/app';

describe('Parser API', () => {
    it('should try parse successfully', async () => {
        const res = await request(app).post('/try-parse').send({
            cell: 'te6cckEBAgEAywABsA+KfqUADpIH1lB9/kBfXhAIAO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCdABSzBN6cnxDwDjn/IQXqgU8OJXUMcol9pxyL+yLkpKzYiA7msoEBANslk4VhgAIqFqMWTE1aoxM/MRD/EEluAMqKyKvv/FAn4CTTNIDD6gjOY1bdABSzBN6cnxDwDjn/IQXqgU8OJXUMcol9pxyL+yLkpKzYsAJXpnI3GpDhSbfSWGTb/USCfMHoow3xseDEM4UCreKtluqcoI0=',
        });

        expect(res.statusCode).toEqual(constants.HTTP_STATUS_OK);
        expect(res.body.success).toBeTruthy();
        expect(res.body.result.parsedCell).toMatchObject({
            opCode: 260734629,
            schema: 'jettons',
            internal: 'jetton_transfer',
            data: {
                kind: 'JettonTransfer',
                query_id: '4101212031974910',
                amount: '100000000',
                destination: 'EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt',
                response_destination: 'EQBSzBN6cnxDwDjn_IQXqgU8OJXUMcol9pxyL-yLkpKzYs9U',
                custom_payload: { kind: 'Maybe_nothing' },
                forward_ton_amount: '125000000',
                forward_payload: { kind: 'Either_right', value: { parsed: {} } },
            },
        });
    });

    it.each([{ cell: 1 }, {}, { cell: null }, { cell: undefined }, { cell: 'Invalid base64' }])(
        'should fail try parse on invalid body params',
        async (body) => {
            const res = await request(app).post('/parse').send(body);
            expect(res.statusCode).toEqual(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY);
            expect(res.body).toHaveProperty('error');
        },
    );
});
