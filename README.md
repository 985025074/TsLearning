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

# string!=String

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
## boolean in fact is the alias for  true| false
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
## 复习 == 和 === 一个连带检查类型，一个不连带因此 前者==null 包括了undefined的情况
## instanceof: x instanceof new 判断类型是否是new 而来，或者子类
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
Push Type Parameters Down
Here are two ways of writing a function that appear similar:

function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}
 
function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}
 
// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
Try
These might seem identical at first glance, but firstElement1 is a much better way to write this function. Its inferred return type is Type, but firstElement2’s inferred return type is any because TypeScript has to resolve the arr[0] expression using the constraint type, rather than “waiting” to resolve the element during a call.
## 也可指定类型参数类似 C++

# 可选参数的实质是：

Union，|undefined union.

## 回调函数中不要写?可空参数，
Optional Parameters in Callbacks
Once you’ve learned about optional parameters and function type expressions, it’s very easy to make the following mistakes when writing functions that invoke callbacks:

function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
Try
What people usually intend when writing index? as an optional parameter is that they want both of these calls to be legal:

myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
Try
What this actually means is that callback might get invoked with one argument. In other words, the function definition says that the implementation might look like this:

function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // I don't feel like providing the index today
    callback(arr[i]);
  }
}
Try
In turn, TypeScript will enforce this meaning and issue errors that aren’t really possible:

myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
'i' is possibly 'undefined'.
});
Try
In JavaScript, if you call a function with more arguments than there are parameters, the extra arguments are simply ignored. TypeScript behaves the same way. Functions with fewer parameters (of the same types) can always take the place of functions with more parameters.
**This actually means fewer argument function type can be signed to fucntion type with more arguments**
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
# 这个this的一些用法 不懂 ”https://www.typescriptlang.org/docs/handbook/2/functions.html
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
~~# 解构模式不支持，或者说无法进行类型注释（在外面注释可以，不要搞内部注释带默认值的），因为js有内置定义~~
# void 不是不能接受值，只是会被忽略
仅限forEach上下文：
https://www.typescriptlang.org/docs/handbook/2/functions.html#return-type-void
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
# 出现多个索引签名 number + string
number必须是string得到子类型，原因是js 自动将数字index 转为stringindex
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
In contrast, the following code will compile, but it results in a never type:
# 使用unknow 代替any
这样，我们继续使用这个类型的时候需要检查。
let x:unknow = data;
if(typeof x ===""){
  ...
}
# 泛型运算：
interface,type都可以是泛型
# Array<any> === any[]
还有一个实用的接口readonlyArray === readonly type[]
# tuple 元组的定义
- 个数 + 类型决定的数组
- 元组支持类型展开 + 可选参数
- 支持readonly (一个好的习惯)
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
访问object key 对应的那个值得的类型是什么。填的值是keyof能返回的值。
比如 对于object ={
  sth:string
}
可以写 object["sth"]
再比如:
object = {
  0:111
}

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
type ToArray<Type> = [Type] extends [any] ? Type[] : never;
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

# template literal:
https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#intrinsic-string-manipulation-types

# ts class:
支持initial:
```ts
class sth{
  x:number= 0
}
```
带一个strictPropertyInitialization 编译选项
## 强制避免错误：
```ts
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```
## 支持readonly
```ts
class OKGreeter {
  // Not initialized, but no error
  readonly name!: string;
}
```
## constructor:
支持重载：
# super:
在 JavaScript 里，`super` 关键字的用途较为广泛，主要在类的继承场景中使用。下面为你详细介绍它的使用方式：

### 1. 在构造函数里调用父类构造函数
当子类有自身的构造函数时，若要调用父类的构造函数，就需要使用 `super()`。

```javascript
class Parent {
    constructor(name) {
        this.name = name;
    }
}

class Child extends Parent {
    constructor(name, age) {
        // 调用父类的构造函数
        super(name);
        this.age = age;
    }
}

const child = new Child('Alice', 20);
console.log(child.name); // 输出: Alice
console.log(child.age);  // 输出: 20

```
在这个例子中，`Child` 类继承自 `Parent` 类。`Child` 类的构造函数里运用 `super(name)` 调用了 `Parent` 类的构造函数，以此来初始化 `name` 属性。

### 2. 调用父类的方法
在子类中，你能够使用 `super.methodName()` 调用父类的方法。

```javascript
class Parent {
    sayHello() {
        console.log('Hello from Parent');
    }
}

class Child extends Parent {
    sayHello() {
        // 调用父类的 sayHello 方法
        super.sayHello();
        console.log('Hello from Child');
    }
}

const child = new Child();
child.sayHello();
// 输出:
// Hello from Parent
// Hello from Child

```
在这个例子中，`Child` 类重写了 `sayHello` 方法，在 `Child` 类的 `sayHello` 方法里，使用 `super.sayHello()` 调用了父类的 `sayHello` 方法，接着输出自身的信息。

