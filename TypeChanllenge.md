# 元组|Array 类型的特殊接口：length 善加利用

type Length<T extends any[]>=T['length'];

# promiseLike 类型

只能模拟带一个 then 的

# iseuqal 判断类型是否相等：

https://github.com/type-challenges/type-challenges/issues/1568

https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript
这或许需要更加深入学习才能弄明白为什么可 yi

# boolean:

https://github.com/type-challenges/type-challenges/issues/3874
true|false:
It seems boolean in TypeScript is like a union type true | false, so newPush<[1,2,3], boolean> equal to newPush<[1,2,3], true | false>, then:
TypeScript 中的 boolean 似乎就像联合类型 true | false ，因此 newPush<[1,2,3], boolean>等于 newPush<[1,2,3], true | false> ， 然后：

# infer 推导函数参数时候，放后面：

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer type
) => any
  ? [...type]
  : [];
```

# covariance and ...:

https://stackoverflow.com/questions/66410115/difference-between-variance-covariance-contravariance-bivariance-and-invarian
子赋值给父，称之为 协变。
反之，称之为逆变
https://zhuanlan.zhihu.com/p/500762226。
类接口 允许 具体的 复制到抽象的。多到少。叫做协变。
而函数中的参数类型是反其道而行之的。（strictFUncitontypes 打开情况下，否则双变，子可以复制给父父也可以。。。）也就是只支持少的赋值到多的。注意类型之涵意。也就是子函数调用更多，父函数的接口无法保证。反而，夫函数接口调用的少，可以保证子函数的。也就是函数接口要往具体值去赋。

## https://github.com/type-challenges/type-challenges/issues/2

为什么这里 unknown 不行，never 可以。
所有类型都可以 extends unknow,换句话说都是他的儿子，所以是抽象了。
never extends anything,所以 never 更具体

## 不能有两个 map 同时：

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = {
  +readonly [p in keyof T as p extends K ? p : never]: T[p];
} & {
  [p in keyof T as p extends K ? never : p]: T[p];
};
```

# 递归的重要性：

https://github.com/type-challenges/type-challenges/blob/main/questions/00009-medium-deep-readonly/README.md

# type DeepReadonly<T> = T extends Function ? T : { readonly [k in keyof T]: DeepReadonly<T[k]> }

传入的类型无论如何 都是 Object，都是形如{} keyof 都能获取值，除了()=>{}这种函数,keyof 是 never.

# 边界情况：直接映射获得与使用诸如exclude omit的进行修改后的会不同：
```md
/*
  8 - Readonly 2
  -------
  by Anthony Fu (@antfu) #medium #readonly #object-keys

  ### Question

  Implement a generic `MyReadonly2<T, K>` which takes two type argument `T` and `K`.

  `K` specify the set of properties of `T` that should set to Readonly. When `K` is not provided, it should make all properties readonly just like the normal `Readonly<T>`.

  For example

  ```ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
  }

  todo.title = "Hello" // Error: cannot reassign a readonly property
  todo.description = "barFoo" // Error: cannot reassign a readonly property
  todo.completed = true // OK
type MyReadonly2<T, K  extends keyof T = keyof T> = {
  readonly[p in K]:T[p]
} & {
  [p in (Exclude<keyof T,K>)]:T[p]
}
type MyReadonly3<T, K  extends keyof T = keyof T> = {
  readonly[p in K]:T[p]
} & {
  [p in keyof T as p extends K ? never:p]:T[p]
}

import type { Alike, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
  Expect<Alike<MyReadonly2<Todo1, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'description' >, Expected>>,
]

// @ts-expect-error
type error = MyReadonly2<Todo1, 'title' | 'invalid'>
type temp = MyReadonly2<Todo2,"description">
type temp2 = MyReadonly3<Todo2,"description">
type temp3 = Exclude<keyof Todo2,"description">
interface Todo1 {
  title: string
  description?: string
  completed: boolean
}

interface Todo2 {
  readonly title: string
  description?: string
  completed: boolean
}

interface Expected {
  readonly title: string
  readonly description?: string
  completed: boolean
}


```
# 重要边界情况：对于union使用keyof:
发现的大概行为是：分布式使用keyof 然后取并集
```ts
type o1={
    name:string,
    age:number,
}
type o2={
    age:number,
}
type shaobi = o1|o2
type nima = keyof shaobi
```

# 好题：

知识点1：https://github.com/type-challenges/type-challenges/blob/main/questions/00012-medium-chainable-options/README.md
```ts
type Chainable<T = {}> = {
    option: <K extends string, V>(key: K extends keyof T ?
      V extends T[K] ? never : K
      : K, value: V) => Chainable<Omit<T, K> & Record<K, V>>
    get: () => T
  }
```
这里如果没有K extends string 默认推导成 string 而不是literal
知识点2：要进行参数的循环沿验证：可以在key上进行一次，避免循环验证，赋值给never
# 区别：元组 和literal 数组：
```ts
type a1 = [1,2,3]
type a2 = readonly [1,2,3]
let b1: a1 = [1,2,3]
let b2: a2 = [1,2,3]
b1.push(2) 可以，只是限制了类型到1 2 3
b2.push(2) youcant
```
# 好题：https://github.com/type-challenges/type-challenges/blob/main/questions/00020-medium-promise-all/README.md
内展T 保证 每个位置都能分配到

# 分布式条件陷阱：

https://github.com/type-challenges/type-challenges/blob/main/questions/00062-medium-type-lookup/README.md
only T extends 这个时候才会触发

# 文字template 也可以infer

# 判断是是Union:
利用[]不会被拓展的特性
```ts
type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : never;

// 测试用例
type Test1 = IsUnion<string>; // false
type Test2 = IsUnion<string | number>; // true
type Test3 = IsUnion<string | number | boolean>; // true
type Test4 = IsUnion<never>; // false

```
# check never:
```ts
type IsNever<T> = [T] extends [never] ? true : false;
```
加括号的原因是，never的实现是一个空的union 因此如果没有[]触发分布式就会是never。
https://juejin.cn/post/7165170011282079751#heading-14
#
https://github.com/type-challenges/type-challenges/issues/614

# 判断一个object是否是空
extends this
{
  [index:string] : never
}
不允许又任何键值

# 好题：
https://github.com/type-challenges/type-challenges/blob/main/questions/02257-medium-minusone/README.md
```ts
type ReverseString<T extends string> = T extends `${infer first extends string}${infer R extends string}` ? `${ReverseString<R>}${first}`:""
type minus1<T extends string>= T extends `${infer lastnum extends number}${infer R}`? 
                                                                    lastnum extends 0? `9${minus1<R>}`:`${[9,0,1,2,3,4,5,6,7,8][lastnum]}${R}`:never
type RemoveZero<T extends string> = T extends `0${infer R}` ? RemoveZero<R>:T                                                                

type MinusOne<T extends number> = RemoveZero<ReverseString<minus1<ReverseString<`${T}`>>>> extends `${infer R extends number}` ?R:0
type test = MinusOne<1>
type minus = RemoveZero<ReverseString<minus1<ReverseString<`1`>>>>
```
要点：infer extends 限制推导 同上面的generic Function有异曲同工之妙  
思考点：  
如何操作整数？ 先转string  template literal  
思考点2：
如何操作退位操作？使用了一个整数array。

