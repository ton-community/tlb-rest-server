import { Address, Cell, comment } from '@ton/core';

import { tryParseCell } from './index';

import '@ton/test-utils';

describe('try parse', () => {
    it.skip('should parse simple comment', () => {
        const body = comment('Hello!');
        const res = tryParseCell(body);
        expect(res).toEqual('Hello!');
    });
    it('should parse TeleItem deploy', () => {
        const body = Cell.fromHex(
            'b5ee9c720101050100d9000453299a3e15800aa2fb4294180b1c957b8f0c6be41f41df40300842c0f9a0baaf1c337865339e0807270e010102030400261061737472616c73686172642d31313438010000680168747470733a2f2f6e66742e667261676d656e742e636f6d2f676966742f61737472616c73686172642d313134382e6a736f6e00678002b026c4735b62bbab3bf218c83f3dfa6259fd70cc9e431e987cbf9d3b2bcd80e807270e00807270e000a00000258000002590004b00050064800d1e740eda68a3431fa83c0b8e3698040a8ba8d64eae0c9ccb04bbda18937e0590',
        );
        const res = tryParseCell(body);
        expect(res?.internal).toEqual('teleitem_deploy');
        expect(res?.data.kind).toEqual('TeleitemDeploy');
    });
    it('should parse jetton stonfi swap', () => {
        const body = Cell.fromHex(
            'b5ee9c720101020100cb0001b00f8a7ea5000e9207d6507dfe405f5e100800ef3b9902a271b2a01c8938a523cfe24e71847aaeb6a620001ed44a77ac0e709d0014b304de9c9f10f00e39ff2105ea814f0e25750c72897da71c8bfb22e4a4acd8880ee6b2810100db2593856180022a16a3164c4d5aa3133f3110ff10496e00ca8ac8abeffc5027e024d33480c3ea08ce6356dd0014b304de9c9f10f00e39ff2105ea814f0e25750c72897da71c8bfb22e4a4acd8b00257a672371a90e149b7d25864dbfd44827cc1e8a30df1b1e0c4338502ade2ad96',
        );

        const { data } = tryParseCell(body)!;

        expect(data).toMatchObject({
            kind: 'JettonTransfer',
            query_id: 4101212031974910n,
            amount: 100000000n,
            custom_payload: { kind: 'Maybe_nothing' },
            forward_ton_amount: 125000000n,
        });

        if (data.kind !== 'JettonTransfer') throw new Error();

        expect(data.destination).toEqualAddress(Address.parse('EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt'));
        expect(data.response_destination).toEqualAddress(
            Address.parse('EQBSzBN6cnxDwDjn_IQXqgU8OJXUMcol9pxyL-yLkpKzYs9U'),
        );
        expect(data.forward_payload.kind).toEqual('Either_right');

        if (!('parsed' in data.forward_payload.value)) throw new Error();

        expect(data.forward_payload.value.parsed).toMatchObject({
            opCode: 630424929,
            schema: 'ston_fi',
            payload: 'stonfi_swap',
            data: {
                kind: 'JettonStonfiSwap_swap',
                min_out: 18911177582n,
                referral_address: {
                    kind: 'Maybe_just',
                },
            },
        });
    });
});