### 3. 注意事项
- **`super()` 必须在子类构造函数中第一个被调用**：若不这样做，会引发错误。
```javascript
class Parent {
    constructor(name) {
        this.name = name;
    }
}

class Child extends Parent {
    constructor(name, age) {
        this.age = age; // 错误，必须先调用 super()
        super(name);
    }
}
```
- **仅在类的 `constructor`、`static method` 或者 `prototype method` 里才能使用 `super`**：在其他地方使用会报错。 
### ts自带super提醒
# getter and setter:
```ts
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```
# class name implements other:
检查是否符合接口
# type only field declaration:
暂时不知道错误：
https://www.typescriptlang.org/docs/handbook/2/classes.html#type-only-field-declarations
# 执行顺序：
```
Initialization Order
The order that JavaScript classes initialize can be surprising in some cases. Let’s consider this code:

class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}
 
class Derived extends Base {
  name = "derived";
}
 
// Prints "base", not "derived"
const d = new Derived();
Try
What happened here?

The order of class initialization, as defined by JavaScript, is:

The base class fields are initialized
The base class constructor runs
The derived class fields are initialized
The derived class constructor runs
This means that the base class constructor saw its own value for name during its own constructor, because the derived class field initializations hadn’t run yet.
```
# Public 等访问权限：
默认public
再方法或者属性前面加上
# 在类里面重复 （父类定义，子类定义，好像不是覆盖，而是暴露）
# ts 的 private 是 soft:
甚至可以通过index operator访问
# 静态函数：
加上static 静态即可。
一些名称 不是安全的（function.s property）like call,length name 

```ts
class MySafe {
  private secretKey = 12345;
}
 
const s = new MySafe();
 
// Not allowed during type checking
console.log(s.secretKey);
Property 'secretKey' is private and only accessible within class 'MySafe'.
 
// OK
console.log(s["secretKey"]);
```
# 静态初始块：
在类的被加载完毕之后执行，推测一些运行时数据的加载：
```ts
class Foo {
    static #count = 0;
 
    get count() {
        return Foo.#count;
    }
 
    static {
        try {
            const lastInstances = loadLastInstances();
            Foo.#count += lastInstances.length;
        }
        catch {}
    }
}
```
# 如果在类中使用generic，static memeber 不能是这个generic 原因是 type are erased

# this的 例子：
arrow function的this 直接捕获，而function 的this 会查看上下文

```ts
class A {
  a = 1;
  printa = () => {
    console.log(this.a);
  };
  mya(){
    console.log(this.a)
  }
}
class B extends A {
  a = 10;
  printsupera =()=>{
    console.log(super.mya())
  }
}
let newA = new A()
let newB =new B()
let normalfunc = newA.mya
let arrowfunc = newA.printa
//arrowfunc()
//normalfunc()
// normalfunc.call(newB)
//  arrowfunc.call(newB) 不随bind 的this 而改变，结果是1

```
# ts中的 this 参数
ts 特有 function 支持this名字的参数
优点：不用arrow function（内存消耗（多份），无法使用super）
并且 this 是dynamic的
## this typeguard精彩用例：
https://www.typescriptlang.org/docs/handbook/2/classes.html#this-based-type-guards
```ts

```
# 类初始化列表的 初始化 paramter property
只要在consturctor前面加上 修饰符
# 类是函数
可以 const sth =class ...
# 通过typeof 类 产生类 InstanceType<>
# abstract class:
可以有abstarct 方法：
```ts
abstract class Base {
  abstract getName(): string;
 
  printName() {
    console.log("Hello, " + this.getName());
  }
}
 
const b = new Base();
```
抽象类无法被实例化，同时如果没有完全覆写也会报错。
# 如果我们想让参数是一个构造函数：
```ts
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);
```
注意ctor 类型不是typeof Base。
# 类的比较也是structual的，因此孔磊 是所有类的基类
# ts module
没有import 的叫全局脚本，全局可见，反之就是moduule。
Before we start, it’s important to understand what TypeScript considers a module. The JavaScript specification declares that any JavaScript files without an import declaration, export, or top-level await should be considered a script and not a module.
## 为此，如果希望一个文件没有导出但是成为module:
```ts
export {};
```

## 导入导出基本语法回顾：
最基本的具名和 default我们就不看了。
### as 给别名：
```ts
import {asd as shaobi} from sth
```
### 多条导入合并
```ts
import {shixiaogao as shaobi},wcl from "teacher"
```
### 命名空间式导入：
```ts
import  * as shabi from "teacher"
shabi.shixiaogao...
```
### Import file:
```ts
import "xczx"
```
相当于执行文件
## ts 专属类型导入导出
```ts
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
 
export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}
 
// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```
## 特别的import : import type:
```ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
 
// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;
 
// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
```
## 新版本支持混合：
```ts

import {sth,type Cat}

```
## ts的转义之后基本上就是：
require那种

