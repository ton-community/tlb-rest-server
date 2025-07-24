import { Cell, beginCell, Address, ExternalAddress, Dictionary } from '@ton/core';

import { ParsedCell } from './TLBRuntime';

// based on https://github.com/ton-community/tlb-test-corpus
export type TLBSchema = string;
export type BoCBase64 = string;
export type TLBGroupItem = [TLBSchema, [ParsedCell, BoCBase64][]];
export type TLBGroup = string;
export type TLBCorpus = { [key: TLBGroup]: TLBGroupItem[] };
export type TLBCase = [TLBSchema, ParsedCell, BoCBase64];
export type TLBGroupFlat = { [key: TLBGroup]: TLBCase[] };
export function makeGroupFlat(corpus: TLBCorpus): TLBGroupFlat {
    const out: TLBGroupFlat = {};
    for (const key of Object.keys(corpus)) {
        if (!out[key]) out[key] = [];
        for (const list of corpus[key]) {
            const schema = list[0];
            for (const item of list[1]) {
                out[key].push([schema, item[0], item[1]]);
            }
        }
    }
    return out;
}
// language=tlb
export const TLBStd = {
    Unit: 'unit$_ = Unit;',
    Bit: 'bit$_ (## 1) = Bit;',
    True: 'true$_ = True;',
    Bool: 'bool_false$0 = Bool; bool_true$1 = Bool;',
    Maybe: 'nothing$0 {X:Type} = Maybe X; just$1 {X:Type} value:X = Maybe X;',
    Either: 'left$0 {X:Type} {Y:Type} value:X = Either X Y; right$1 {X:Type} {Y:Type} value:Y = Either X Y;',
    VarInteger: 'var_int$_ {n:#} len:(#< n) value:(int (len * 8)) = VarInteger n;',
    VarUInteger: 'var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;',
    Unary: 'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);',
};
// language=tlb
export const TLBHmLabel = `${TLBStd.Bit}${TLBStd.Unary}hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m; hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m; hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;`;
// language=tlb
export const TLBLib = {
    Grams: `${TLBStd.VarUInteger}nanograms$_ amount:(VarUInteger 16) = Grams;`,
    HashmapE: `${TLBHmLabel}hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X; hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X; hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X) right:^(Hashmap n X) = HashmapNode (n + 1) X; hme_empty$0 {n:#} {X:Type} = HashmapE n X; hme_root$1 {n:#} {X:Type} root:^(Hashmap n X) = HashmapE n X;`,
    HashmapAugE: `${TLBHmLabel}ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#} label:(HmLabel ~l n) {n = (~m) + l} node:(HashmapAugNode m X Y) = HashmapAug n X Y; ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X = HashmapAugNode 0 X Y; ahmn_fork#_ {n:#} {X:Type} {Y:Type} left:^(HashmapAug n X Y) right:^(HashmapAug n X Y) extra:Y = HashmapAugNode (n + 1) X Y; ahme_empty$0 {n:#} {X:Type} {Y:Type} extra:Y = HashmapAugE n X Y; ahme_root$1 {n:#} {X:Type} {Y:Type} root:^(HashmapAug n X Y) extra:Y = HashmapAugE n X Y;`,
    MsgAddress: `${TLBStd.Maybe}addr_none$00 = MsgAddressExt; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt; anycast_info$_ depth:(#<= 30) { depth >= 1 } rewrite_pfx:(bits depth) = Anycast; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt; addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt; _ _:MsgAddressInt = MsgAddress; _ _:MsgAddressExt = MsgAddress;`,
};
// language=tlb
export const TLBTVMReflection = `${TLBStd.Maybe}${TLBLib.HashmapE}vm_stk_null#00 = VmStackValue; vm_stk_tinyint#01 value:int64 = VmStackValue; vm_stk_int#0201_ value:int257 = VmStackValue; vm_stk_nan#02ff = VmStackValue; vm_stk_cell#03 cell:^Cell = VmStackValue; _ cell:^Cell st_bits:(## 10) end_bits:(## 10) { st_bits <= end_bits } st_ref:(#<= 4) end_ref:(#<= 4) { st_ref <= end_ref } = VmCellSlice; vm_stk_slice#04 _:VmCellSlice = VmStackValue; vm_stk_builder#05 cell:^Cell = VmStackValue; vm_stk_cont#06 cont:VmCont = VmStackValue; vm_tupref_nil$_ = VmTupleRef 0; vm_tupref_single$_ entry:^VmStackValue = VmTupleRef 1; vm_tupref_any$_ {n:#} ref:^(VmTuple (n + 2)) = VmTupleRef (n + 2); vm_tuple_nil$_ = VmTuple 0; vm_tuple_tcons$_ {n:#} head:(VmTupleRef n) tail:^VmStackValue = VmTuple (n + 1); vm_stk_tuple#07 len:(## 16) data:(VmTuple len) = VmStackValue; vm_stack#_ depth:(## 24) stack:(VmStackList depth) = VmStack; vm_stk_cons#_ {n:#} rest:^(VmStackList n) tos:VmStackValue = VmStackList (n + 1); vm_stk_nil#_ = VmStackList 0; _ cregs:(HashmapE 4 VmStackValue) = VmSaveList; gas_limits#_ remaining:int64 _:^[ max_limit:int64 cur_limit:int64 credit:int64 ] = VmGasLimits; _ libraries:(HashmapE 256 ^Cell) = VmLibraries; vm_ctl_data$_ nargs:(Maybe uint13) stack:(Maybe VmStack) save:VmSaveList cp:(Maybe int16) = VmControlData; vmc_std$00 cdata:VmControlData code:VmCellSlice = VmCont; vmc_envelope$01 cdata:VmControlData next:^VmCont = VmCont; vmc_quit$1000 exit_code:int32 = VmCont; vmc_quit_exc$1001 = VmCont; vmc_repeat$10100 count:uint63 body:^VmCont after:^VmCont = VmCont; vmc_until$110000 body:^VmCont after:^VmCont = VmCont; vmc_again$110001 body:^VmCont = VmCont; vmc_while_cond$110010 cond:^VmCont body:^VmCont after:^VmCont = VmCont; vmc_while_body$110011 cond:^VmCont body:^VmCont after:^VmCont = VmCont; vmc_pushint$1111 value:int32 next:^VmCont = VmCont;`;

