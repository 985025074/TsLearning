# 20 点 55 分 2025 年 2 月 5 日

# 练习：

https://github.com/type-challenges/type-challenges?tab=readme-ov-file
以下内容来自 handbook 部分，后面或许会添加其他教程的注解

# 静态检查系统

注意 ts 会捕获 js 不会报错的错误，例如访问 undefined 形状。

# 配置：

```shell
npm install -g typescript
```

转义器 tsc.
**注意，tsc 默认不会阻止报错之后的转义（为了 user），可配置选项--noEmitOnError**

# 类型注释的基本形式：

```ts
let person: string = "123";
```

**注意 tsc 默认转义到 es5 tsc --target es2015 hello.ts 转移到更新的版本**

# 一些配置选项 推荐开启的

```
noImplicitAny --any推导出错
strictNullChecks -- strictNullChecks 检查null
```

# string!=string

```ts
let string: string = "Hello, world!";
let string1: String = "123";
```

注意这里 String 是 ts 的内置 interface.

# 数组类型:

```ts
origin[]
```

# any 类型：

就是 js 的原始类型，默认就是 any 除非你禁止。

# 函数类型的注解：

```ts
function name(parameter: Type): Ret;
```

## 异步函数：

返回类型需要使用内置接口 promise<sth> 来包含

```ts
function testPromise() {
  const promise = new Promise((resolve, reject) => {
    resolve("success");
  })
    .then((result) => {
      console.log(result);
    })

    .then((para) => {
      console.log(para);
    });
}
testPromise();
```

### 题外话，奇怪的 bug：

同时打开 ts + 转移后的 js 竟然显示函数重复？ 以后要了解一下 tsconifg.json 的配置
TODO:查看 tsconfig + vite 的配置方法。

# 可选类型.

注意 ts 自带一定程度的自动推导，即使我们没有指明类型也是会自动推到的。比如匿名函数。
可选类型表示

```ts
function (type?:type)

```

# Union 类型：

```ts
number | bool | string;
```

## 使用之前要推断

对于可选 以及 Union 类型，使用之前必须经过

```ts
if(typeof sth ==="string")
```

的筛选，否则会出错

# 类型别名：

强调一下别名。不是新的类型，真的就只是别名

```ts
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Create a sanitized input
let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
userInput = "new input";
```

# 非常像的一个：interface

区别见
https://www.typescriptlang.org/docs/handbook/2/everyday-types.html  
比较重要的几点：

- interface 使用 extends 扩展，以及部分扩展（貌似效率更高？），type 使用交集
- interface 不支持 纯 primitive 的 “别名”，只支持对象
- 推荐使用 interface 更多一点（Best practice）

# type assertions:强转（强制认为是某个类型）

```ts
xxx as xxx
Or
<xxx> as xxx (tsx 不可用 因此不推荐)
```

在一些特别的情况下，强制转化可能失败，为此使用,两层强转：

```ts
const a = expr as any as T;
```

# Literal type ：字面类型？

```ts
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
```

只能为这些值

# 前面提到的 as 的使用场景:

```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

默认推导为 string，两种解决，内部 as 单独处理 method，或者使用 as const 整体强转为每个常量类型，

# !语法

强制非空 就像 as 做的事情

# enum

TODO

# 窄化：

```ts
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;

(parameter) padding: number
  }
  return padding + input;

(parameter) padding: string
}
```

## 范式:使用 typeof 进行 narrowing

可以避免一些意想不到的情况

# bool 值：

两种方式：
!!bool Or Boolean。
推荐前者，可以推断成 literal type.

# 代码品读：

false 的值：

```
0
NaN
"" (the empty string)
"" （空字符串）
0n (the bigint version of zero)
0n （零的bigint版本）
null
undefined
```

```ts
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  //   KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

无法处理空的字符串，取而代之，不要全部包裹

# 类型谓词 type predicator:

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

这是专门用来 narrow 的函数

# 断言函数：

assert()

# 最佳实践：

不要过分复合类型：

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

分开，否则如果一起，radius 不一定有

# nerver 类型

用来表示不应该存在的情况。用来确保，我们详尽了所有情况。

never 类型可分配给每种类型；但是，没有任何类型可以分配给 never （ never 本身除外）。这意味着您可以使用缩小范围并依靠 never 出现在 switch 语句中进行详尽的检查。

```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```

# 函数类型：

注意区别：

```ts
(number) => stg;
(number: numver) => stg;
```

两个的类型是完全不同的，不要忘了参数名称

# call signature:

我认为这里更好的理解是，对象可调用的成员，注意不是=>而是:。

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";

