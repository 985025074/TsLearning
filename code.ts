type getUnionFirst<T> = [T] extends [infer T1|infer T2] ?T1 : never;

type A = getUnionFirst<1| 2>; // expected to be 1