export const groupCorpus: TLBCorpus = {
    'Built-in types': [
        ['_ x:# = OneNatParam;', [[{ kind: 'OneNatParam', x: 42 }, 'te6cckEBAQEABgAACAAAACoFpvBE']]],
        [
            '_ x:# y:# = TowNatParam;',
            [
                [
                    {
                        kind: 'TowNatParam',
                        x: 827,
                        y: 387,
                    },
                    'te6cckEBAQEACgAAEAAAAzsAAAGDtn3/EA==',
                ],
            ],
        ],
        [
            '_ x:^Cell = ParamCell; _ x:^ParamCell = UseParamCell;',
            [
                [
                    {
                        kind: 'ParamCell',
                        x: Cell.fromBase64('te6cckEBAQEAAgAAAEysuc0='),
                    },
                    'te6cckEBAgEABQABAAEAAG4cXEQ=',
                ],
                [
                    {
                        kind: 'UseParamCell',
                        x: {
                            kind: 'ParamCell',
                            x: Cell.fromBase64('te6cckEBAQEAAgAAAEysuc0='),
                        },
                    },
                    'te6cckEBAwEACAABAAEBAAIAAC+21bY=',
                ],
            ],
        ],
        [
            'a$0 x:# y:# = MultiConstructor; b$1 x:# = MultiConstructor;',
            [
                [
                    {
                        kind: 'MultiConstructor_a',
                        x: 1,
                        y: 2,
                    },
                    'te6cckEBAQEACwAAEQAAAACAAAABQGpqBMI=',
                ],
                [
                    {
                        kind: 'MultiConstructor_b',
                        x: 3,
                    },
                    'te6cckEBAQEABwAACYAAAAHAAXGRBw==',
                ],
            ],
        ],
        [
            '_ x:(## 5) = LimitNat; _ x:LimitNat y:# = UseLimitNat;',
            [
                [
                    {
                        kind: 'LimitNat',
                        x: 10,
                    },
                    'te6cckEBAQEAAwAAAVSGgoTj',
                ],
                [
                    {
                        kind: 'UseLimitNat',
                        x: {
                            kind: 'LimitNat',
                            x: 10,
                        },
                        y: 5,
                    },
                    'te6cckEBAQEABwAACVAAAAAsnVCRbA==',
                ],
            ],
        ],
        [
            '_ {n:#} x:(## n) = ParamType n; _ x:(ParamType 4) = UseParamType;',
            [
                [
                    {
                        kind: 'ParamType',
                        n: 4,
                        x: 10,
                    },
                    'te6cckEBAQEAAwAAAagjIqld',
                ],
                [
                    {
                        kind: 'UseParamType',
                        x: {
                            kind: 'ParamType',
                            n: 4,
                            x: 10,
                        },
                    },
                    'te6cckEBAQEAAwAAAagjIqld',
                ],
            ],
        ],
        [
            '_ {n:#} x:(## n) = ExprType (2 + n); _ x:(ExprType 6) = UseExprType; _ x:^UseExprType = CellUseExprType;',
            [
                [
                    {
                        kind: 'UseExprType',
                        x: {
                            kind: 'ExprType',
                            n: 4,
                            x: 10n,
                        },
                    },
                    'te6cckEBAQEAAwAAAagjIqld',
                ],
                [
                    {
                        kind: 'CellUseExprType',
                        x: {
                            kind: 'UseExprType',
                            x: {
                                kind: 'ExprType',
                                n: 4,
                                x: 10n,
                            },
                        },
                    },
                    'te6cckEBAgEABgABAAEAAah/0fN/',
                ],
            ],
        ],
        [
            '_ x:(#< 4) y:(#<= 4) = LessThan;',
            [
                [
                    {
                        kind: 'LessThan',
                        x: 3,
                        y: 7,
                    },
                    'te6cckEBAQEAAwAAAfzvbxbL',
                ],
            ],
        ],
        [
            'a$0 {n:#} = ParamConstructor n; b$1 {n:#} = Constructor (n + 1);',
            [
                [
                    {
                        kind: 'ParamConstructor_a',
                        n: 3,
                    },
                    'te6cckEBAQEAAwAAAUD20kA0',
                ],
                [
                    {
                        kind: 'ParamConstructor_b',
                        n: 3,
                    },
                    'te6cckEBAQEAAwAAAUD20kA0',
                ],
            ],
        ],
        [
            '_ (## 1) = AnonymousData;',
            [
                [
                    {
                        kind: 'AnonymousData',
                        anon0: 1,
                    },
                    'te6cckEBAQEAAwAAAcCO6ba2',
                ],
            ],
        ],
        [
            '_ value:int257 = IntType; _ value:uint257 = UintType;',
            [
                [
                    {
                        kind: 'IntType',
                        value: -1n,
                    },
                    'te6cckEBAQEAIwAAQf//////////////////////////////////////////wCAigoQ=',
                ],
                [
                    {
                        kind: 'UintType',
                        value: 2n,
                    },
                    'te6cckEBAQEAIwAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQGTLvI4=',
                ],
            ],
        ],
        [
            '_ const:# = CheckKeyword;',
            [
                [
                    {
                        kind: 'CheckKeyword',
                        const0: 3,
                    },
                    'te6cckEBAQEABgAACAAAAAMX8/8c',
                ],
            ],
        ],
    ],
    'Based on block.tlb': [
        [
            TLBStd.Unit,
            [
                [
                    {
                        kind: 'Unit',
                    },
                    'te6cckEBAQEAAgAAAEysuc0=',
                ],
            ],
        ],
        [
            `${TLBStd.Bool} _ a:Bool = BoolUser;`,
            [
                [{ kind: 'BoolUser', a: { kind: 'Bool', value: true } }, 'te6cckEBAQEAAwAAAcCO6ba2'],
                [{ kind: 'BoolUser', a: { kind: 'Bool', value: false } }, 'te6cckEBAQEAAwAAAUD20kA0'],
            ],
        ],
        [
            `${TLBStd.Maybe} _ x:Nat2 y:# = A; _ x:(## 2) = Nat2; _ x:(Maybe A) = OptionType;`,
            [
                [
                    {
                        kind: 'OptionType',
                        x: {
                            kind: 'Maybe_just',
                            value: {
                                kind: 'A',
                                x: {
                                    kind: 'Nat2',
                                    x: 3,
                                },
                                y: 4,
                            },
                        },
                    },
                    'te6cckEBAQEABwAACeAAAACQXOzvaQ==',
                ],
                [
                    {
                        kind: 'OptionType',
                        x: {
                            kind: 'Maybe_nothing',
                        },
                    },
                    'te6cckEBAQEAAwAAAUD20kA0',
                ],
            ],
        ],
        [
            `${TLBStd.Maybe} ${TLBLib.HashmapE} _ x:(## 2) = Nat2; _ x:(Maybe Nat2) = OptionType; _ x:(HashmapE 100 ^OptionType) = HashmapOptionType;`,
            [
                [
                    {
                        kind: 'HashmapOptionType',
                        x: Dictionary.empty(Dictionary.Keys.BigUint(100))
                            .set(3n, {
                                kind: 'OptionType',
                                x: {
                                    kind: 'Maybe_just',
                                    value: {
                                        kind: 'Nat2',
                                        x: 3,
                                    },
                                },
                            })
                            .set(5n, {
                                kind: 'OptionType',
                                x: {
                                    kind: 'Maybe_just',
                                    value: {
                                        kind: 'Nat2',
                                        x: 1,
                                    },
                                },
                            }),
                    },
                    'te6cckEBBgEAGAABAcABAgPYYAIEAQH0AwAB8AEBZgUAAbCFr30M',
                ],
            ],
        ],
        [
            `${TLBLib.HashmapE} a$_ {n:#} x:(HashmapE n uint5) = HashmapVarKey n; a$_ x:(HashmapVarKey 5) = HashmapVarKeyUser;`,
            [
                [
                    {
                        kind: 'HashmapVarKeyUser',
                        x: {
                            kind: 'HashmapVarKey',
                            n: 5,
                            x: Dictionary.empty(Dictionary.Keys.BigUint(7)).set(3n, 6).set(7n, 9),
                        },
                    },
                    'te6cckEBBAEAEQABAcABAgFiAgMAA/GgAAPyYCraEmE=',
                ],
            ],
        ],
        [
            `${TLBLib.HashmapE} a$_ {n:#} x:(HashmapE (n+2) uint5) = HashmapExprKey n; a$_ x:(HashmapExprKey 5) = HashmapExprKeyUser;`,
            [
                [
                    {
                        kind: 'HashmapExprKeyUser',
                        x: {
                            kind: 'HashmapExprKey',
                            n: 5,
                            x: Dictionary.empty(Dictionary.Keys.BigUint(7)).set(3n, 6).set(7n, 9),
                        },
                    },
                    'te6cckEBBAEAEQABAcABAgHSAgMAA/GgAAPyYDsb/mA=',
                ],
            ],
        ],
        [
            `${TLBLib.HashmapE} a$_ {A:Type} t:# x:A = OneComb A; a$_ {A: Type} x:(HashmapE 200 (OneComb A)) = HashmapOneComb A; a$_ x:(HashmapOneComb uint5) = HashmapOneCombUser;`,
            [
                [
                    {
                        kind: 'HashmapOneCombUser',
                        x: {
                            kind: 'HashmapOneComb',
                            x: Dictionary.empty(Dictionary.Keys.BigUint(200))
                                .set(1n, { kind: 'OneComb', t: 3, x: 6 })
                                .set(19n, { kind: 'OneComb', t: 5, x: 4 }),
                        },
                    },
                    'te6cckEBBAEAGgABAcABAgPYcAIDAAuggAAAAZoAC6GAAAACkg7BvZ4=',
                ],
            ],
        ],
        [
            `${TLBLib.Grams} ${TLBLib.HashmapAugE} fip$_ y:(## 5) = FixedIntParam; _$_ x:(HashmapAugE 16 Grams FixedIntParam) = HashmapAugEUser;`,
            [
                [
                    {
                        kind: 'HashmapAugEUser',
                        x: Dictionary.empty(Dictionary.Keys.Uint(16))
                            .set(5, { extra: { kind: 'FixedIntParam', y: 11 }, value: 8n })
                            .set(6, { extra: { kind: 'FixedIntParam', y: 9 }, value: 3n }),
                    },
                    'te6cckEBBAEAFQABAcABAgWcAAwCAwAFVYhEAAVEiBywOuD7',
                ],
            ],
        ],
        [
            `${TLBLib.MsgAddress} _ x:MsgAddress = AnyAddressUser;`,
            [
                [
                    {
                        kind: 'AnyAddressUser',
                        x: Address.parse('EQBmzW4wYlFW0tiBgj5sP1CgSlLdYs-VpjPWM7oPYPYWQEdT'),
                    },
                    'te6cckEBAQEAJAAAQ4AM2a3GDEoq2lsQMEfNh+oUCUpbrFnytMZ6xndB7B7CyBAaUUB7',
                ],
                [
                    {
                        kind: 'AnyAddressUser',
                        x: new ExternalAddress(5623048054n, 48),
                    },
                    'te6cckEBAQEACgAAD0YAACnlHO7QzBYE+A==',
                ],
                [
                    {
                        kind: 'AnyAddressUser',
                        x: null,
                    },
                    'te6cckEBAQEAAwAAASCUQYZV',
                ],
            ],
        ],
        [
            `${TLBStd.Bit} _ x:Bit = BitUser;`,
            [
                [
                    {
                        kind: 'BitUser',
                        x: false,
                    },
                    'te6cckEBAQEAAwAAAUD20kA0',
                ],
                [
                    {
                        kind: 'BitUser',
                        x: true,
                    },
                    'te6cckEBAQEAAwAAAcCO6ba2',
                ],
            ],
        ],
        [
            `${TLBLib.Grams} _ x: Grams = GramsUser;`,
            [
                [
                    {
                        kind: 'GramsUser',
                        x: 100000n,
                    },
                    'te6cckEBAQEABgAABzAYaghQbRik',
                ],
            ],
        ],
        [
            `${TLBLib.MsgAddress} _ x: MsgAddressExt = ExtAddressUser;`,
            [
                [
                    {
                        kind: 'ExtAddressUser',
                        x: new ExternalAddress(5623048054n, 48),
                    },
                    'te6cckEBAQEACgAAD0YAACnlHO7QzBYE+A==',
                ],
            ],
        ],
        [
            `${TLBLib.MsgAddress} _ x: MsgAddressExt = ExtAddressUser;`,
            [
                [
                    {
                        kind: 'ExtAddressUser',
                        x: null,
                    },
                    'te6cckEBAQEAAwAAASCUQYZV',
                ],
            ],
        ],
        [
            `${TLBStd.VarInteger} ${TLBStd.VarUInteger} _ v:(VarUInteger 5) = VarUIntegerUser; _ v:(VarInteger 5) = VarIntegerUser;`,
            [
                [
                    {
                        kind: 'VarUIntegerUser',
                        v: 5n,
                    },
                    'te6cckEBAQEABAAAAyCwcWIpfA==',
                ],
                [
                    {
                        kind: 'VarIntegerUser',
                        v: -6n,
                    },
                    'te6cckEBAQEABAAAAw/U84+HQg==',
                ],
            ],
        ],
        [
            `${TLBLib.HashmapE} _ x:(HashmapE 8 uint16) = HashmapEUser;`,
            [
                [
                    {
                        kind: 'HashmapEUser',
                        x: Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(16)),
                    },
                    'te6cckEBAQEAAwAAAUD20kA0',
                ],
                [
                    {
                        kind: 'HashmapEUser',
                        x: Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(16))
                            .set(0, 5)
                            .set(1, 6)
                            .set(2, 7),
                    },
                    'te6cckEBBgEAHQABAcABAgHNAgUCASADBAAFAAFgAAUAAaAABUAAePIZIlc=',
                ],
            ],
        ],
        [
            `${TLBLib.HashmapE} ${TLBStd.VarUInteger} _ v:(VarUInteger 5) = VarUIntegerUser; _ x:(HashmapE 100 VarUIntegerUser) = HashmapVUIUser;`,
            [
                [
                    {
                        kind: 'HashmapVUIUser',
                        x: Dictionary.empty(Dictionary.Keys.BigUint(100))
                            .set(6n, { kind: 'VarUIntegerUser', v: 5n })
                            .set(7n, { kind: 'VarUIntegerUser', v: 3n }),
                    },
                    'te6cckEBBAEAHgABAcABAhuxgAAAAAAAAAAAAAAAOAIDAAMILAADCBzxMIhV',
                ],
            ],
        ],
        [
            `${TLBTVMReflection} _ t:VmStack = VMStackUser;`,
            [
                [
                    {
                        kind: 'VMStackUser',
                        t: [
                            {
                                type: 'int',
                                value: '1',
                            },
                            {
                                type: 'int',
                                value: '2',
                            },
                            {
                                type: 'int',
                                value: '3',
                            },
                        ],
                    },
                    'te6cckEBBAEAKQABGAAAAwEAAAAAAAAAAwEBEgEAAAAAAAAAAgIBEgEAAAAAAAAAAQMAAP/hQqE=',
                ],
            ],
        ],
    ],
    'Combinator types': [
        [
            '_ {A:Type} t:# x:A = OneComb A; _ y:(OneComb(OneComb(OneComb int3))) = ManyComb;',
            [
                [
                    {
                        kind: 'ManyComb',
                        y: { kind: 'OneComb', t: 5, x: { kind: 'OneComb', t: 6, x: { kind: 'OneComb', t: 7, x: 3 } } },
                    },
                    'te6cckEBAQEADwAAGQAAAAUAAAAGAAAAB3D7IMdl',
                ],
            ],
        ],
        [
            `${TLBStd.Maybe} ${TLBStd.Either} a$_ {A:Type} t:# x:A = OneComb A;a$_ {X:Type} info:int32 init:(Maybe (Either X ^int22)) other:(Either X ^(OneComb X)) body:(Either X ^X) = CombArgCellRef X; a$_ x:(CombArgCellRef int12) = CombArgCellRefUser;`,
            [
                [
                    {
                        kind: 'CombArgCellRefUser',
                        x: {
                            kind: 'CombArgCellRef',
                            body: { kind: 'Either_right', value: 3 },
                            info: 4,
                            other: { kind: 'Either_right', value: { kind: 'OneComb', t: 5, x: 5 } },
                            init: { kind: 'Maybe_just', value: { kind: 'Either_right', value: 4 } },
                        },
                    },
                    'te6cckEBBAEAGwADCQAAAAT4AQIDAAUAABIACwAAAAUAWAADADjo2w1l',
                ],
            ],
        ],
        [
            '_ {x:#} value:(## x) = BitLenArg x; _ {n:#} ref:^(BitLenArg (n + 2)) = MathExprAsCombArg (n + 2);',
            [
                [
                    {
                        kind: 'MathExprAsCombArg',
                        n: 8,
                        ref: { kind: 'BitLenArg', x: 10, value: 1000n },
                    },
                    'te6cckEBAgEABwABAAEAA/ogWcXyAQ==',
                ],
            ],
        ],
        [
            `${TLBStd.Maybe} a$_ msg:^(Maybe Any) = RefCombinatorAny;`,
            [
                [
                    {
                        kind: 'RefCombinatorAny',
                        msg: { kind: 'Maybe_just', value: beginCell().storeUint(676, 10).endCell() },
                    },
                    'te6cckEBAgEABwABAAEAA9SQGMa3OA==',
                ],
            ],
        ],
        [
            `${TLBStd.Maybe} a$_ {X:Type} t:# y:(Maybe ^X) = RefCombinatorInRefHelper X;a$_ msg:^(RefCombinatorInRefHelper Any) = RefCombinatorInRef;`,
            [
                [
                    {
                        kind: 'RefCombinatorInRef',
                        msg: {
                            kind: 'RefCombinatorInRefHelper',
                            t: 3,
                            y: { kind: 'Maybe_just', value: beginCell().storeUint(3, 32).endCell() },
                        },
                    },
                    'te6cckEBAwEAEQABAAEBCQAAAAPAAgAIAAAAA01cl/4=',
                ],
            ],
        ],
    ],
    'Naming tag': [
        [
            '_ a:# = MultipleEmptyConstructor 0; _ b:(## 5) = MultipleEmptyConstructor 1; a$_ x:(## 6) = MultipleEmptyConstructor 2;',
            [
                [{ kind: 'MultipleEmptyConstructor__', a: 5 }, 'te6cckEBAQEABgAACAAAAAX/FF46'],
                [{ kind: 'MultipleEmptyConstructor__1', b: 6 }, 'te6cckEBAQEAAwAAATTkEUKC'],
                [{ kind: 'MultipleEmptyConstructor_a', x: 5 }, 'te6cckEBAQEAAwAAARbN78RD'],
            ],
        ],
    ],
    'Complex Expressions': [
        [
            'message#_ len:(## 7) { len <= 127 } text:(bits (len * 8)) = Message;',
            [
                [
                    {
                        kind: 'Message',
                        len: 127,
                        text: 'TON data are DAG-cell bags: <= 1023 bits + 4 refs, then TL-B serialized & SHA-256 hashed with transparent/representation hashes',
                    },
                    'te6cckEBAQEAggAA//6onpxAyMLowkDC5MpAiIKOWsbK2NhAxMLO5nRAeHpAYmBkZkDE0ujmQFZAaEDkyszmWEDo0MrcQKiYWoRA5srk0sLY0vTKyEBMQKaQglpkamxA0MLm0MrIQO7S6NBA6OTC3ObgwuTK3Ohe5Mrg5MrmytzowujS3txA0MLm0MrnylQJ4A==',
                ],
            ],
        ],
        ['a$_ s:(3 * int5) = TupleCheck;', [[{ kind: 'TupleCheck', s: [5, 6, 7] }, 'te6cckEBAQEABAAAAymPK0xvnA==']]],
        [
            '_ a:(## 1) b:a?(## 32) = ConditionalField;',
            [
                [{ kind: 'ConditionalField', a: 1, b: 5 }, 'te6cckEBAQEABwAACYAAAALAmNl2Mw=='],
                [{ kind: 'ConditionalField', a: 0, b: 5 }, 'te6cckEBAQEABwAACQAAAALAxAzUXQ=='],
                [{ kind: 'ConditionalField', a: 0, b: undefined }, 'te6cckEBAQEAAwAAAUD20kA0'],
            ],
        ],
        [
            '_ a:(## 6) b:(a . 2)?(## 32) = BitSelection;',
            [
                [{ kind: 'BitSelection', a: 5, b: 5 }, 'te6cckEBAQEABwAACRQAAAAWCuWE4A=='],
                [{ kind: 'BitSelection', a: 8, b: 5 }, 'te6cckEBAQEABwAACSAAAAAWPo9LlA=='],
            ],
        ],
        [
            'tmpa$_ a:# b:# = Simple;a$_ x:(## 1) y:x?^Simple = ConditionalRef;',
            [
                [
                    { kind: 'ConditionalRef', x: 1, y: { kind: 'Simple', a: 3, b: 4 } },
                    'te6cckEBAgEADgABAcABABAAAAADAAAABDT6GQY=',
                ],
                [{ kind: 'ConditionalRef', x: 0, y: undefined }, 'te6cckEBAQEAAwAAAUD20kA0'],
            ],
        ],
        [
            '_ n:# { 5 + n = 7 } = EqualityExpression;',
            [
                [
                    {
                        kind: 'EqualityExpression',
                        n: 2,
                    },
                    'te6cckEBAQEABgAACAAAAAIUcJTu',
                ],
            ],
        ],
        [
            '_ flags:(## 10) { flags <= 100 } = ImplicitCondition;',
            [
                [
                    {
                        kind: 'ImplicitCondition',
                        flags: 100,
                    },
                    'te6cckEBAQEABAAAAxkgKtd5IA==',
                ],
            ],
        ],
        [
            's$_ a:# b:# = Simple; _$_ x:(## 1) y:x?^Simple = ConditionalRef;',
            [
                [
                    {
                        kind: 'ConditionalRef',
                        x: 1,
                        y: {
                            kind: 'Simple',
                            a: 3,
                            b: 4,
                        },
                    },
                    'te6cckEBAgEADgABAcABABAAAAADAAAABDT6GQY=',
                ],
            ],
        ],
    ],
    'Constructor Tags': [
        [
            '_ y:(## 5) = FixedIntParam;tmpd#_ y:FixedIntParam c:# = SharpConstructor;',
            [
                [
                    { kind: 'SharpConstructor', c: 5, y: { kind: 'FixedIntParam', y: 6 } },
                    'te6cckEBAQEABwAACTAAAAAsZI9oQA==',
                ],
            ],
        ],
        ['_ a:# = EmptyTag;', [[{ kind: 'EmptyTag', a: 3 }, 'te6cckEBAQEABgAACAAAAAMX8/8c']]],
        ['a#f4 x:# = SharpTag;', [[{ kind: 'SharpTag', x: 3 }, 'te6cckEBAQEABwAACvQAAAADBvfMsw==']]],
        ['a$1011 x:# = DollarTag;', [[{ kind: 'DollarTag', x: 3 }, 'te6cckEBAQEABwAACbAAAAA4SAoO+Q==']]],
        [
            '_ a:# b:# = Simple; b$1 Simple = ConstructorOrder; a$0 a:Simple = ConstructorOrder;',
            [
                [
                    { kind: 'ConstructorOrder_a', a: { kind: 'Simple', a: 2, b: 3 } },
                    'te6cckEBAQEACwAAEQAAAAEAAAABwFfvYME=',
                ],
            ],
        ],
        [
            'a a:#  = CheckCrc32;b b:# c:# = CheckCrc32;',
            [
                [{ kind: 'CheckCrc32_a', a: 3 }, 'te6cckEBAQEACgAAEAnZfnoAAAAD3Ll/xg=='],
                [{ kind: 'CheckCrc32_b', b: 4, c: 5 }, 'te6cckEBAQEADgAAGKhCs/AAAAAEAAAABdl92k0='],
            ],
        ],
    ],
    'Advanced types': [
        [
            'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);',
            [
                [
                    {
                        kind: 'Unary_unary_succ',
                        n: 3,
                        x: {
                            kind: 'Unary_unary_succ',
                            n: 1,
                            x: { kind: 'Unary_unary_succ', n: 0, x: { kind: 'Unary_unary_zero' } },
                        },
                    },
                    'te6cckEBAQEAAwAAAeifP9Ic',
                ],
                [
                    {
                        kind: 'Unary_unary_succ',
                        n: 2,
                        x: {
                            kind: 'Unary_unary_succ',
                            n: 1,
                            x: { kind: 'Unary_unary_succ', n: 0, x: { kind: 'Unary_unary_zero' } },
                        },
                    },
                    'te6cckEBAQEAAwAAAeifP9Ic',
                ],
                [
                    {
                        kind: 'Unary_unary_succ',
                        n: 3,
                        x: {
                            kind: 'Unary_unary_succ',
                            n: 2,
                            x: { kind: 'Unary_unary_succ', n: 1, x: { kind: 'Unary_unary_zero' } },
                        },
                    },
                    'te6cckEBAQEAAwAAAeifP9Ic',
                ],
                [{ kind: 'Unary_unary_succ', n: 3, x: { kind: 'Unary_unary_zero' } }, 'te6cckEBAQEAAwAAAaDsenDX'],
            ],
        ],
        [
            'a$_ n:# = ParamConst 1 1; b$01 m:# k:# = ParamConst 2 1; c$01 n:# m:# k:# = ParamConst 3 3; d$_ n:# m:# k:# l:# = ParamConst 4 2;',
            [
                [{ kind: 'ParamConst_d', n: 1, k: 2, l: 3, m: 4 }, 'te6cckEBAQEAEgAAIAAAAAEAAAAEAAAAAgAAAAOkcDvC'],
                [{ kind: 'ParamConst_b', k: 2, m: 4 }, 'te6cckEBAQEACwAAEUAAAAEAAAAAoM/dxmI='],
                [{ kind: 'ParamConst_c', k: 2, m: 4, n: 3 }, 'te6cckEBAQEADwAAGUAAAADAAAABAAAAAKDws/3Z'],
            ],
        ],
        [
            'a$0 = ParamDifNames 2 ~1; b$1 = ParamDifNames 3 ~1; c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1); d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2);',
            [
                [
                    {
                        kind: 'ParamDifNames_c',
                        n: 3,
                        x: {
                            kind: 'ParamDifNames_c',
                            n: 2,
                            x: { kind: 'ParamDifNames_c', n: 1, x: { kind: 'ParamDifNames_a' } },
                        },
                    },
                    'te6cckEBAQEAAwAAAeifP9Ic',
                ],
                [
                    {
                        kind: 'ParamDifNames_d',
                        m: 4,
                        x: {
                            kind: 'ParamDifNames_d',
                            m: 2,
                            x: { kind: 'ParamDifNames_d', m: 1, x: { kind: 'ParamDifNames_b' } },
                        },
                    },
                    'te6cckEBAQEAAwAAARjqULzv',
                ],
            ],
        ],
        [
            'a$0 = ParamDifNames 2 ~1; b$1 = ParamDifNames 3 ~1; c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1); d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2); e$0 {k:#} x:(ParamDifNames 2 ~k) = ParamDifNamesUser;',
            [
                [
                    {
                        kind: 'ParamDifNamesUser',
                        k: 4,
                        x: {
                            kind: 'ParamDifNames_c',
                            n: 3,
                            x: {
                                kind: 'ParamDifNames_c',
                                n: 2,
                                x: { kind: 'ParamDifNames_c', n: 1, x: { kind: 'ParamDifNames_a' } },
                            },
                        },
                    },
                    'te6cckEBAQEAAwAAAXRYDDnD',
                ],
                [
                    {
                        kind: 'ParamDifNamesUser',
                        k: 5,
                        x: {
                            kind: 'ParamDifNames_c',
                            n: 3,
                            x: {
                                kind: 'ParamDifNames_c',
                                n: 2,
                                x: { kind: 'ParamDifNames_c', n: 1, x: { kind: 'ParamDifNames_a' } },
                            },
                        },
                    },
                    'te6cckEBAQEAAwAAAXRYDDnD',
                ],
            ],
        ],
        [
            'b$1 {y:#} t:# z:# { t = (~y) * 2} = NegationFromImplicit ~(y + 1);',
            [[{ kind: 'NegationFromImplicit', t: 4, y: 2, z: 7 }, 'te6cckEBAQEACwAAEYAAAAIAAAADwIgR8XQ=']],
        ],
        [
            'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1); hm_edge#_ {l:#} {m:#} label:(Unary ~l) {7 = (~m) + l} = UnaryUserCheckOrder;',
            [
                [
                    {
                        kind: 'UnaryUserCheckOrder',
                        l: 2,
                        m: 5,
                        label: {
                            kind: 'Unary_unary_succ',
                            n: 1,
                            x: { kind: 'Unary_unary_succ', n: 0, x: { kind: 'Unary_unary_zero' } },
                        },
                    },
                    'te6cckEBAQEAAwAAAdDhLuim',
                ],
            ],
        ],
        [
            'block_info#9bc7a987 seq_no:# { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no } = LoadFromNegationOutsideExpr;',
            [
                [
                    {
                        kind: 'LoadFromNegationOutsideExpr',
                        prev_seq_no: 3,
                        seq_no: 4,
                    },
                    'te6cckEBAQEACgAAEJvHqYcAAAAESLIpEw==',
                ],
            ],
        ],
    ],
    'Slice types': [
        [
            'a$_ {e:#} h:(int (e * 8)) f:(uint (7 * e)) i:(bits (5 + e)) j:(int 5) k:(uint e) tc:Cell = IntBitsParametrized e; a$_ {x:#} a:(IntBitsParametrized x) = IntBitsParametrizedInside x; a$_ x:(IntBitsParametrizedInside 5) = IntBitsParametrizedOutside;',
            [
                [
                    {
                        kind: 'IntBitsParametrizedOutside',
                        x: {
                            kind: 'IntBitsParametrizedInside',
                            a: {
                                kind: 'IntBitsParametrized',
                                e: 6,
                                f: 3n,
                                h: 7n,
                                j: 9,
                                k: 10n,
                                i: beginCell().storeUint(676, 10).endCell().beginParse().loadBits(10),
                                tc: beginCell().storeUint(76, 10).endCell(),
                            },
                            x: 5,
                        },
                    },
                    'te6cckEBAQEAEgAAHwAAAAAABwAAAAAA6kSUJkDl6Lvv',
                ],
                [
                    {
                        kind: 'IntBitsParametrizedOutside',
                        x: {
                            kind: 'IntBitsParametrizedInside',
                            a: {
                                kind: 'IntBitsParametrized',
                                e: 5,
                                f: 3n,
                                h: 7n,
                                j: 9,
                                k: 10n,
                                i: beginCell().storeUint(676, 10).endCell().beginParse().loadBits(10),
                                tc: beginCell().storeUint(76, 10).endCell(),
                            },
                            x: 5,
                        },
                    },
                    'te6cckEBAQEAEAAAGwAAAAAHAAAAAHUiVCZA7F+UPw==',
                ],
            ],
        ],
        [
            'a$_ t:# ^[ q:# ] ^[ a:(## 32) ^[ e:# ] ^[ b:(## 32) d:# ^[ c:(## 32) ] ] ] = CellsSimple;',
            [
                [
                    { kind: 'CellsSimple', a: 5, b: 3, c: 4, d: 100, e: 4, q: 1, t: 3 },
                    'te6cckEBBQEAJwACCAAAAAMBAgAIAAAAAQIIAAAABQQDARAAAAADAAAAZAQACAAAAAQS+uyu',
                ],
            ],
        ],
        [
            'b$_ d:int11 g:bits2 {Arg:Type} arg:Arg x:Any = IntBits Arg; a$_ {x:#} a:(IntBits (int (1 + x))) = IntBitsInside (x * 2); a$_ x:(IntBitsInside 6) = IntBitsOutside;',
            [
                [
                    {
                        kind: 'IntBitsOutside',
                        x: {
                            kind: 'IntBitsInside',
                            a: {
                                kind: 'IntBits',
                                arg: 3n,
                                d: 5,
                                g: beginCell().storeUint(3, 2).endCell().beginParse().loadBits(2),
                                x: beginCell().storeUint(76, 10).endCell(),
                            },
                            x: 3,
                        },
                    },
                    'te6cckEBAQEABgAABwC5iZBxBbIC',
                ],
            ],
        ],
    ],
    'Correct tag calculation': [
        [
            '_#0201_ = LeastSignificantBitRemoved;',
            [[{ kind: 'LeastSignificantBitRemoved' }, 'te6cckEBAQEABAAAAwIBV0CZZA==']],
        ],
        [
            'a a:#  = CheckCrc32;b b:# c:# = CheckCrc32;',
            [
                [{ kind: 'CheckCrc32_a', a: 42 }, 'te6cckEBAQEACgAAEAnZfnoAAAAqzuxwng=='],
                [{ kind: 'CheckCrc32_b', b: 123, c: 456 }, 'te6cckEBAQEADgAAGKhCs/AAAAB7AAAByEY0F+w='],
            ],
        ],
        [
            'tag seq_no:# seq_no_2:# { prev_seq_no:# } { 2 + ~prev_seq_no + 1 = 2 + seq_no + 2 } { prev_seq_no_2:# } { ~prev_seq_no_2 = 100 + seq_no_2 * 8 * 7 } = ComplexCrc32;',
            [
                [
                    {
                        kind: 'ComplexCrc32',
                        prev_seq_no: 2000,
                        prev_seq_no_2: 112100,
                        seq_no: 1999,
                        seq_no_2: 2000,
                    },
                    'te6cckEBAQEADgAAGAxHja4AAAfPAAAH0DgP7jY=',
                ],
            ],
        ],
    ],
};
export const groupCorpusFlat = makeGroupFlat(groupCorpus);
