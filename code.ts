type getUnionFirst<T> = [T] extends [infer T1|infer T2] ?T1 : never;

type A = [1,2]
type temp = A['length']
let a: A = [1,2]
a.push(1)