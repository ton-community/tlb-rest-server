import { Cell, beginCell, BitString } from '@ton/core';

import { ParsedCell } from './TLBRuntime';

export type TLBSchema = string;
export type BoCBase64 = string;
export type TLBCase = [TLBSchema, ParsedCell, BoCBase64];
export type TLBGroup = string;
export type TLBCorpus = { [key: TLBGroup]: TLBCase[] };

// https://github.com/ton-community/tlb-test-corpus/blob/a1ea93ea44971b7cd4d7736da91b240aa988064f/tlb-corpus.ts#L27-L643
export const corpus: TLBCorpus = {
    'Basic types': [
        ['_ data: # = TLB;', { kind: 'TLB', data: 42 }, 'te6cckEBAQEABgAACAAAACoFpvBE'],
        [
            'a#_ v: ^Cell = A;',
            {
                kind: 'A',
                v: Cell.fromBase64('te6cckEBAQEAAgAAAEysuc0='),
            },
            'te6cckEBAgEABQABAAEAAG4cXEQ=',
        ],
        [
            'b$10 v: ^Cell = B;a$01 v: ^B = A;',
            {
                kind: 'A',
                v: {
                    kind: 'B',
                    v: Cell.fromBase64('te6cckEBAQEAAgAAAEysuc0='),
                },
            },
            'te6cckEBAwEACgABAWABAQGgAgAAKUQvWA==',
        ],
        [
            'tmpa$_ a:# b:# = Simple;',
            {
                kind: 'Simple',
                a: 827,
                b: 387,
            },
            'te6cckEBAQEACgAAEAAAAzsAAAGDtn3/EA==',
        ],
        [
            'bool_false$0 a:# b:(## 7) c:# = TwoConstructors;bool_true$1 b:# = TwoConstructors;',
            {
                kind: 'TwoConstructors_bool_false',
                a: 1000,
                b: 10,
                c: 1000,
            },
            'te6cckEBAQEACwAAEgAAAfQKAAAD6FedIMM=',
        ],
        [
            'bool_false$0 a:# b:(## 7) c:# = TwoConstructors;bool_true$1 b:# = TwoConstructors;',
            {
                kind: 'TwoConstructors_bool_true',
                b: 1000,
            },
            'te6cckEBAQEABwAACYAAAfRA0g+UOQ==',
        ],
        [
            'tmpb$_ y:(## 5) = FixedIntParam;tmpc$_ y:FixedIntParam c:# = TypedField;',
            {
                kind: 'TypedField',
                c: 5,
                y: {
                    kind: 'FixedIntParam',
                    y: 10,
                },
            },
            'te6cckEBAQEABwAACVAAAAAsnVCRbA==',
        ],
        [
            'nothing$0 {TheType:Type} = Maybe TheType;just$1 {TheType:Type} value:TheType = Maybe TheType;tmpd#_ y:FixedIntParam c:# = SharpConstructor;tmpb$_ y:(## 5) = FixedIntParam;thejust$_ x:(Maybe SharpConstructor) = TypedParam;',
            {
                kind: 'TypedParam',
                x: {
                    kind: 'Maybe_just',
                    value: {
                        kind: 'SharpConstructor',
                        c: 5,
                        y: {
                            kind: 'FixedIntParam',
                            y: 6,
                        },
                    },
                },
            },
            'te6cckEBAQEABwAACZgAAAAWd4UEqw==',
        ],
        [
            'nothing$0 {X:Type} = Maybe X;just$1 {X:Type} value:X = Maybe X;tmpb$_ y:(## 5) = FixedIntParam;tmpd#_ y:FixedIntParam c:# = SharpConstructor;thejust$_ x:(Maybe SharpConstructor) = TypedParam;',
            {
                kind: 'TypedParam',
                x: {
                    kind: 'Maybe_nothing',
                },
            },
            'te6cckEBAQEAAwAAAUD20kA0',
        ],
        [
            'a$_ {x:#} value:(## x) = BitLenArg x; a$_ t:(BitLenArg 4) = BitLenArgUser;',
            {
                kind: 'BitLenArgUser',
                t: {
                    kind: 'BitLenArg',
                    x: 4,
                    value: 10n,
                },
            },
            'te6cckEBAQEAAwAAAagjIqld',
        ],
        [
            'a$_ {x:#} value:(## x) = BitLenArg x;a$_ t:(BitLenArg 4) = BitLenArgUser;',
            {
                kind: 'BitLenArgUser',
                t: {
                    kind: 'BitLenArg',
                    x: 4,
                    value: '10',
                },
            },
            'te6cckEBAQEAAwAAAagjIqld',
        ],
        [
            'a$_ {x:#} value:(## x) = ExprArg (2 + x);a$_ t:(ExprArg 6) = ExprArgUser;',
            {
                kind: 'ExprArgUser',
                t: {
                    kind: 'ExprArg',
                    x: 4,
                    value: '10',
                },
            },
            'te6cckEBAQEAAwAAAagjIqld',
        ],
        [
            'a$_ {x:#} value:(## x) = ExprArg (2 + x);a$_ t:(ExprArg 6) = ExprArgUser;a$_ a:^ExprArgUser = CellTypedField;',
            {
                kind: 'CellTypedField',
                a: {
                    kind: 'ExprArgUser',
                    t: {
                        kind: 'ExprArg',
                        x: 4,
                        value: '10',
                    },
                },
            },
            'te6cckEBAgEABgABAAEAAah/0fN/',
        ],
        [
            'a$_ x:(#< 4) y:(#<= 4) = LessThan;',
            {
                kind: 'LessThan',
                x: 3,
                y: 7,
            },
            'te6cckEBAQEAAwAAAfzvbxbL',
        ],
        [
            'a$0 {n:#} = ParamNamedArgInSecondConstr n;b$1 {n:#} = ParamNamedArgInSecondConstr (n + 1);',
            {
                kind: 'ParamNamedArgInSecondConstr_a',
                n: 3,
            },
            'te6cckEBAQEAAwAAAUD20kA0',
        ],
        [
            'bit$_ (## 1) anon0:# = AnonymousData;',
            {
                kind: 'AnonymousData',
                anon0: 1,
                anon0_0: 3,
            },
            'te6cckEBAQEABwAACYAAAAHAAXGRBw==',
        ],
        [
            'vm_stk_int#0201_ value:int257 = FalseAnonField;',
            {
                kind: 'FalseAnonField',
                value: '3',
            },
            'te6cckEBAQEAJAAARAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN1g94p',
        ],
        [
            'a$_ const:# = CheckKeyword;',
            {
                kind: 'CheckKeyword',
                const0: 3,
            },
            'te6cckEBAQEABgAACAAAAAMX8/8c',
        ],
        [
            'a$_ {x:#} value:(## x) = ExprArg (2 + x);a$_ t:(ExprArg 6) = ExprArgUser;a$_ a:ExprArgUser = ComplexTypedField;',
            {
                kind: 'ComplexTypedField',
                a: {
                    kind: 'ExprArgUser',
                    t: {
                        kind: 'ExprArg',
                        x: 4,
                        value: '10',
                    },
                },
            },
            'te6cckEBAQEAAwAAAagjIqld',
        ],
        [
            'a$_ {x:#} value:(## x) = BitLenArg x;',
            {
                kind: 'BitLenArg',
                x: 100,
                value: '2709958555228628813',
            },
            'te6cckEBAQEADwAAGQAAAAACWbtPKwbudNih0Rtj',
        ],
    ],
    'Primitive types': [
        [
            'bool_false$0 = Bool;bool_true$1 = Bool;_ a:Bool = BoolUser;',
            { kind: 'BoolUser', a: { kind: 'Bool', value: true } },
            'te6cckEBAQEAAwAAAcCO6ba2',
        ],
        [
            'bool_false$0 = Bool;bool_true$1 = Bool;_ a:Bool = BoolUser;',
            { kind: 'BoolUser', a: { kind: 'Bool', value: false } },
            'te6cckEBAQEAAwAAAUD20kA0',
        ],
    ],
    'Combinator types': [
        [
            'a$_ {A:Type} t:# x:A = OneComb A;a$_ y:(OneComb(OneComb(OneComb int3))) = ManyComb;',
            {
                kind: 'ManyComb',
                y: { kind: 'OneComb', t: 5, x: { kind: 'OneComb', t: 6, x: { kind: 'OneComb', t: 7, x: 3 } } },
            },
            'te6cckEBAQEADwAAGQAAAAUAAAAGAAAAB3D7IMdl',
        ],
        [
            'nothing$0 {X:Type} = Maybe X;just$1 {X:Type} value:X = Maybe X;left$0 {X:Type} {Y:Type} value:X = Either X Y;right$1 {X:Type} {Y:Type} value:Y = Either X Y;a$_ {A:Type} t:# x:A = OneComb A;a$_ {X:Type} info:int32 init:(Maybe (Either X ^int22)) other:(Either X ^(OneComb X)) body:(Either X ^X) = CombArgCellRef X; a$_ x:(CombArgCellRef int12) = CombArgCellRefUser;',
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
        [
            'a$_ {x:#} value:(## x) = BitLenArg x;a$_ {n:#} ref:^(BitLenArg (n + 2)) = MathExprAsCombArg (n + 2);',
            {
                kind: 'MathExprAsCombArg',
                n: 8,
                ref: { kind: 'BitLenArg', x: 10, value: 1000n },
            },
            'te6cckEBAgEABwABAAEAA/ogWcXyAQ==',
        ],
        [
            'nothing$0 {X:Type} = Maybe X; just$1 {X:Type} value:X = Maybe X;a$_ msg:^(Maybe Any) = RefCombinatorAny;',
            {
                kind: 'RefCombinatorAny',
                msg: { kind: 'Maybe_just', value: beginCell().storeUint(676, 10).endCell() },
            },
            'te6cckEBAgEABwABAAEAA9SQGMa3OA==',
        ],
        [
            'nothing$0 {X:Type} = Maybe X; just$1 {X:Type} value:X = Maybe X;a$_ {X:Type} t:# y:(Maybe ^X) = RefCombinatorInRefHelper X;a$_ msg:^(RefCombinatorInRefHelper Any) = RefCombinatorInRef;',
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
    'Naming tag': [
        [
            '_ a:# = MultipleEmptyConstructor 0;_ b:(## 5) = MultipleEmptyConstructor 1;a$_ x:(## 6) = MultipleEmptyConstructor 2;',
            { kind: 'MultipleEmptyConstructor__', a: 5 },
            'te6cckEBAQEABgAACAAAAAX/FF46',
        ],
        [
            '_ a:# = MultipleEmptyConstructor 0;_ b:(## 5) = MultipleEmptyConstructor 1;a$_ x:(## 6) = MultipleEmptyConstructor 2;',
            { kind: 'MultipleEmptyConstructor__1', b: 6 },
            'te6cckEBAQEAAwAAATTkEUKC',
        ],
        [
            '_ a:# = MultipleEmptyConstructor 0;_ b:(## 5) = MultipleEmptyConstructor 1;a$_ x:(## 6) = MultipleEmptyConstructor 2;',
            { kind: 'MultipleEmptyConstructor_a', x: 5 },
            'te6cckEBAQEAAwAAARbN78RD',
        ],
    ],
    'Complex Expressions': [
        [
            'message#_ len:(## 7) { len <= 127 } text:(bits (len * 8)) = Message;',
            {
                kind: 'Message',
                len: 127,
                text: new BitString(
                    Buffer.from(
                        'TON data are DAG-cell bags: ≤1023 bits + 4 refs, then TL-B serialized & SHA-256 hashed with transparent/representation hashes',
                        'utf-8',
                    ),
                    0,
                    127 * 8,
                ),
            },
            'te6cckEBAQEAggAA//6onpxAyMLowkDC5MpAiIKOWsbK2NhAxMLO5nRBxRNIYmBkZkDE0ujmQFZAaEDkyszmWEDo0MrcQKiYWoRA5srk0sLY0vTKyEBMQKaQglpkamxA0MLm0MrIQO7S6NBA6OTC3ObgwuTK3Ohe5Mrg5MrmytzowujS3txA0MLm0MrnysqqLg==',
        ],
        ['a$_ s:(3 * int5) = TupleCheck;', { kind: 'TupleCheck', s: [5, 6, 7] }, 'te6cckEBAQEABAAAAymPK0xvnA=='],
        [
            '_ a:(## 1) b:a?(## 32) = ConditionalField;',
            { kind: 'ConditionalField', a: 1, b: 5 },
            'te6cckEBAQEABwAACYAAAALAmNl2Mw==',
        ],
        [
            '_ a:(## 1) b:a?(## 32) = ConditionalField;',
            { kind: 'ConditionalField', a: 0, b: 5 },
            'te6cckEBAQEABwAACQAAAALAxAzUXQ==',
        ],
        [
            '_ a:(## 1) b:a?(## 32) = ConditionalField;',
            { kind: 'ConditionalField', a: 0, b: undefined },
            'te6cckEBAQEAAwAAAUD20kA0',
        ],
        [
            '_ a:(## 6) b:(a . 2)?(## 32) = BitSelection;',
            { kind: 'BitSelection', a: 5, b: 5 },
            'te6cckEBAQEABwAACRQAAAAWCuWE4A==',
        ],
        [
            '_ a:(## 6) b:(a . 2)?(## 32) = BitSelection;',
            { kind: 'BitSelection', a: 8, b: 5 },
            'te6cckEBAQEABwAACSAAAAAWPo9LlA==',
        ],
        [
            'tmpa$_ a:# b:# = Simple;a$_ x:(## 1) y:x?^Simple = ConditionalRef;',
            { kind: 'ConditionalRef', x: 1, y: { kind: 'Simple', a: 3, b: 4 } },
            'te6cckEBAgEADgABAcABABAAAAADAAAABDT6GQY=',
        ],
        [
            'tmpa$_ a:# b:# = Simple;a$_ x:(## 1) y:x?^Simple = ConditionalRef;',
            { kind: 'ConditionalRef', x: 0, y: undefined },
            'te6cckEBAQEAAwAAAUD20kA0',
        ],
    ],
    'Constructor Tags': [
        [
            'tmpb$_ y:(## 5) = FixedIntParam;tmpd#_ y:FixedIntParam c:# = SharpConstructor;',
            { kind: 'SharpConstructor', c: 5, y: { kind: 'FixedIntParam', y: 6 } },
            'te6cckEBAQEABwAACTAAAAAsZI9oQA==',
        ],
        ['_ a:# = EmptyTag;', { kind: 'EmptyTag', a: 3 }, 'te6cckEBAQEABgAACAAAAAMX8/8c'],
        ['a#f4 x:# = SharpTag;', { kind: 'SharpTag', x: 3 }, 'te6cckEBAQEABwAACvQAAAADBvfMsw=='],
        ['a$1011 x:# = DollarTag;', { kind: 'DollarTag', x: 3 }, 'te6cckEBAQEABwAACbAAAAA4SAoO+Q=='],
        [
            'tmpa$_ a:# b:# = Simple;b$1 Simple = ConstructorOrder;a$0 a:Simple = ConstructorOrder;',
            { kind: 'ConstructorOrder_a', a: { kind: 'Simple', a: 2, b: 3 } },
            'te6cckEBAQEACwAAEQAAAAEAAAABwFfvYME=',
        ],
        [
            'a a:#  = CheckCrc32;b b:# c:# = CheckCrc32;',
            { kind: 'CheckCrc32_a', a: 3 },
            'te6cckEBAQEACgAAEAnZfnoAAAAD3Ll/xg==',
        ],
        [
            'a a:#  = CheckCrc32;b b:# c:# = CheckCrc32;',
            { kind: 'CheckCrc32_b', b: 4, c: 5 },
            'te6cckEBAQEADgAAGKhCs/AAAAAEAAAABdl92k0=',
        ],
    ],
    'Advanced types': [
        [
            'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);',
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
            'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);',
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
            'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);',
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
        [
            'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);',
            { kind: 'Unary_unary_succ', n: 3, x: { kind: 'Unary_unary_zero' } },
            'te6cckEBAQEAAwAAAaDsenDX',
        ],
        [
            'a$_ n:# = ParamConst 1 1; b$01 m:# k:# = ParamConst 2 1; c$01 n:# m:# k:# = ParamConst 3 3; d$_ n:# m:# k:# l:# = ParamConst 4 2;',
            { kind: 'ParamConst_d', n: 1, k: 2, l: 3, m: 4 },
            'te6cckEBAQEAEgAAIAAAAAEAAAAEAAAAAgAAAAOkcDvC',
        ],
        [
            'a$_ n:# = ParamConst 1 1; b$01 m:# k:# = ParamConst 2 1; c$01 n:# m:# k:# = ParamConst 3 3; d$_ n:# m:# k:# l:# = ParamConst 4 2;',
            { kind: 'ParamConst_b', k: 2, m: 4 },
            'te6cckEBAQEACwAAEUAAAAEAAAAAoM/dxmI=',
        ],
        [
            'a$_ n:# = ParamConst 1 1; b$01 m:# k:# = ParamConst 2 1; c$01 n:# m:# k:# = ParamConst 3 3; d$_ n:# m:# k:# l:# = ParamConst 4 2;',
            { kind: 'ParamConst_c', k: 2, m: 4, n: 3 },
            'te6cckEBAQEADwAAGUAAAADAAAABAAAAAKDws/3Z',
        ],
        [
            'a$0 = ParamDifNames 2 ~1; b$1 = ParamDifNames 3 ~1; c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1); d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2);',
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
            'a$0 = ParamDifNames 2 ~1; b$1 = ParamDifNames 3 ~1; c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1); d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2);',
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
        [
            'a$0 = ParamDifNames 2 ~1; b$1 = ParamDifNames 3 ~1; c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1); d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2); e$0 {k:#} x:(ParamDifNames 2 ~k) = ParamDifNamesUser;',
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
            'a$0 = ParamDifNames 2 ~1; b$1 = ParamDifNames 3 ~1; c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1); d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2); e$0 {k:#} x:(ParamDifNames 2 ~k) = ParamDifNamesUser;',
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
        [
            'b$1 {y:#} t:# z:# { t = (~y) * 2} = NegationFromImplicit ~(y + 1);',
            { kind: 'NegationFromImplicit', t: 4, y: 2, z: 7 },
            'te6cckEBAQEACwAAEYAAAAIAAAADwIgR8XQ=',
        ],
        [
            'unary_zero$0 = Unary ~0; unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1); hm_edge#_ {l:#} {m:#} label:(Unary ~l) {7 = (~m) + l} = UnaryUserCheckOrder;',
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
        [
            'block_info#9bc7a987 seq_no:# { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no } = LoadFromNegationOutsideExpr;',
            {
                kind: 'LoadFromNegationOutsideExpr',
                prev_seq_no: 3,
                seq_no: 4,
            },
            'te6cckEBAQEACgAAEJvHqYcAAAAESLIpEw==',
        ],
    ],
    Slices: [
        [
            'a$_ {e:#} h:(int (e * 8)) f:(uint (7 * e)) i:(bits (5 + e)) j:(int 5) k:(uint e) tc:Cell = IntBitsParametrized e; a$_ {x:#} a:(IntBitsParametrized x) = IntBitsParametrizedInside x; a$_ x:(IntBitsParametrizedInside 5) = IntBitsParametrizedOutside;',
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
            'a$_ {e:#} h:(int (e * 8)) f:(uint (7 * e)) i:(bits (5 + e)) j:(int 5) k:(uint e) tc:Cell = IntBitsParametrized e; a$_ {x:#} a:(IntBitsParametrized x) = IntBitsParametrizedInside x; a$_ x:(IntBitsParametrizedInside 5) = IntBitsParametrizedOutside;',
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
        [
            'a$_ t:# ^[ q:# ] ^[ a:(## 32) ^[ e:# ] ^[ b:(## 32) d:# ^[ c:(## 32) ] ] ] = CellsSimple;',
            { kind: 'CellsSimple', a: 5, b: 3, c: 4, d: 100, e: 4, q: 1, t: 3 },
            'te6cckEBBQEAJwACCAAAAAMBAgAIAAAAAQIIAAAABQQDARAAAAADAAAAZAQACAAAAAQS+uyu',
        ],
        [
            'b$_ d:int11 g:bits2 {Arg:Type} arg:Arg x:Any = IntBits Arg; a$_ {x:#} a:(IntBits (int (1 + x))) = IntBitsInside (x * 2); a$_ x:(IntBitsInside 6) = IntBitsOutside;',
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
    'Trailing underscore tags': [
        [
            'vm_stk_int#0201_ value:int257 = VmStackValue;',
            { kind: 'VmStackValue_vm_stk_int', value: 12345n },
            'te6cckEBAQEAJAAARAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDl/8JEy',
        ],
    ],
    'Correct tag calculation': [
        [
            'a a:#  = CheckCrc32;b b:# c:# = CheckCrc32;',
            { kind: 'CheckCrc32_a', a: 42 },
            'te6cckEBAQEACgAAEAnZfnoAAAAqzuxwng==',
        ],
        [
            'a a:#  = CheckCrc32;b b:# c:# = CheckCrc32;',
            { kind: 'CheckCrc32_b', b: 123, c: 456 },
            'te6cckEBAQEADgAAGKhCs/AAAAB7AAAByEY0F+w=',
        ],
    ],
    'Correct tag calculation complex': [
        [
            'tag_calculator_example seq_no:# seq_no_2:# { prev_seq_no:# } { 2 + ~prev_seq_no + 1 = 2 + seq_no + 2 } { prev_seq_no_2:# } { ~prev_seq_no_2 = 100 + seq_no_2 * 8 * 7 } = TagCalculatorExample;',
            {
                kind: 'TagCalculatorExample',
                prev_seq_no: 2000,
                prev_seq_no_2: 112100,
                seq_no: 1999,
                seq_no_2: 2000,
            },
            'te6cckEBAQEADgAAGKY/KXcAAAfPAAAH0LluShE=',
        ],
    ],
};