doSomething(myFunc);
```

# new signature:

```ts
type sth = {
    new (p:parameter):sth;
}
本质上是 new 操作符的运算
```

# 泛型参数

有点像偏特化

```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

## 泛型参数的限制:extends clause

```ts
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

### 最佳实践。能不哟就不用

## 也可指定类型参数类似 C++

# 可选参数的实质是：

Union，|undefined union.

## 回调函数中不要写?可空参数，

# 重载签名

感觉没什么用?感觉像是一种泛型的延申，确定一个类型，确定下其他。

```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.

```

## 对应的实现叫做 implement 签名

实现签名外面看不到。

```ts
function fn(x: string): void;
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn();
```
## 最佳实践：如果可能的话，总是更喜欢带有联合类型的参数而不是重载
原因是重载签名无法对运行时签名进行推断：
```ts
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
```
# 返回类型探究：
ts默认返回类型是void,而不是undefined.
# object!=Object
Object 是一个interface 而非类型
# unknow 
用于通过检查的any。
但是任何操作都会报错。
# 不定参数Rest：
...
```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```
不定参的类必须是数组。
## Rest argument
展开必须是元组,数组都不行
Like:
```ts
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```
# void 的edge case:
```ts
type RetVoid = () => void;
let returnVoid: RetVoid = function(){
  return true;
}
合法
但是下面这个不合法
function f2(): void {
  // @ts-expect-error
  return true;
}
 
const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```
# 解构模式不支持，或者说无法进行类型注释，因为js有内置定义
# object操作
## readonly:
静态时只读
```ts
interface SomeType {
  readonly prop: string;
}
 
function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);
 
  // But we can't re-assign it.
  obj.prop = "hello";
Cannot assign to 'prop' because it is a read-only property.
}
```
强调编译时：
别名可以修改。
```js
interface Person {
  name: string;
  age: number;
}
 
interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}
 
let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};
 
// works
let readonlyPerson: ReadonlyPerson = writablePerson;
 
console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```
# 索引签名，支持Array访问的类型：
```ts
interface StringArray {
  [index: number]: string;
}
 
const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
          
```
注意 索引前面一旦出现，所有的属性也必须符合索引签名，原因是两者操作类似的。
```ts
interface NumberDictionary {
  [index: string]: number;
 
  length: number; // ok
  name: string;
Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
索引签名支持绕过一些特殊检查
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: unknown;
}
property检查将失败
```
## 一个古怪的情况：
```ts
绕过这些检查的最后一种方法（可能有点令人惊讶）是将对象分配给另一个变量：由于分配squareOptions不会进行过多的属性检查，因此编译器不会给您错误：

let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
Try
The above workaround will work as long as you have a common property between squareOptions and SquareConfig. In this example, it was the property width. It will however, fail if the variable does not have any common object property. For example:
只要squareOptions和SquareConfig之间有共同的属性，上述解决方法就可以工作。在此示例中，它是属性width 。但是，如果变量没有任何公共对象属性，它将失败。例如：
```
# &运算
常用于type 的 & ，如果交集为空，生成never
# 泛型运算：
interface,type都可以是泛型
# Array<any> === any[]
还有一个实用的接口readonlyArray
# tuple 元组的定义
- 个数 + 类型决定的数组
- 元组支持类型展开 + 可选参数
- 支持readonly
- as const 对于tuple 的作用是变成 readonly tuple
# 泛型的完全说明 https://www.typescriptlang.org/docs/handbook/2/generics.html
- 支持类。
- 支持默认值
# Variance Annotations 
比较复杂的一个概念，我认为具体用到的时候在研究。
# 类型操作符 keyof:
基本上 就是键的literaltype Union.  
如果有index signature,那么就返回这个类型
## edge case:
```ts
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// m的类包含数字，因为数字强转成字符串
```
# 类型操作符 typeof:
注意区别运行时的typeof
# 类型操作符之索引访问：
访问object key 对应的那个值得的类型是什么。填的值时keyof能返回的值
# 类型操作符 条件：
```ts
SomeType extends OtherType ? TrueType : FalseType;
```
## infer关键字：
部分推断 type 的类型
### 条件推断 具有分布性：
```ts
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;
// 两个分别进行一次推断，然后合并
可以使用括号解除
```
# 类型操作符 映射
```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```
## 添加readnoly
+- 后跟想操作的运算符
```ts
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
 
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
 
type UnlockedAccount = CreateMutable<LockedAccount>;
```

## 可以使用as重新命名键：
```ts
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
 
interface Circle {
    kind: "circle";
    radius: number;
}
 
type KindlessCircle = RemoveKindField<Circle>;
```
## 对于联合的映射，两者会合并