## 互操作 es6module和commonjs可能有问题？
查阅这个文档，有一个标志https://www.typescriptlang.org/docs/handbook/2/modules.html#commonjs-and-es-modules-interop
## 测试：
经过测试 具名导出对于多个变量情况完好：
```ts
import {a} from "./comjs";

console.log(a)
```
另一个文件：
```ts
let a = 1




module.exports={
    a
}
```
但是如果改成：
module.exports = able
就会出错，为此tsconfig,json改成如下：
```ts
{
    "compilerOptions": {
      "esModuleInterop": true,

    }
  }
  
```
## 另外两个选项 module & target:
```json
{
    "compilerOptions": {
      "esModuleInterop": true,
      "module": "CommonJS"
    }
  }
  
```
# npm 包创建：
https://www.freecodecamp.org/news/how-to-create-and-publish-your-first-npm-package/
# declare 关键字：
配合.d.ts（一般写在这里面），配合第三方js 库 使用 
https://ts.xcatliu.com/basics/declaration-files.html#umd-ku
特别说明一下declare namespace:
内部不需要declare
npm包：
https://ts.xcatliu.com/basics/declaration-files.html#umd-ku
如果作者没有定义，那么：
```
/path/to/project
├── src
|  └── index.ts
├── types
|  └── foo
|     └── index.d.ts
└── tsconfig.json
```
创建一个types 并且创建一个foo的定义文件
然后注意tsconfig 配置一下模块查找路径：
{
    "compilerOptions": {
        "module": "commonjs",
        "baseUrl": "./",
        "paths": {
            "*": ["types/*"]
        }
    }
}
怎么有这么多jb 烦人的东西 服了。用的时候再看。
## 三斜线语法：
https://ts.xcatliu.com/basics/declaration-files.html#%E4%B8%89%E6%96%9C%E7%BA%BF%E6%8C%87%E4%BB%A4
导入一个定义文件
   "declaration": true,
   自动生成.d.ts
# tsconfig.json:
指示根目录 + 编译选项
## 只有直接tsc 没有input 才起作用 
tsc从当前目录向上 查找conifg
## 或者 tsc --project || tsc \p 来指定json所在
## example:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "emitter.ts",
    "program.ts",
    "commandLineParser.ts",
    "tsc.ts",
    "diagnosticInformationMap.generated.ts"
  ]
}
```
##  一些属性说明：
### extends:就是继承某个模板：
```json
{
  "extends": "@tsconfig/node12/tsconfig.json",
  "compilerOptions": {
    "preserveConstEnums": true
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}
```
## project reference
```
/
├── src/
│   ├── converter.ts
│   └── units.ts
├── test/
│   ├── converter-tests.ts
│   └── units-tests.ts
└── tsconfig.json
```
劣势：
--watch模式下，test 和 internal 一处改变都会导致所有文件的type checking
### reference是一个属性
    "references": [
        { "path": "../src" }
    ] 指示子目录
#### 被referenced必须要启用composite属性 ：https://www.typescriptlang.org/tsconfig#composite  https://www.typescriptlang.org/docs/handbook/project-references.html#composite
#### declarationmap:go to defination自由
# Utility types:
## awaited:
return the inner datatype in awaited
# partial:
consturct a new type with all property of a given type set to optional.IN another word:subset of the given type
# require:
the opposite of the partial
# readonly:
readonly object.
# record:
make a object consists of giveb keys and types
# pick:
pick sth out by key from type
# omit:
the opposite
# exclude:omit for union
# extract:the opposite
# parameter: extract the parameter of a function type
# constructpa:
# returntype:
# instancetype:tyof class with instance will produce the example of C

# Noinfer:control the inference of ts:https://www.totaltypescript.com/noinfer

# thistype:有点蠢
# 装饰器 用到再看。
# ts的equal实现：
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

# declare merge:
interface:
函数类型的merge会变成reload sigganture:the below one will go firsrt
除非是literaltype

# for of vs for in :
for of 迭代值，而且只允许 literable接口数据
```ts

for (let i in list) {
 {
  console.log(i); // "0", "1", "2",
}
for (let i of list) {
  console.log(i); // 4, 5, 6
}
```
# namespace:
类似单个文件，可以export：
如果存在跨文件，不要使用import 而是要用
///<reference path="">
## 给namespace 的东西起别名：
```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}
import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
```
注意，import 是引用性质的，从而优于var = x.y.z
# 三斜线 补充说明：
三斜杠指令仅在其包含文件的顶部有效。三斜杠指令只能位于单行或多行注释之前，包括其他三斜杠指令。如果它们出现在语句或声明之后，则它们将被视为常规单行注释，并且不具有特殊含义。
# react + ts:
https://react.dev/learn/typescript 回归来再看
## hook 是泛型：
```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```