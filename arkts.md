# 初识ArkTS语言

**更新时间: 2025-12-19 14:21**

ArkTS是HarmonyOS应用的默认开发语言，在[TypeScript](https://www.typescriptlang.org/)（简称TS）生态基础上做了扩展，保持TS的基本风格。通过规范定义，从而强化了开发期的静态检查和分析，提升了程序执行的稳定性和性能。

![](https://alliance-communityfile-drcn.dbankcdn.com/FileServer/getFile/cmtyPub/011/111/111/0000000000011111111.20251219142107.02702131155531551513079635220584:50001231000000:2800:DA429E058A9619940D278D4035A910BD52D227C530ADA64327211CADE1ABDC7C.png)

深入学习请看[ArkTS学习路线](https://developer.huawei.com/consumer/cn/arkts/)和[ArkTS视频课程](https://developer.huawei.com/consumer/cn/training/course/slightMooc/C101717496870909384?pathId=101667550095504391)。

自API version 10起，ArkTS进一步通过规范强化静态检查和分析，其主要特性及标准TS的差异包括[从TypeScript到ArkTS的适配规则](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/typescript-to-arkts-migration-guide)：

* 强制使用静态类型：静态类型是ArkTS最重要的特性之一。如果使用静态类型，那么程序中变量的类型就是确定的。同时，由于所有类型在程序实际运行前都是已知的，编译器可以验证代码的正确性，从而减少运行时的类型检查，有助于性能提升。
* 禁止在运行时改变对象布局：为实现最优性能，ArkTS禁止在程序执行期间更改对象布局。
* 限制运算符语义：为获得更好的性能并鼓励编写清晰的代码，ArkTS限制了部分运算符的语义。例如，一元加法运算符仅能作用于数字，不能用于其他类型变量。
* 不支持Structural typing：对Structural typing的支持需要在语言、编译器和运行时进行大量的考虑和仔细的实现，当前ArkTS不支持该特性。根据实际场景的需求和反馈，后续会重新考虑是否支持Structural typing。

ArkTS兼容TS/JavaScript（简称JS）生态，开发者可以使用TS/JS进行开发或复用已有代码。HarmonyOS系统对TS/JS支持的详细情况见[兼容TS/JS的约束](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-migration-background#方舟运行时兼容tsjs)。

未来，ArkTS会结合应用开发/运行的需求持续演进，逐步增强并行和并发能力、扩展系统类型，以及引入分布式开发范式等更多特性。


[](javascript:void(0);)

[

    ](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
		](javascript:void(0);)[
](javascript:void(0);)

简体中文

[](https://developer.huawei.com/consumer/cn/huawei-app/)[
获取开发者联盟APP](https://developer.huawei.com/consumer/cn/huawei-app/)

[](https://developer.huawei.com/consumer/cn/)

[
](https://developer.huawei.com/consumer/cn/)*  探索

* 设计
* 开发
* 分发
* 推广与变现
* 生态合作
* 支持
* 更多
* [探索](https://developer.huawei.com/consumer/cn/discover/)
* [设计](https://developer.huawei.com/consumer/cn/design/)
* [开发](https://developer.huawei.com/consumer/cn/develop/)
* [分发](https://developer.huawei.com/consumer/cn/distribute/)
* [推广与变现](https://developer.huawei.com/consumer/cn/promote/)
* [生态合作	](https://developer.huawei.com/consumer/cn/cooperate/)
* [支持](https://developer.huawei.com/consumer/cn/support/)

搜索

[文档](https://developer.huawei.com/consumer/cn/doc/)[管理中心](https://developer.huawei.com/consumer/cn/console)

[]()

[
            ]()[
            ]()[]()

HarmonyOS

* [版本说明 ](https://developer.huawei.com/consumer/cn/doc/harmonyos-releases/overview-503-beta1?istab=1&m=1)
* [指南 ](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/application-dev-guide?istab=1&m=1)
* [API参考 ](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/development-intro-api?istab=1&m=1)
* [最佳实践 ](https://developer.huawei.com/consumer/cn/doc/best-practices/bpta-best-practices-overview?istab=1&m=1)
* [FAQ ](https://developer.huawei.com/consumer/cn/doc/harmonyos-faqs/faqs-ability-kit?istab=1&m=1)
* [变更预告 ](https://developer.huawei.com/consumer/cn/doc/harmonyos-roadmap/changelogs-pre?istab=1&m=1)
* 更多

[ ]

[ ]

**指南**

基础入门[学习ArkTS语言](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/learning-arkts)**ArkTS语言介绍**

# ArkTS语言介绍

**更新时间: 2025-12-19 14:21**

ArkTS是一种设计用于构建高性能应用的编程语言。它在继承TypeScript语法的基础上进行了优化，以提供更高的性能和开发效率。

许多编程语言在设计之初未考虑移动设备，导致应用运行缓慢、低效且功耗大。随着移动设备在日常生活中越来越普遍，针对移动环境的编程语言优化需求日益增加。ArkTS专为解决这些问题而设计，聚焦提高运行效率。

TypeScript是在JavaScript基础上通过添加类型定义扩展而来的，ArkTS则是TypeScript的进一步扩展。TypeScript提供了一种更结构化的JavaScript编码方法，深受开发者喜爱。ArkTS保持了TypeScript的大部分语法，旨在为现有的TypeScript开发者提供高度兼容的体验，帮助移动开发者快速上手。

ArkTS的一大特性是它专注于低运行时开销。ArkTS对TypeScript的动态类型特性施加了更严格的限制，以减少运行时开销，提高执行效率。通过取消动态类型特性，ArkTS代码能更有效地被运行前编译和优化，从而实现更快的应用启动和更低的功耗。

ArkTS语言设计中考虑了与TypeScript和JavaScript的互通性。许多移动应用开发者希望重用TypeScript和JavaScript代码及库，因此ArkTS提供与TypeScript和JavaScript的无缝互通，使开发者可以轻松集成TypeScript和JavaScript代码到应用中，充分利用现有代码和库进行ArkTS开发。

本教程将指导开发者了解ArkTS的核心功能、语法和最佳实践，助力开发者使用ArkTS高效构建高性能的移动应用。

如需详细了解ArkTS语言，请参阅[ArkTS具体指南](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-overview)和[DevEco Studio](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/ide-tools-overview)。

## 基本知识

### 声明

ArkTS通过声明引入变量、常量、类型和函数。

**变量声明**

使用关键字let声明的变量可以在程序执行期间具有不同的值。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let hi: string = 'hello';</p></li><li data-node-id="20251220180742-qp6fhnu"><p>hi = 'hello, world';</p></li></ol></pre>

**常量声明**

使用关键字const声明的常量为只读类型，只能被赋值一次。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>const hello: string = 'hello';</p></li></ol></pre>

对常量重新赋值会造成编译时错误。

**自动类型推断**

如果变量或常量的声明包含初始值，开发者无需显式指定类型，因为ArkTS规范已列举了所有允许自动推断类型的场景。

以下示例中，两条声明语句都是有效的，两个变量都是string类型：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let hi1: string = 'hello';</p></li><li data-node-id="20251220180742-nyspzb5"><p>let hi2 = 'hello, world';</p></li></ol></pre>

### 类型

**基本类型和引用类型**

基本数据类型包括number、string等简单类型，它们可以准确地表示单一的数据类型。对基本类型的存储和访问都是直接的，比较时直接比较其值。

引用类型包括对象、数组和函数等复杂数据结构。这些类型通过引用访问数据，对象和数组可以包含多个值或键值对，函数则可以封装可执行的代码逻辑。引用类型在内存中通过指针访问数据，修改引用会影响原始数据。

**number类型**

ArkTS提供number类型，任何整数和浮点数都可以被赋给此类型的变量。

数字字面量包括整数字面量和十进制浮点数字面量。

整数字面量包括以下类别：

* 十进制整数，由数字序列组成。例如：0、117、-345。
* 十六进制整数，以0x（或0X）开头，包含数字（0-9）和字母a-f或A-F。例如：0x1123、0x00111、-0xF1A7。
* 八进制整数，以0o（或0O）开头，只能包含数字（0-7）。例如：0o777。
* 二进制整数，以0b（或0B）开头，只能包含数字0和1。例如：0b11、0b0011、-0b11。

浮点数字面量包括以下部分：

* 十进制整数，可为有符号数（前缀为“+”或“-”）。
* 小数点（“.”）。
* 小数部分（由十进制数字字符串表示）。
* 指数部分，以“e”或“E”开头，后跟有符号（前缀为“+”或“-”）或无符号整数。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let n1 = 3.14;</p></li><li data-node-id="20251220180742-wgwzk98"><p>let n2 = 3.141592;</p></li><li><p>let n3 = 0.5;</p></li><li data-node-id="20251220180742-uf5k7ki"><p>let n4 = 1e2;</p></li><li></li><li data-node-id="20251220180742-fo8tsxu"><p>function factorial(n: number): number {</p></li><li><p>  if (n <= 1) {</p></li><li data-node-id="20251220180742-j7es3mm"><p>    return 1;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-eicxu58"><p>  return n * factorial(n - 1);</p></li><li><p>}</p></li><li data-node-id="20251220180742-rrxvd8h"></li><li><p>factorial(n1)  //  7.660344000000002</p></li><li data-node-id="20251220180742-ifm8nm2"><p>factorial(n2)  //  7.680640444893748</p></li><li><p>factorial(n3)  //  1</p></li><li data-node-id="20251220180742-ypgll8y"><p>factorial(n4)  //  9.33262154439441e+157</p></li></ol></pre>

number类型在表示大整数（即超过-9007199254740991~9007199254740991）时会造成精度丢失。在开发时可以按需使用BigInt类型来确保精度：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let bigInt: BigInt = BigInt('999999999999999999999999999999999999999999999999999999999999');</p></li><li data-node-id="20251220180742-zojh0ik"><p>console.info('bigInt:' + bigInt.toString());</p></li></ol></pre>

**boolean类型**

boolean类型由true和false两个逻辑值组成。

通常在条件语句中使用boolean类型的变量：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let isDone: boolean = false;</p></li><li data-node-id="20251220180742-1ln2798"></li><li><p>// ...</p></li><li data-node-id="20251220180742-efrfeiz"></li><li><p>if (isDone) {</p></li><li data-node-id="20251220180742-1rzu73b"><p>  console.info('Done!');</p></li><li><p>}</p></li></ol></pre>

**string类型**

string类型代表字符序列，可以使用转义字符来表示字符。

字符串字面量由单引号（'）或双引号（"）之间括起来的零个或多个字符组成。字符串字面量还有一特殊形式，是用反向单引号（`）括起来的模板字面量。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let s1 = 'Hello, world!\n';</p></li><li data-node-id="20251220180742-yw8bf95"><p>let s2 = 'this is a string';</p></li><li><p>let a = 'Success';</p></li><li data-node-id="20251220180742-0esd2ay"><p>let s3 = `The result is ${a}`;</p></li></ol></pre>

**void类型**

void类型用于指定函数没有返回值。

此类型只有一个值，同样是void。由于void是引用类型，因此它可以用于泛型类型参数。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Class<T> {</p></li><li data-node-id="20251220180742-lnl2vg7"><p>  //...</p></li><li><p>}</p></li><li data-node-id="20251220180742-2nixm9w"><p>let instance: Class<void>;</p></li></ol></pre>

**Object类型**

Object类型是所有引用类型的基类型。任何值，包括基本类型的值，都可以直接被赋给Object类型的变量（基本类型值会被自动装箱）。

object类型用于表示除基本类型外的类型。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let o1: Object = 'Alice';</p></li><li data-node-id="20251220180742-k9fqem6"><p>let o2: Object = ['a', 'b'];</p></li><li><p>let o3: Object = 1;</p></li><li data-node-id="20251220180742-4r8a90x"><p>let o4: object = [1, 2, 3];</p></li></ol></pre>

**array类型**

array类型，即数组，是由可赋值给数组声明中指定的元素类型的数据组成的对象。

数组可由数组复合字面量赋值。数组复合字面量是用方括号括起来的零个或多个表达式列表，每个表达式为数组中的一个元素。数组的长度由数组中元素的个数确定。数组中第一个元素的索引为0。

以下示例将创建包含三个元素的数组：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let names: string[] = ['Alice', 'Bob', 'Carol'];</p></li></ol></pre>

**enum类型**

enum类型，即枚举类型，是预先定义的一组命名值的值类型，其中命名值又称为枚举常量。

使用枚举常量时必须以枚举类型名称为前缀。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>enum ColorSet { Red, Green, Blue }</p></li><li data-node-id="20251220180742-0gtbe9j"><p>let c: ColorSet = ColorSet.Red;</p></li></ol></pre>

常量表达式用于显式设置枚举常量的值。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>enum ColorSet { White = 0xFF, Grey = 0x7F, Black = 0x00 }</p></li><li data-node-id="20251220180742-n981ge4"><p>let c: ColorSet = ColorSet.Black;</p></li></ol></pre>

**Union类型**

Union类型，即联合类型，是由多个类型组合成的引用类型。联合类型包含了变量可能的所有类型。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Cat {</p></li><li data-node-id="20251220180742-tz2nh55"><p>  name: string = 'cat';</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-mvpowxn"><p>}</p></li><li><p>class Dog {</p></li><li data-node-id="20251220180742-2preykf"><p>  name: string = 'dog';</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-43q5g72"><p>}</p></li><li><p>class Frog {</p></li><li data-node-id="20251220180742-g9ez0js"><p>  name: string = 'frog';</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-s2y6ye4"><p>}</p></li><li><p>type Animal = Cat | Dog | Frog | number | string | null | undefined;</p></li><li data-node-id="20251220180742-jqerwxg"><p>// Cat、Dog、Frog是一些类型（类或接口）</p></li><li></li><li data-node-id="20251220180742-0um0vux"><p>let animal: Animal = new Cat();</p></li><li><p>animal = new Frog();</p></li><li data-node-id="20251220180742-qadslx7"><p>animal = 42;</p></li><li><p>animal = 'dog';</p></li><li data-node-id="20251220180742-u5ox9op"><p>animal = undefined;</p></li><li><p>// 可以将类型为联合类型的变量赋值为任何组成类型的有效值</p></li></ol></pre>

可以使用不同机制获取联合类型中的特定类型值。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Cat { sleep () {}; meow () {} }</p></li><li data-node-id="20251220180742-f1cam6g"><p>class Dog { sleep () {}; bark () {} }</p></li><li><p>class Frog { sleep () {}; leap () {} }</p></li><li data-node-id="20251220180742-yry9uyu"></li><li><p>type Animal = Cat | Dog | Frog;</p></li><li data-node-id="20251220180742-fi8k2yl"></li><li><p>function foo(animal: Animal) {</p></li><li data-node-id="20251220180742-pjg0ocw"><p>  if (animal instanceof Frog) {  // 判断animal是否是Frog类型</p></li><li><p>    animal.leap();  // animal在这里是Frog类型</p></li><li data-node-id="20251220180742-fevly4k"><p>  }</p></li><li><p>  animal.sleep(); // Animal具有sleep方法</p></li><li data-node-id="20251220180742-n5vk3mt"><p>}</p></li></ol></pre>

**Aliases类型**

Aliases类型为匿名类型（如数组、函数、对象字面量或联合类型）提供名称，或为已定义的类型提供替代名称。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// 二维数组类型</p></li><li data-node-id="20251220180742-34uapb2"><p>type Matrix = number[][];</p></li><li><p>const gameBoard: Matrix = [</p></li><li data-node-id="20251220180742-rfjmo7t"><p>  [1, 0],</p></li><li><p>  [0, 1]</p></li><li data-node-id="20251220180742-er9ld8f"><p>];</p></li><li></li><li data-node-id="20251220180742-kktxibl"><p>// 函数类型</p></li><li><p>type Handler = (s: string, no: number) => string;</p></li><li data-node-id="20251220180742-drwzbgp"><p>const repeatString: Handler = (str, times) => {</p></li><li><p>  return str.repeat(times);</p></li><li data-node-id="20251220180742-1pf6c9q"><p>};</p></li><li><p>console.info(repeatString('abc', 3)); // 'abcabcabc'</p></li><li data-node-id="20251220180742-bxd9pyc"></li><li><p>// 泛型函数类型</p></li><li data-node-id="20251220180742-qh8n5qb"><p>type Predicate<T> = (x: T) => boolean;</p></li><li><p>const isEven: Predicate<number> = (num) => num % 2 === 0;</p></li><li data-node-id="20251220180742-88pk9cp"></li><li><p>// 可为空的对象类型</p></li><li data-node-id="20251220180742-3x5v2qk"><p>type NullableObject = Object | null;</p></li><li><p>class Cat {}</p></li><li data-node-id="20251220180742-dsryoz5"><p>let animalData: NullableObject = new Cat();</p></li><li><p>let emptyData: NullableObject = null;</p></li></ol></pre>

### 运算符

**赋值运算符**

赋值运算符=，使用方式如x=y。

复合赋值运算符将赋值与运算符组合在一起，例如：a += b 等价于 a = a + b，

其中的 += 即为复合赋值运算符

复合赋值运算符包括：+=、-=、*=、/=、%=、<<=、>>=、>>>=、&=、|=、^=。

**比较运算符**

| 运算符 | 说明                                                                         |
| :----- | :--------------------------------------------------------------------------- |
| ===    | 如果两个操作数严格相等（对于不同类型的操作数认为是不相等的），则返回true。   |
| !==    | 如果两个操作数严格不相等（对于不同类型的操作数认为是不相等的），则返回true。 |
| ==     | 如果两个操作数相等，则返回true。                                             |
| !=     | 如果两个操作数不相等，则返回true。                                           |
| >      | 如果左操作数大于右操作数，则返回true。                                       |
| >=     | 如果左操作数大于或等于右操作数，则返回true。                                 |
| <      | 如果左操作数小于右操作数，则返回true。                                       |
| <=     | 如果左操作数小于或等于右操作数，则返回true。                                 |

===与==的区别：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// ==只比较目标的值相等</p></li><li data-node-id="20251220180742-xsmznrq"><p>console.info(String(null == undefined)); // true</p></li><li><p>// ===比较目标的值和类型都相等</p></li><li data-node-id="20251220180742-1ppfg4k"><p>console.info(String(null === undefined)); // false</p></li></ol></pre>

**算术运算符**

一元运算符包括：-、+、--、++。

二元运算符列举如下：

| 运算符 | 说明       |
| :----- | :--------- |
| +      | 加法       |
| -      | 减法       |
| *      | 乘法       |
| /      | 除法       |
| %      | 除法后余数 |

**位运算符**

| 运算符  | 说明                                                                   |
| :------ | :--------------------------------------------------------------------- |
| a & b   | 按位与：如果两个操作数的对应位都为1，则将这个位设置为1，否则设置为0。  |
| a       | b                                                                      |
| a ^ b   | 按位异或：如果两个操作数的对应位不同，则将这个位设置为1，否则设置为0。 |
| ~ a     | 按位非：反转操作数的位。                                               |
| a << b  | 左移：将a的二进制表示向左移b位。                                       |
| a >> b  | 算术右移：将a的二进制表示向右移b位，带符号扩展。                       |
| a >>> b | 逻辑右移：将a的二进制表示向右移b位，左边补0。                          |

**逻辑运算符**

| 运算符 | 说明   |
| :----- | :----- |
| a && b | 逻辑与 |
| a      |        |
| ! a    | 逻辑非 |

**instanceof运算符**

instanceof运算符用于在运行时检查一个对象是否是指定类或其子类的实例。

示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>obj instanceof className</p></li></ol></pre>

返回值类型为boolean。

如果obj是className类或其子类的实例，则返回值为true；否则，返回值为false。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {}</p></li><li data-node-id="20251220180742-tgnoc86"><p>const person = new Person();</p></li><li><p>if ((person instanceof Person)) {</p></li><li data-node-id="20251220180742-c11lhr5"><p>  console.info('true'); // true</p></li><li><p>}</p></li><li data-node-id="20251220180742-ogcr3m5"></li><li><p>class Animal {}</p></li><li data-node-id="20251220180742-qxfrty1"><p>class Bird extends Animal {}</p></li><li><p>const bird = new Bird();</p></li><li data-node-id="20251220180742-4hfgech"><p>if (bird instanceof Animal) {</p></li><li><p>  console.info('true'); // true</p></li><li data-node-id="20251220180742-zqdlf6a"><p>}</p></li></ol></pre>

### 语句

**if语句**

if语句用于需要根据逻辑条件执行不同语句的场景。当逻辑条件为真时，执行对应的一组语句，否则执行另一组语句（如果有的话）。

else部分也可以包含if语句。

if语句如下所示：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>if (condition1) {</p></li><li data-node-id="20251220180742-hhylp5r"><p>  // 语句1</p></li><li><p>} else if (condition2) {</p></li><li data-node-id="20251220180742-lpx3bgx"><p>  // 语句2</p></li><li><p>} else {</p></li><li data-node-id="20251220180742-xyuq127"><p>  // else语句</p></li><li><p>}</p></li></ol></pre>

条件表达式可以是任何类型，非boolean类型会进行隐式类型转换：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let s1 = 'Hello';</p></li><li data-node-id="20251220180742-unnqfaz"><p>if (s1) {</p></li><li><p>  console.info(s1); // 打印“Hello”</p></li><li data-node-id="20251220180742-yzmoihw"><p>}</p></li><li></li><li data-node-id="20251220180742-5883c3p"><p>let s2 = 'World';</p></li><li><p>if (s2.length != 0) {</p></li><li data-node-id="20251220180742-jhct6nl"><p>  console.info(s2); // 打印“World”</p></li><li><p>}</p></li></ol></pre>

**switch语句**

使用switch语句执行与switch表达式值匹配的代码块。

switch语句如下所示：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>switch (expression) {</p></li><li data-node-id="20251220180742-3upbz3l"><p>  case label1: // 如果label1匹配，则执行</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-xfwldmb"><p>    // 语句1</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-o9c5prk"><p>    break; // 可省略</p></li><li><p>  case label2:</p></li><li data-node-id="20251220180742-vbotsag"><p>  case label3: // 如果label2或label3匹配，则执行</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-brs786n"><p>    // 语句23</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-nyyjj9m"><p>    break; // 可省略</p></li><li><p>  default:</p></li><li data-node-id="20251220180742-poccqmp"><p>    // 默认语句</p></li><li><p>}</p></li></ol></pre>

如果switch表达式的值等于某个label的值，则执行相应的语句。

如果没有任何一个label值与表达式值相匹配，并且switch具有default子句，那么程序会执行default子句对应的代码块。

break语句（可选的）允许跳出switch语句并继续执行switch语句之后的语句。

如果没有break语句，则执行switch中的下一个label对应的代码块。

**条件表达式**

条件表达式根据第一个表达式的布尔值来返回其他两个表达式之一的结果。

示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>condition ? expression1 : expression2</p></li></ol></pre>

如果condition的值为真值（转换后为true的值），则使用expression1作为该表达式的结果；否则，使用expression2作为该表达式的结果。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let message = Math.random() > 0.5 ? 'Valid' : 'Failed';</p></li></ol></pre>

condition如果是非bool值则会进行隐式转换。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>    console.info('a' ? 'true' : 'false'); // true</p></li><li data-node-id="20251220180742-u4a7zq8"><p>    console.info('' ? 'true' : 'false'); // false</p></li><li><p>    console.info(1 ? 'true' : 'false'); // true</p></li><li data-node-id="20251220180742-runl7ah"><p>    console.info(0 ? 'true' : 'false'); // false</p></li><li><p>    console.info(null ? 'true' : 'false'); // false</p></li><li data-node-id="20251220180742-e71enty"><p>    console.info(undefined ? 'true' : 'false'); // false</p></li></ol></pre>

**for语句**

for语句会被重复执行，直到循环退出语句值为false。

for语句如下所示：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>for ([init]; [condition]; [update]) {</p></li><li data-node-id="20251220180742-xc8kuk3"><p>  statements</p></li><li><p>}</p></li></ol></pre>

for语句的执行流程如下：

1、 执行init表达式（如有）。此表达式通常初始化一个或多个循环计数器。

2、 计算condition。如果它为真值（转换后为true的值），则执行循环主体的语句。如果它为假值（转换后为false的值），则for循环终止。

3、 执行循环主体的语句。

4、 如果有update表达式，则执行该表达式。

5、 返回步骤2。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let sum = 0;</p></li><li data-node-id="20251220180742-6zk1re5"><p>for (let i = 0; i < 10; i += 2) {</p></li><li><p>  sum += i;</p></li><li data-node-id="20251220180742-nxmc04o"><p>}</p></li></ol></pre>

**for-of语句**

使用for-of语句可遍历数组、Set、Map、字符串等可迭代的类型。示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>for (forVar of IterableExpression) {</p></li><li data-node-id="20251220180742-sj5067r"><p>  // process forVar</p></li><li><p>}</p></li></ol></pre>

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>for (let ch of 'a string object') {</p></li><li data-node-id="20251220180742-7vhnu58"><p>  console.info(ch);</p></li><li><p>}</p></li></ol></pre>

**while语句**

只要condition为真值（转换后为true的值），while语句就会执行statements语句。示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>while (condition) {</p></li><li data-node-id="20251220180742-t766x37"><p>  statements</p></li><li><p>}</p></li></ol></pre>

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let n = 0;</p></li><li data-node-id="20251220180742-712mbtv"><p>let x = 0;</p></li><li><p>while (n < 3) {</p></li><li data-node-id="20251220180742-bgtt2t7"><p>  n++;</p></li><li><p>  x += n;</p></li><li data-node-id="20251220180742-2mc13q5"><p>}</p></li></ol></pre>

**do-while语句**

如果condition的值为真值（转换后为true的值），那么statements语句会重复执行。示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>do {</p></li><li data-node-id="20251220180742-8j1nab0"><p>  statements</p></li><li><p>} while (condition)</p></li></ol></pre>

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let i = 0;</p></li><li data-node-id="20251220180742-pdd4g1l"><p>do {</p></li><li><p>  i += 1;</p></li><li data-node-id="20251220180742-hgn9qms"><p>} while (i < 10)</p></li></ol></pre>

**break语句**

使用break语句可以终止循环语句或switch。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let x = 0;</p></li><li data-node-id="20251220180742-rg28a3l"><p>while (true) {</p></li><li><p>  x++;</p></li><li data-node-id="20251220180742-1ijyklh"><p>  if (x > 5) {</p></li><li><p>    break;</p></li><li data-node-id="20251220180742-y8ctgew"><p>  }</p></li><li><p>}</p></li></ol></pre>

如果break语句后带有标识符，则将控制流转移到该标识符所包含的语句块之外。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let x = 1;</p></li><li data-node-id="20251220180742-offeu46"><p>label: while (true) {</p></li><li><p>  switch (x) {</p></li><li data-node-id="20251220180742-560fku0"><p>    case 1:</p></li><li><p>      // statements</p></li><li data-node-id="20251220180742-b0z8112"><p>      break label; // 中断while语句</p></li><li><p>  }</p></li><li data-node-id="20251220180742-tf64v7u"><p>}</p></li></ol></pre>

**continue语句**

continue语句会停止当前循环迭代的执行，并将控制传递给下一次迭代。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let sum = 0;</p></li><li data-node-id="20251220180742-8kfnswy"><p>for (let x = 0; x < 100; x++) {</p></li><li><p>  if (x % 2 == 0) {</p></li><li data-node-id="20251220180742-sjyvl12"><p>    continue;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-ro6xov5"><p>  sum += x;</p></li><li><p>}</p></li></ol></pre>

**throw和try语句**

throw语句用于抛出异常或错误：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>throw new Error('this error')</p></li></ol></pre>

try语句用于捕获和处理异常或错误：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>try {</p></li><li data-node-id="20251220180742-4sqzeum"><p>  // 可能发生异常的语句块</p></li><li><p>} catch (e) {</p></li><li data-node-id="20251220180742-uc4c1no"><p>  // 异常处理</p></li><li><p>}</p></li></ol></pre>

下面的示例中throw和try语句用于处理除数为0的错误：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class ZeroDivisor extends Error {}</p></li><li data-node-id="20251220180742-a7sqg7d"></li><li><p>function divide (a: number, b: number): number {</p></li><li data-node-id="20251220180742-ctse4hw"><p>  if (b == 0) {</p></li><li><p>    throw new ZeroDivisor();</p></li><li data-node-id="20251220180742-njjhkmz"><p>  }</p></li><li><p>  return a / b;</p></li><li data-node-id="20251220180742-3qeiotu"><p>}</p></li><li></li><li data-node-id="20251220180742-1k59ufe"><p>function process (a: number, b: number) {</p></li><li><p>  try {</p></li><li data-node-id="20251220180742-f2qydcy"><p>    let res = divide(a, b);</p></li><li><p>    console.info('result: ' + res);</p></li><li data-node-id="20251220180742-mj81fxr"><p>  } catch (x) {</p></li><li><p>    console.error('some error');</p></li><li data-node-id="20251220180742-uqwx2li"><p>  }</p></li><li><p>}</p></li></ol></pre>

支持finally语句：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function processData(s: string) {</p></li><li data-node-id="20251220180742-9c3kf0m"><p>  let error: Error | null = null;</p></li><li></li><li data-node-id="20251220180742-vtc7ikn"><p>  try {</p></li><li><p>    console.info('Data processed: ' + s);</p></li><li data-node-id="20251220180742-1plou9b"><p>    // ...</p></li><li><p>    // 可能发生异常的语句</p></li><li data-node-id="20251220180742-h1jomeb"><p>    // ...</p></li><li><p>  } catch (e) {</p></li><li data-node-id="20251220180742-pzcusio"><p>    error = e as Error;</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-8ysbskb"><p>    // 异常处理</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-binbwgx"><p>  } finally {</p></li><li><p>    // 无论是否发生异常都会执行的代码</p></li><li data-node-id="20251220180742-h2eudjc"><p>    if (error != null) {</p></li><li><p>      console.error(`Error caught: input='${s}', message='${error.message}'`);</p></li><li data-node-id="20251220180742-bbp6m3l"><p>    }</p></li><li><p>  }</p></li><li data-node-id="20251220180742-7eoz7bp"><p>}</p></li></ol></pre>

## 函数

### 函数声明

函数声明引入一个函数，包含其名称、参数列表、返回类型和函数体。

以下示例是一个简单的函数和它的语法语义说明：

1.参数类型标注：x: string, y: string 显式声明参数类型为字符串类型。

2.返回值类型：: string 指定函数返回值为字符串类型。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function add(x: string, y: string): string {</p></li><li data-node-id="20251220180742-kq60t47"><p>  let z: string = `${x} ${y}`;</p></li><li><p>  return z;</p></li><li data-node-id="20251220180742-resas63"><p>}</p></li></ol></pre>

在函数声明中，必须为每个参数标记类型。如果参数为可选参数，那么允许在调用函数时省略该参数。函数的最后一个参数可以是rest参数。

### 可选参数

可选参数的格式可为name?: Type。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function hello(name?: string) {</p></li><li data-node-id="20251220180742-8a61soz"><p>  if (name == undefined) {</p></li><li><p>    console.info('Hello!');</p></li><li data-node-id="20251220180742-ahfyxyd"><p>  } else {</p></li><li><p>    console.info(`Hello, ${name}!`);</p></li><li data-node-id="20251220180742-ggtymyw"><p>  }</p></li><li><p>}</p></li></ol></pre>

可选参数的另一种形式为设置的参数默认值。如果在函数调用中这个参数被省略了，则会使用此参数的默认值作为实参。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function multiply(n: number, coeff: number = 2): number {</p></li><li data-node-id="20251220180742-hck5vlf"><p>  return n * coeff;</p></li><li><p>}</p></li><li data-node-id="20251220180742-epw5cxl"><p>multiply(2);  // 返回2*2</p></li><li><p>multiply(2, 3); // 返回2*3</p></li></ol></pre>

### rest参数

函数的最后一个参数可以是rest参数，格式为...restName: Type[]。rest参数允许函数接收一个不定长数组，用于处理不定数量的参数输入。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function sum(...numbers: number[]): number {</p></li><li data-node-id="20251220180742-aohzqfg"><p>  let res = 0;</p></li><li><p>  for (let n of numbers) {</p></li><li data-node-id="20251220180742-26w1pg3"><p>    res += n;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-bhyq3k7"><p>  return res;</p></li><li><p>}</p></li><li data-node-id="20251220180742-qaxvjpy"></li><li><p>sum(); // 返回0</p></li><li data-node-id="20251220180742-ykg8156"><p>sum(1, 2, 3); // 返回6</p></li></ol></pre>

### 返回类型

如果可以从函数体内推断出函数返回类型，则可在函数声明中省略标注返回类型。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// 显式指定返回类型</p></li><li data-node-id="20251220180742-7j4v67n"><p>function foo(): string { return 'foo'; }</p></li><li></li><li data-node-id="20251220180742-7w2lf1w"><p>// 推断返回类型为string</p></li><li><p>function goo() { return 'goo'; }</p></li></ol></pre>

不需要返回值的函数的返回类型可以显式指定为void或省略标注。这类函数不需要返回语句。

以下示例中两种函数声明方式都是有效的：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function hi1() { console.info('hi'); }</p></li><li data-node-id="20251220180742-hx17x36"><p>function hi2(): void { console.info('hi'); }</p></li></ol></pre>

### 函数的作用域

函数中定义的变量和其他实例仅可以在函数内部访问，不能从外部访问。

如果函数中定义的变量与外部作用域中已有实例同名，则函数内的局部变量定义将覆盖外部定义。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let outerVar = 'I am outer ';</p></li><li data-node-id="20251220180742-dflsyoh"></li><li><p>function func() {</p></li><li data-node-id="20251220180742-6eqj9uw"><p>    let outerVar = 'I am inside';</p></li><li><p>    console.info(outerVar); // 输出: I am inside</p></li><li data-node-id="20251220180742-nueehuq"><p>}</p></li><li></li><li data-node-id="20251220180742-3pzuyzn"><p>func();</p></li></ol></pre>

### 函数调用

调用函数以执行其函数体，实参值会赋值给函数的形参。

如果函数定义如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function join(x: string, y: string): string {</p></li><li data-node-id="20251220180742-lhkppy5"><p>  let z: string = `${x} ${y}`;</p></li><li><p>  return z;</p></li><li data-node-id="20251220180742-m1iahfk"><p>}</p></li></ol></pre>

则此函数的调用需要包含两个string类型的参数：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let x = join('hello', 'world');</p></li><li data-node-id="20251220180742-5cy0q6j"><p>console.info(x); // 输出: hello world</p></li></ol></pre>

### 函数类型

函数类型通常用于定义回调函数：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>type trigFunc = (x: number) => number // 这是一个函数类型</p></li><li data-node-id="20251220180742-qnathko"></li><li><p>function do_action(f: trigFunc) {</p></li><li data-node-id="20251220180742-vuqyw16"><p>  f(3.141592653589); // 调用函数</p></li><li><p>}</p></li><li data-node-id="20251220180742-67nvkpi"></li><li><p>do_action(Math.sin); // 将函数作为参数传入</p></li></ol></pre>

### 箭头函数（又名Lambda函数）

函数可以定义为箭头函数，例如：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let sum = (x: number, y: number): number => {</p></li><li data-node-id="20251220180742-624y29m"><p>  return x + y;</p></li><li><p>}</p></li></ol></pre>

箭头函数的返回类型可以省略，此时返回类型从函数体推断。

表达式可以指定为箭头函数，使表达更简短，因此以下两种表达方式是等价的：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let sum1 = (x: number, y: number) => { return x + y; }</p></li><li data-node-id="20251220180742-0puhk2v"><p>let sum2 = (x: number, y: number) => x + y</p></li></ol></pre>

### 闭包

闭包是由函数及声明该函数的环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量。

在下例中，f函数返回了一个闭包，它捕获了count变量，每次调用z，count的值会被保留并递增。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function f(): () => number {</p></li><li data-node-id="20251220180742-6uuefly"><p>  let count = 0;</p></li><li><p>  let g = (): number => { count++; return count; };</p></li><li data-node-id="20251220180742-yhs8jcx"><p>  return g;</p></li><li><p>}</p></li><li data-node-id="20251220180742-c5k6i3r"></li><li><p>let z = f();</p></li><li data-node-id="20251220180742-vq40g40"><p>z(); // 返回：1</p></li><li><p>z(); // 返回：2</p></li></ol></pre>

### 函数重载

可以通过编写重载，指定函数的不同调用方式。具体方法是，为同一个函数写入多个同名但签名不同的函数头，函数实现紧随其后。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function foo(x: number): void;            /* 第一个函数定义 */</p></li><li data-node-id="20251220180742-e6q4kyh"><p>function foo(x: string): void;            /* 第二个函数定义 */</p></li><li><p>function foo(x: number | string): void {  /* 函数实现 */</p></li><li data-node-id="20251220180742-ugsvo9q"><p>}</p></li><li></li><li data-node-id="20251220180742-n8v38sw"><p>foo(123);     //  OK，使用第一个定义</p></li><li><p>foo('aa'); // OK，使用第二个定义</p></li></ol></pre>

不允许重载函数有相同的名字和参数列表，否则将导致编译错误。

## 类

类声明引入一个新类型，并定义其字段、方法和构造函数。

在以下示例中，定义了Person类，该类具有字段name和surname、构造函数和方法fullName：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-ayop4ec"><p>  name: string = '';</p></li><li><p>  surname: string = '';</p></li><li data-node-id="20251220180742-rktl742"><p>  constructor (n: string, sn: string) {</p></li><li><p>    this.name = n;</p></li><li data-node-id="20251220180742-3thnuxc"><p>    this.surname = sn;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-dml3do3"><p>  fullName(): string {</p></li><li><p>    return this.name + ' ' + this.surname;</p></li><li data-node-id="20251220180742-le7fttn"><p>  }</p></li><li><p>}</p></li></ol></pre>

定义类后，可以使用关键字new创建实例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let p = new Person('John', 'Smith');</p></li><li data-node-id="20251220180742-jn5w7hw"><p>console.info(p.fullName());</p></li></ol></pre>

或者，可以使用对象字面量创建实例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Point {</p></li><li data-node-id="20251220180742-goia5ly"><p>  x: number = 0;</p></li><li><p>  y: number = 0;</p></li><li data-node-id="20251220180742-rd3d799"><p>}</p></li><li><p>let p: Point = {x: 42, y: 42};</p></li></ol></pre>

### 字段

字段是直接在类中声明的某种类型的变量。

类可以具有实例字段或者静态字段。

**实例字段**

实例字段存在于类的每个实例上。每个实例都有自己的实例字段集合。

要访问实例字段，需要使用类的实例。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-qelfvfd"><p>  name: string = '';</p></li><li><p>  age: number = 0;</p></li><li data-node-id="20251220180742-u77zuju"><p>  constructor(n: string, a: number) {</p></li><li><p>    this.name = n;</p></li><li data-node-id="20251220180742-pgyojox"><p>    this.age = a;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-t0gg6ua"></li><li><p>  getName(): string {</p></li><li data-node-id="20251220180742-1wz3283"><p>    return this.name;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-v83vked"><p>}</p></li><li></li><li data-node-id="20251220180742-m7un1ys"><p>let p1 = new Person('Alice', 25);</p></li><li><p>p1.name; // Alice</p></li><li data-node-id="20251220180742-yoy7h9b"><p>let p2 = new Person('Bob', 28);</p></li><li><p>p2.getName(); // Bob</p></li></ol></pre>

**静态字段**

使用关键字static将字段声明为静态。静态字段属于类本身，类的所有实例共享一个静态字段。

要访问静态字段，需要使用类名：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-bxj1z2e"><p>  static numberOfPersons = 0;</p></li><li><p>  constructor() {</p></li><li data-node-id="20251220180742-gb5v8pu"><p>     // ...</p></li><li><p>     Person.numberOfPersons++;</p></li><li data-node-id="20251220180742-rva4tu8"><p>     // ...</p></li><li><p>  }</p></li><li data-node-id="20251220180742-z4b49hw"><p>}</p></li><li></li><li data-node-id="20251220180742-5t2a53l"><p>Person.numberOfPersons;</p></li></ol></pre>

**字段初始化**

为了减少运行时错误并提升执行性能，

ArkTS要求所有字段在声明时或构造函数中显式初始化，与标准TS的strictPropertyInitialization模式相同。

以下代码在ArkTS中不合法。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-a8dak1i"><p>  name: string; // undefined</p></li><li></li><li data-node-id="20251220180742-htar0rc"><p>  setName(n: string): void {</p></li><li><p>    this.name = n;</p></li><li data-node-id="20251220180742-c4g3p6w"><p>  }</p></li><li></li><li data-node-id="20251220180742-vlb0w2k"><p>  getName(): string {</p></li><li><p>    // 开发者使用"string"作为返回类型，这隐藏了name可能为"undefined"的事实。</p></li><li data-node-id="20251220180742-p14ektp"><p>    // 更合适的做法是将返回类型标注为"string | undefined"，以告诉开发者这个API所有可能的返回值。</p></li><li><p>    return this.name;</p></li><li data-node-id="20251220180742-bwjv32f"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-ws0do2f"></li><li><p>let jack = new Person();</p></li><li data-node-id="20251220180742-09y5o0b"><p>// 假设代码中没有对name赋值，即没有调用"jack.setName('Jack')"</p></li><li><p>jack.getName().length; // 运行时异常：name is undefined</p></li></ol></pre>

在ArkTS中，开发者应该这样写代码。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-ii8sko9"><p>  name: string = '';</p></li><li></li><li data-node-id="20251220180742-sfm0qrw"><p>  setName(n: string): void {</p></li><li><p>    this.name = n;</p></li><li data-node-id="20251220180742-prmosz9"><p>  }</p></li><li></li><li data-node-id="20251220180742-3y8fafx"><p>  // 类型为'string'，不可能为"null"或者"undefined"</p></li><li><p>  getName(): string {</p></li><li data-node-id="20251220180742-f7c9wdz"><p>    return this.name;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-6ocjx4o"><p>}</p></li><li></li><li data-node-id="20251220180742-e6bdznk"></li><li><p>let jack = new Person();</p></li><li data-node-id="20251220180742-crlsmsq"><p>// 假设代码中没有对name赋值，即没有调用"jack.setName('Jack')"</p></li><li><p>jack.getName().length; // 0, 没有运行时异常</p></li></ol></pre>

接下来的代码示例展示了当name的值可能为undefined时，如何正确编写代码。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-j3j7ej7"><p>  name?: string; // 可能为`undefined`</p></li><li></li><li data-node-id="20251220180742-sw9n9jn"><p>  setName(n: string): void {</p></li><li><p>    this.name = n;</p></li><li data-node-id="20251220180742-mypu9jl"><p>  }</p></li><li></li><li data-node-id="20251220180742-7pwocwb"><p>  // 编译时错误：name可以是"undefined"，所以这个API的返回值类型不能仅定义为string类型</p></li><li><p>  getNameWrong(): string {</p></li><li data-node-id="20251220180742-21nabxs"><p>    return this.name;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-gadul4m"></li><li><p>  getName(): string | undefined { // 返回类型匹配name的类型</p></li><li data-node-id="20251220180742-vos6mfn"><p>    return this.name;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-m1um1os"><p>}</p></li><li></li><li data-node-id="20251220180742-ri3pn9q"><p>let jack = new Person();</p></li><li><p>// 假设代码中没有对name赋值，即没有调用"jack.setName('Jack')"</p></li><li data-node-id="20251220180742-1rfippe"></li><li><p>// 编译时错误：编译器认为下一行代码有可能会访问undefined的属性，报错</p></li><li data-node-id="20251220180742-9fk4qd2"><p>jack.getName().length;  // 编译失败</p></li><li></li><li data-node-id="20251220180742-c8p9cl3"><p>jack.getName()?.length; // 编译成功，没有运行时错误</p></li></ol></pre>

**getter和setter**

setter和getter可用于提供对类属性的受控访问。

在以下示例中，setter用于禁止将_age属性设置为无效值：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-3y0u6w6"><p>  name: string = '';</p></li><li><p>  private _age: number = 0;</p></li><li data-node-id="20251220180742-x0jq9wr"><p>  get age(): number { return this._age; }</p></li><li><p>  set age(x: number) {</p></li><li data-node-id="20251220180742-g8cxd5o"><p>    if (x < 0) {</p></li><li><p>      throw Error('Invalid age argument');</p></li><li data-node-id="20251220180742-9ehdzp9"><p>    }</p></li><li><p>    this._age = x;</p></li><li data-node-id="20251220180742-jduhyfw"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-wog3ror"></li><li><p>let p = new Person();</p></li><li data-node-id="20251220180742-no2g4jm"><p>p.age; // 输出0</p></li><li><p>p.age = -42; // 设置无效age值会抛出错误</p></li></ol></pre>

在类中可以定义getter或者setter。

### 方法

方法属于类。类可以定义实例方法或者静态方法。静态方法属于类本身，只能访问静态字段。而实例方法既可以访问静态字段，也可以访问实例字段，包括类的私有字段。

**实例方法**

以下示例说明了实例方法的工作原理。

calculateArea方法计算矩形面积：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class RectangleSize {</p></li><li data-node-id="20251220180742-m0tjbvg"><p>  private height: number = 0;</p></li><li><p>  private width: number = 0;</p></li><li data-node-id="20251220180742-qkn9f1b"><p>  constructor(height: number, width: number) {</p></li><li><p>    this.height = height;</p></li><li data-node-id="20251220180742-9zcfumb"><p>    this.width = width;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-745xgjg"><p>  calculateArea(): number {</p></li><li><p>    return this.height * this.width;</p></li><li data-node-id="20251220180742-heuvr9f"><p>  }</p></li><li><p>}</p></li></ol></pre>

必须通过类的实例调用实例方法：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let square = new RectangleSize(10, 10);</p></li><li data-node-id="20251220180742-40pdt9k"><p>square.calculateArea(); // 输出：100</p></li></ol></pre>

**静态方法**

使用关键字 static 声明静态方法。静态方法属于类，只能访问静态字段。

静态方法定义了类作为一个整体的公共行为。

必须通过类名调用静态方法：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Cl {</p></li><li data-node-id="20251220180742-0kpdm2x"><p>  static staticMethod(): string {</p></li><li><p>    return 'this is a static method.';</p></li><li data-node-id="20251220180742-ynkw07u"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-wzwqh7f"><p>console.info(Cl.staticMethod());</p></li></ol></pre>

**继承**

一个类可以继承另一个类（称为基类），并使用以下语法实现多个接口：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class [extends BaseClassName] [implements listOfInterfaces] {</p></li><li data-node-id="20251220180742-5iv8wgi"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

继承类继承基类的字段和方法，但不继承构造函数。继承类可以新增定义字段和方法，也可以覆盖其基类定义的方法。

基类也称为“父类”或“超类”。继承类也称为“派生类”或“子类”。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-5k65api"><p>  name: string = '';</p></li><li><p>  private _age = 0;</p></li><li data-node-id="20251220180742-8n1z14h"><p>  get age(): number {</p></li><li><p>    return this._age;</p></li><li data-node-id="20251220180742-agcmskt"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-ppmlt5g"><p>class Employee extends Person {</p></li><li><p>  salary: number = 0;</p></li><li data-node-id="20251220180742-9vto89p"><p>  calculateTaxes(): number {</p></li><li><p>    return this.salary * 0.42;</p></li><li data-node-id="20251220180742-8yckork"><p>  }</p></li><li><p>}</p></li></ol></pre>

包含implements子句的类必须实现列出的接口中定义的所有方法，但使用默认实现定义的方法除外。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface DateInterface {</p></li><li data-node-id="20251220180742-q3sxrq7"><p>  now(): string;</p></li><li><p>}</p></li><li data-node-id="20251220180742-fo0p7zr"><p>class MyDate implements DateInterface {</p></li><li><p>  now(): string {</p></li><li data-node-id="20251220180742-id8aojd"><p>    // 在此实现</p></li><li><p>    return 'now';</p></li><li data-node-id="20251220180742-da931tr"><p>  }</p></li><li><p>}</p></li></ol></pre>

**父类访问**

关键字super可用于访问父类的方法和构造函数。在实现子类功能时，可以通过该关键字从父类中获取所需接口：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class RectangleSize {</p></li><li data-node-id="20251220180742-085yawl"><p>  protected height: number = 0;</p></li><li><p>  protected width: number = 0;</p></li><li data-node-id="20251220180742-lh03ywf"></li><li><p>  constructor (h: number, w: number) {</p></li><li data-node-id="20251220180742-w3ht1pg"><p>    this.height = h;</p></li><li><p>    this.width = w;</p></li><li data-node-id="20251220180742-8wmwxtc"><p>  }</p></li><li></li><li data-node-id="20251220180742-m59mgmf"><p>  draw() {</p></li><li><p>    /* 绘制边界 */</p></li><li data-node-id="20251220180742-ypnxo6y"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-6110413"><p>class FilledRectangle extends RectangleSize {</p></li><li><p>  color = ''</p></li><li data-node-id="20251220180742-x70xs9o"><p>  constructor (h: number, w: number, c: string) {</p></li><li><p>    super(h, w); // 父类构造函数的调用</p></li><li data-node-id="20251220180742-osteu9c"><p>    this.color = c;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-zsty53d"></li><li><p>  draw() {</p></li><li data-node-id="20251220180742-u9z2sur"><p>    super.draw(); // 父类方法的调用</p></li><li><p>    /* 填充矩形 */</p></li><li data-node-id="20251220180742-74kduit"><p>  }</p></li><li><p>}</p></li></ol></pre>

**方法重写**

子类可以重写其父类中定义的方法的实现。重写的方法必须具有与原始方法相同的参数类型和相同或派生的返回类型。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class RectangleSize {</p></li><li data-node-id="20251220180742-3ae4fqq"><p>  // ...</p></li><li><p>  area(): number {</p></li><li data-node-id="20251220180742-lekebfk"><p>    // 实现</p></li><li><p>    return 0;</p></li><li data-node-id="20251220180742-s1vrnxs"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-nk1xtz3"><p>class Square extends RectangleSize {</p></li><li><p>  private side: number = 0;</p></li><li data-node-id="20251220180742-v0851lr"><p>  area(): number {</p></li><li><p>    return this.side * this.side;</p></li><li data-node-id="20251220180742-55seg5v"><p>  }</p></li><li><p>}</p></li></ol></pre>

**方法重载签名**

通过重载签名，指定方法的不同调用。具体方法为，为同一个方法写入多个同名但签名不同的方法头，方法实现紧随其后。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class C {</p></li><li data-node-id="20251220180742-g8gfjfq"><p>  foo(x: number): void;            /* 第一个签名 */</p></li><li><p>  foo(x: string): void;            /* 第二个签名 */</p></li><li data-node-id="20251220180742-dlv4fft"><p>  foo(x: number | string): void {  /* 实现签名 */</p></li><li><p>  }</p></li><li data-node-id="20251220180742-n9njghy"><p>}</p></li><li><p>let c = new C();</p></li><li data-node-id="20251220180742-dului5i"><p>c.foo(123);     // OK，使用第一个签名</p></li><li><p>c.foo('aa'); // OK，使用第二个签名</p></li></ol></pre>

如果两个重载签名的名称和参数列表均相同，则为错误。

### 构造函数

类声明可以包含用于初始化对象状态的构造函数。

构造函数定义如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>constructor ([parameters]) {</p></li><li data-node-id="20251220180742-dbhywqi"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

如果未定义构造函数，则会自动创建具有空参数列表的默认构造函数，例如：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Point {</p></li><li data-node-id="20251220180742-7nmu1uu"><p>  x: number = 0;</p></li><li><p>  y: number = 0;</p></li><li data-node-id="20251220180742-ym0idmx"><p>}</p></li><li><p>let p = new Point();</p></li></ol></pre>

在这种情况下，默认构造函数使用字段类型的默认值初始化实例中的字段。

**派生类的构造函数**

构造函数函数体的第一条语句可以使用关键字super来显式调用直接父类的构造函数。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class RectangleSize {</p></li><li data-node-id="20251220180742-1yh25qb"><p>  constructor(width: number, height: number) {</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-nk8vi8y"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-661z1tg"><p>class Square extends RectangleSize {</p></li><li><p>  constructor(side: number) {</p></li><li data-node-id="20251220180742-h3tohx3"><p>    super(side, side);</p></li><li><p>  }</p></li><li data-node-id="20251220180742-6up68ed"><p>}</p></li></ol></pre>

**构造函数重载签名**

可以通过编写重载签名，指定构造函数的不同调用方式。具体方法是，为同一个构造函数写入多个同名但签名不同的构造函数头，构造函数实现紧随其后。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class C {</p></li><li data-node-id="20251220180742-9h06nfg"><p>  constructor(x: number)             /* 第一个签名 */</p></li><li><p>  constructor(x: string)             /* 第二个签名 */</p></li><li data-node-id="20251220180742-iw8w30s"><p>  constructor(x: number | string) {  /* 实现签名 */</p></li><li><p>  }</p></li><li data-node-id="20251220180742-s6ds2cf"><p>}</p></li><li><p>let c1 = new C(123);      // OK，使用第一个签名</p></li><li data-node-id="20251220180742-9s06bbk"><p>let c2 = new C('abc');    // OK，使用第二个签名</p></li></ol></pre>

如果两个重载签名的名称和参数列表均相同，则为错误。

### 可见性修饰符

类的方法和属性都可以使用可见性修饰符。

可见性修饰符包括：private、protected和public。默认可见性为public。

**Public（公有）**

public修饰的类成员（字段、方法、构造函数）在程序的任何可访问该类的地方都是可见的。

**Private（私有）**

private修饰的成员不能在声明该成员的类之外访问，例如：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class C {</p></li><li data-node-id="20251220180742-frshqsw"><p>  public x: string = '';</p></li><li><p>  private y: string = '';</p></li><li data-node-id="20251220180742-ruu626e"><p>  set_y (new_y: string) {</p></li><li><p>    this.y = new_y; // OK，因为y在类本身中可以访问</p></li><li data-node-id="20251220180742-p9ao3hd"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-7ehiu6c"><p>let c = new C();</p></li><li><p>c.x = 'a'; // OK，该字段是公有的</p></li><li data-node-id="20251220180742-3unbmk6"><p>c.y = 'b'; // 编译时错误：'y'不可见</p></li></ol></pre>

**Protected（受保护）**

protected修饰符的作用与private修饰符非常相似，不同点是protected修饰的成员允许在派生类中访问，例如：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Base {</p></li><li data-node-id="20251220180742-440pr59"><p>  protected x: string = '';</p></li><li><p>  private y: string = '';</p></li><li data-node-id="20251220180742-zgqhxu1"><p>}</p></li><li><p>class Derived extends Base {</p></li><li data-node-id="20251220180742-puyq3lx"><p>  foo() {</p></li><li><p>    this.x = 'a'; // OK，访问受保护成员</p></li><li data-node-id="20251220180742-ka52dm0"><p>    this.y = 'b'; // 编译时错误，'y'不可见，因为它是私有的</p></li><li><p>  }</p></li><li data-node-id="20251220180742-kbas38d"><p>}</p></li></ol></pre>

### 对象字面量

对象字面量是一个表达式，可用于创建类实例并提供一些初始值。它在某些情况下更方便，可以用来代替new表达式。

对象字面量的表示方式是：封闭在花括号对({})中的'属性名：值'的列表。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class C {</p></li><li data-node-id="20251220180742-1pq1t3c"><p>  n: number = 0;</p></li><li><p>  s: string = '';</p></li><li data-node-id="20251220180742-pbpajlg"><p>}</p></li><li></li><li data-node-id="20251220180742-ea5bicl"><p>let c: C = {n: 42, s: 'foo'};</p></li></ol></pre>

ArkTS是静态类型语言，如上述示例所示，对象字面量只能在可以推导出该字面量类型的上下文中使用。其他正确的例子如下所示：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class C {</p></li><li data-node-id="20251220180742-fb6cqi5"><p>  n: number = 0;</p></li><li><p>  s: string = '';</p></li><li data-node-id="20251220180742-oqdoi1z"><p>}</p></li><li></li><li data-node-id="20251220180742-amzr5mv"><p>function foo(c: C) {}</p></li><li></li><li data-node-id="20251220180742-noz35vo"><p>let c: C</p></li><li></li><li data-node-id="20251220180742-p4w7hjx"><p>c = {n: 42, s: 'foo'};  // 使用变量的类型</p></li><li><p>foo({n: 42, s: 'foo'}); // 使用参数的类型</p></li><li data-node-id="20251220180742-zul2am1"></li><li><p>function bar(): C {</p></li><li data-node-id="20251220180742-wm6lzzn"><p>  return {n: 42, s: 'foo'}; // 使用返回类型</p></li><li><p>}</p></li></ol></pre>

也可以在数组元素类型或类字段类型中使用：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class C {</p></li><li data-node-id="20251220180742-5gdi6rv"><p>  n: number = 0;</p></li><li><p>  s: string = '';</p></li><li data-node-id="20251220180742-fdfzkjf"><p>}</p></li><li><p>let cc: C[] = [{n: 1, s: 'a'}, {n: 2, s: 'b'}];</p></li></ol></pre>

**Record类型的对象字面量**

泛型Record<K, V>用于将类型（键类型）的属性映射到另一个类型（值类型）。常用对象字面量来初始化该类型的值：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let map: Record<string, number> = {</p></li><li data-node-id="20251220180742-zl5tccs"><p>  'John': 25,</p></li><li><p>  'Mary': 21</p></li><li data-node-id="20251220180742-lxbaofw"><p>};</p></li><li></li><li data-node-id="20251220180742-ovb8ny8"><p>map['John']; // 25</p></li></ol></pre>

类型K可以是字符串类型或数值类型(不包括BigInt)，而V可以是任何类型。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface PersonInfo {</p></li><li data-node-id="20251220180742-3p5upqm"><p>  age: number;</p></li><li><p>  salary: number;</p></li><li data-node-id="20251220180742-4vyhe99"><p>}</p></li><li><p>let map: Record<string, PersonInfo> = {</p></li><li data-node-id="20251220180742-2rh0uxg"><p>  'John': { age: 25, salary: 10},</p></li><li><p>  'Mary': { age: 21, salary: 20}</p></li><li data-node-id="20251220180742-pr66vaz"><p>}</p></li></ol></pre>

### 抽象类

带有abstract修饰符的类称为抽象类。抽象类可用于表示一组更具体的概念所共有的概念。

尝试创建抽象类的实例会导致编译错误：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>abstract class X {</p></li><li data-node-id="20251220180742-565dcc1"><p>  field: number;</p></li><li><p>  constructor(p: number) {</p></li><li data-node-id="20251220180742-2mmo8d6"><p>    this.field = p;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-atq9zlt"><p>}</p></li><li></li><li data-node-id="20251220180742-ecb8d6n"><p>let x = new X(666)  //编译时错误：不能创建抽象类的具体实例</p></li></ol></pre>

抽象类的子类可以是抽象类也可以是非抽象类。抽象父类的非抽象子类可以实例化。因此，执行抽象类的构造函数和该类非静态字段的字段初始化器：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>abstract class Base {</p></li><li data-node-id="20251220180742-gda93eu"><p>  field: number;</p></li><li><p>  constructor(p: number) {</p></li><li data-node-id="20251220180742-zubequi"><p>    this.field = p;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-b2lypcb"><p>}</p></li><li></li><li data-node-id="20251220180742-u0ulpoc"><p>class Derived extends Base {</p></li><li><p>  constructor(p: number) {</p></li><li data-node-id="20251220180742-dsasnn6"><p>    super(p);</p></li><li><p>  }</p></li><li data-node-id="20251220180742-5vk521u"><p>}</p></li><li></li><li data-node-id="20251220180742-ubk9tx9"><p>let x = new Derived(666);</p></li></ol></pre>

**抽象方法**

带有abstract修饰符的方法称为抽象方法，抽象方法可以被声明但不能被实现。

只有抽象类内才能有抽象方法，如果非抽象类具有抽象方法，则会发生编译时错误：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Y {</p></li><li data-node-id="20251220180742-hg13283"><p>  abstract method(p: string)  //编译时错误：抽象方法只能在抽象类内。</p></li><li><p>}</p></li></ol></pre>

## 接口

接口声明引入新类型。接口是定义代码协定的常见方式。

任何类的实例，只要实现了特定接口，即可通过该接口实现多态。

接口通常包含属性和方法的声明。

示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface Style {</p></li><li data-node-id="20251220180742-r5h28sm"><p>  color: string; // 属性</p></li><li><p>}</p></li><li data-node-id="20251220180742-9t4oi2m"><p>interface AreaSize {</p></li><li><p>  calculateAreaSize(): number; // 方法的声明</p></li><li data-node-id="20251220180742-gpnqvij"><p>  someMethod(): void;     // 方法的声明</p></li><li><p>}</p></li></ol></pre>

实现接口的类示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// 接口：</p></li><li data-node-id="20251220180742-vtrzylv"><p>interface AreaSize {</p></li><li><p>  calculateAreaSize(): number; // 方法的声明</p></li><li data-node-id="20251220180742-2987h9x"><p>  someMethod(): void;     // 方法的声明</p></li><li><p>}</p></li><li data-node-id="20251220180742-1lh19kz"></li><li><p>// 实现：</p></li><li data-node-id="20251220180742-kpk191p"><p>class RectangleSize implements AreaSize {</p></li><li><p>  private width: number = 0;</p></li><li data-node-id="20251220180742-3m4pe46"><p>  private height: number = 0;</p></li><li><p>  someMethod(): void {</p></li><li data-node-id="20251220180742-zsoy6o6"><p>    console.info('someMethod called');</p></li><li><p>  }</p></li><li data-node-id="20251220180742-fq2ggaj"><p>  calculateAreaSize(): number {</p></li><li><p>    this.someMethod(); // 调用另一个方法并返回结果</p></li><li data-node-id="20251220180742-sqkkmvm"><p>    return this.width * this.height;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-fkev79k"><p>}</p></li></ol></pre>

### 接口属性

接口属性可以是字段、getter、setter或getter和setter组合的形式。

属性字段只是getter/setter对的便捷写法。以下表达方式是等价的：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface Style {</p></li><li data-node-id="20251220180742-kvdaacn"><p>  color: string;</p></li><li><p>}</p></li></ol></pre>

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface Style {</p></li><li data-node-id="20251220180742-hvnur94"><p>  get color(): string;</p></li><li><p>  set color(x: string);</p></li><li data-node-id="20251220180742-un6jbtb"><p>}</p></li></ol></pre>

实现接口的类也可以使用以下两种方式：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface Style {</p></li><li data-node-id="20251220180742-27kqkct"><p>  color: string;</p></li><li><p>}</p></li><li data-node-id="20251220180742-y7suwrh"></li><li><p>class StyledRectangle implements Style {</p></li><li data-node-id="20251220180742-pq0ynwe"><p>  color: string = '';</p></li><li><p>}</p></li></ol></pre>

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface Style {</p></li><li data-node-id="20251220180742-xnoqfes"><p>  color: string;</p></li><li><p>}</p></li><li data-node-id="20251220180742-l1xyexx"></li><li><p>class StyledRectangle implements Style {</p></li><li data-node-id="20251220180742-ipptu2r"><p>  private _color: string = '';</p></li><li><p>  get color(): string { return this._color; }</p></li><li data-node-id="20251220180742-ll7470v"><p>  set color(x: string) { this._color = x; }</p></li><li><p>}</p></li></ol></pre>

### 接口继承

接口可以继承其他接口，示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface Style {</p></li><li data-node-id="20251220180742-dnt9kv2"><p>  color: string;</p></li><li><p>}</p></li><li data-node-id="20251220180742-uspjpjm"></li><li><p>interface ExtendedStyle extends Style {</p></li><li data-node-id="20251220180742-o63dalt"><p>  width: number;</p></li><li><p>}</p></li></ol></pre>

继承接口包含被继承接口的所有属性和方法，还可以添加自己的属性和方法。

### 抽象类和接口

抽象类与接口都无法实例化。抽象类是类的抽象，抽象类用来捕捉子类的通用特性，接口是行为的抽象。在ArkTS语法中抽象类与接口的区别如下：

* 一个类只能继承一个抽象类，而一个类可以实现一个或多个接口；

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// Bird类继承Animal抽象类并实现多个接口CanFly、CanSwim</p></li><li data-node-id="20251220180742-dby54fo"><p>class Bird extends Animal implements CanFly, CanSwim {</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-a8j9en9"><p>}</p></li></ol></pre>

* 接口中不能含有静态代码块以及静态方法，而抽象类可以有静态代码块和静态方法；

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface MyInterface {</p></li><li data-node-id="20251220180742-xtoi6x7"><p>    // 错误：接口中不能包含静态成员</p></li><li><p>    static staticMethod(): void;</p></li><li data-node-id="20251220180742-0xd05p1"></li><li><p>    // 错误：接口中不能包含静态代码块</p></li><li data-node-id="20251220180742-sycl1sr"><p>    static { console.info('static'); };</p></li><li><p>}</p></li><li data-node-id="20251220180742-0xleaqy"></li><li><p>abstract class MyAbstractClass {</p></li><li data-node-id="20251220180742-18wv389"><p>    // 正确：抽象类可以有静态方法</p></li><li><p>    static staticMethod(): void { console.info('static'); }</p></li><li data-node-id="20251220180742-d3hleej"></li><li><p>    // 正确：抽象类可以有静态代码块</p></li><li data-node-id="20251220180742-33tuxgc"><p>    static { console.info('static initialization block'); }</p></li><li><p>}</p></li></ol></pre>

* 抽象类里面可以有方法的实现，但是接口没有方法的实现，是完全抽象的；

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>abstract class MyAbstractClass {</p></li><li data-node-id="20251220180742-2og2y2q"><p>   // 正确：抽象类里面可以有方法的实现</p></li><li><p>   func(): void { console.info('func'); }</p></li><li data-node-id="20251220180742-6s1t8by"><p>}</p></li><li><p>interface MyInterface {</p></li><li data-node-id="20251220180742-bj3x5tz"><p>   // 错误：接口没有方法的实现，是完全抽象的</p></li><li><p>   func(): void { console.info('func'); }</p></li><li data-node-id="20251220180742-h4w6ab0"><p>}</p></li></ol></pre>

* 抽象类可以有构造函数，而接口不能有构造函数。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>abstract class MyAbstractClass {</p></li><li data-node-id="20251220180742-gi9175g"><p>  constructor(){}  // 正确：抽象类可以有构造函数</p></li><li><p>}</p></li><li data-node-id="20251220180742-iupmv0f"><p>interface MyInterface {</p></li><li><p>  constructor(); // 错误：接口中不能有构造函数</p></li><li data-node-id="20251220180742-87rrcyn"><p>}</p></li></ol></pre>

## 泛型类型和函数

泛型类型和函数使代码能够以类型安全的方式操作多种数据类型，而无需为每种类型编写重复的逻辑。

### 泛型类和接口

类和接口可以定义为泛型，将参数添加到类型定义中。如以下示例中的类型参数Element：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class CustomStack<Element> {</p></li><li data-node-id="20251220180742-v12bey6"><p>  public push(e: Element):void {</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-m55llui"><p>  }</p></li><li><p>}</p></li></ol></pre>

要使用类型CustomStack，必须为每个类型参数指定类型实参：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let s = new CustomStack<string>();</p></li><li data-node-id="20251220180742-gbief8t"><p>s.push('hello');</p></li></ol></pre>

编译器在使用泛型类型和函数时会确保类型安全。参见以下示例：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let s = new CustomStack<string>();</p></li><li data-node-id="20251220180742-k3qkv0x"><p>s.push(55); // 将会产生编译时错误</p></li></ol></pre>

### 泛型约束

泛型类型的类型参数可以被限制只能取某些特定的值。例如，MyHashMap<Key, Value>这个类中的Key类型参数必须具有hash方法。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>interface Hashable {</p></li><li data-node-id="20251220180742-a122j6n"><p>  hash(): number;</p></li><li><p>}</p></li><li data-node-id="20251220180742-19kogl6"><p>class MyHashMap<Key extends Hashable, Value> {</p></li><li><p>  public set(k: Key, v: Value) {</p></li><li data-node-id="20251220180742-0pwab4l"><p>    let h = k.hash();</p></li><li><p>    // ...其他代码...</p></li><li data-node-id="20251220180742-fkwnk74"><p>  }</p></li><li><p>}</p></li></ol></pre>

在上面的例子中，Key类型扩展了Hashable，Hashable接口的所有方法都可以为key调用。

### 泛型函数

使用泛型函数可编写更通用的代码。比如返回数组最后一个元素的函数：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function last(x: number[]): number {</p></li><li data-node-id="20251220180742-zf5g4o6"><p>  return x[x.length - 1];</p></li><li><p>}</p></li><li data-node-id="20251220180742-smr64je"><p>last([1, 2, 3]); // 3</p></li></ol></pre>

如果需要为任何数组定义相同的函数，使用类型参数将该函数定义为泛型：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>function last<T>(x: T[]): T {</p></li><li data-node-id="20251220180742-qqvl929"><p>  return x[x.length - 1];</p></li><li><p>}</p></li></ol></pre>

现在，该函数可以与任何数组一起使用。

在函数调用中，类型实参可以显式或隐式设置：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// 显式设置的类型实参</p></li><li data-node-id="20251220180742-x2rfjo5"><p>let res1: string = last<string>(['aa', 'bb']);</p></li><li><p>let res2: number = last<number>([1, 2, 3]);</p></li><li data-node-id="20251220180742-zk0ufkr"></li><li><p>// 隐式设置的类型实参</p></li><li data-node-id="20251220180742-ez4jr2a"><p>// 编译器根据调用参数的类型来确定类型实参</p></li><li><p>let res3: number = last([1, 2, 3]);</p></li></ol></pre>

### 泛型默认值

泛型类型的类型参数可以设置默认值，这样无需指定实际类型实参，直接使用泛型类型名称即可。以下示例展示了类和函数的这一特性。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class SomeType {}</p></li><li data-node-id="20251220180742-e52tzyw"><p>interface Interface <T1 = SomeType> { }</p></li><li><p>class Base <T2 = SomeType> { }</p></li><li data-node-id="20251220180742-mxks5rw"><p>class Derived1 extends Base implements Interface { }</p></li><li><p>// Derived1在语义上等价于Derived2</p></li><li data-node-id="20251220180742-s3xhmj9"><p>class Derived2 extends Base<SomeType> implements Interface<SomeType> { }</p></li><li></li><li data-node-id="20251220180742-him0q3f"><p>function foo<T = number>(): void {</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-v7626w7"><p>}</p></li><li><p>foo();</p></li><li data-node-id="20251220180742-pzwbdgn"><p>// 此函数在语义上等价于下面的调用</p></li><li><p>foo<number>();</p></li></ol></pre>

## 空安全

默认情况下，ArkTS中的所有类型都不允许为空，这类似于TypeScript的(strictNullChecks)模式，但规则更严格。

在下面的示例中，所有行都会导致编译时错误：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let x: number = null;    // 编译时错误</p></li><li data-node-id="20251220180742-i5526ox"><p>let y: string = null;    // 编译时错误</p></li><li><p>let z: number[] = null;  // 编译时错误</p></li></ol></pre>

可以为空值的变量定义为联合类型T | null。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>let x: number | null = null;</p></li><li data-node-id="20251220180742-z2l54fx"><p>x = 1;    // ok</p></li><li><p>x = null; // ok</p></li><li data-node-id="20251220180742-b3r2ybe"><p>if (x != null) { /* do something */ }</p></li></ol></pre>

### 非空断言运算符

后缀运算符!可用于断言其操作数为非空。

当应用于可空类型的值时，编译时类型会变为非空类型。例如，类型从T | null变为T：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class A {</p></li><li data-node-id="20251220180742-4jzywh0"><p>  value: number = 0;</p></li><li><p>}</p></li><li data-node-id="20251220180742-n0pz8zw"></li><li><p>function foo(a: A | null) {</p></li><li data-node-id="20251220180742-gi007jb"><p>  a.value;   // 编译时错误：无法访问可空值的属性</p></li><li><p>  a!.value;  // 编译通过，如果运行时a的值非空，可以访问到a的属性；如果运行时a的值为空，则发生运行时异常</p></li><li data-node-id="20251220180742-mm3pquc"><p>}</p></li></ol></pre>

### 空值合并运算符

空值合并二元运算符??用于检查左侧表达式的求值是否等于null或者undefined。如果是，则表达式的结果为右侧表达式；否则，结果为左侧表达式。

换句话说，a ?? b等价于三元运算符(a != null && a != undefined) ? a : b。

在以下示例中，getNick方法返回已设置的昵称。如果未设置，则返回空字符串。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-niunzke"><p>  // ...</p></li><li><p>  nick: string | null = null;</p></li><li data-node-id="20251220180742-2egzc4j"><p>  getNick(): string {</p></li><li><p>    return this.nick ?? '';</p></li><li data-node-id="20251220180742-im9zi2o"><p>  }</p></li><li><p>}</p></li></ol></pre>

### 可选链

访问对象属性时，如果属性是undefined或null，可选链运算符返回undefined。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-p4diro4"><p>  nick: string | null = null;</p></li><li><p>  spouse?: Person</p></li><li data-node-id="20251220180742-7qducpa"></li><li><p>  setSpouse(spouse: Person): void {</p></li><li data-node-id="20251220180742-9ugpkxn"><p>    this.spouse = spouse;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-ion9xnu"></li><li><p>  getSpouseNick(): string | null | undefined {</p></li><li data-node-id="20251220180742-nnlzclr"><p>    return this.spouse?.nick;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-tyaq7bk"></li><li><p>  constructor(nick: string) {</p></li><li data-node-id="20251220180742-wyzdqqy"><p>    this.nick = nick;</p></li><li><p>    this.spouse = undefined;</p></li><li data-node-id="20251220180742-088i8mz"><p>  }</p></li><li><p>}</p></li></ol></pre>

 **说明** ：getSpouseNick的返回类型必须为string | null | undefined，因为该方法在某些情况下会返回null或undefined。

可选链可以任意长，可以包含任意数量的?.运算符。

在以下示例中，如果Person实例的spouse属性不为空，并且spouse的nick属性也不为空时，输出spouse.nick。否则，输出undefined。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Person {</p></li><li data-node-id="20251220180742-9n0bdo7"><p>  nick: string | null = null;</p></li><li><p>  spouse?: Person;</p></li><li data-node-id="20251220180742-x5yc3gz"></li><li><p>  constructor(nick: string) {</p></li><li data-node-id="20251220180742-du0o2v9"><p>    this.nick = nick;</p></li><li><p>    this.spouse = undefined;</p></li><li data-node-id="20251220180742-1ny9hcs"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-l1kx7vj"></li><li><p>let p: Person = new Person('Alice');</p></li><li data-node-id="20251220180742-1xuak7p"><p>p.spouse?.nick; // undefined</p></li></ol></pre>

## 模块

程序可划分为多组编译单元或模块。

每个模块都有其自己的作用域，即在模块中创建的任何声明（变量、函数、类等）在该模块之外都不可见，除非它们被显式导出。

与此相对，必须首先将另一个模块导出的变量、函数、类、接口等导入到当前模块中。

### 导出

可以使用关键字export导出顶层的声明。

未导出的声明名称被视为私有名称，只能在声明该名称的模块中使用。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>export class Point {</p></li><li data-node-id="20251220180742-cpkcg9t"><p>  x: number = 0;</p></li><li><p>  y: number = 0;</p></li><li data-node-id="20251220180742-ry59klh"><p>  constructor(x: number, y: number) {</p></li><li><p>    this.x = x;</p></li><li data-node-id="20251220180742-3dbmc7n"><p>    this.y = y;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-t9u8xb1"><p>}</p></li><li><p>export let Origin = new Point(0, 0);</p></li><li data-node-id="20251220180742-ljsvt4d"><p>export function Distance(p1: Point, p2: Point): number {</p></li><li><p>  return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));</p></li><li data-node-id="20251220180742-8w0xbbp"><p>}</p></li></ol></pre>

**导出默认导出的对象**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class Demo{</p></li><li data-node-id="20251220180742-cgyvmwg"><p>  constructor(){</p></li><li><p>  }</p></li><li data-node-id="20251220180742-nsgklvn"><p>}</p></li><li><p>export default new Demo();</p></li></ol></pre>

### 导入

**静态导入**

导入声明用于导入从其他模块导出的实体，并在当前模块中提供其绑定。导入声明由两部分组成：

* 导入路径，用于指定导入的模块；
* 导入绑定，用于定义导入的模块中的可用实体集和使用形式（限定或不限定使用）。

导入绑定可以有几种形式。

假设模块的路径为“./utils”，并且导出了实体“X”和“Y”。

导入绑定* as A表示绑定名称“A”，通过A.name可访问从导入路径指定的模块导出的所有实体：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>import * as Utils from './utils';</p></li><li data-node-id="20251220180742-81mncov"><p>Utils.X // 表示来自Utils的X</p></li><li><p>Utils.Y // 表示来自Utils的Y</p></li></ol></pre>

导入绑定{ ident1, ..., identN }表示将导出的实体与指定名称绑定，该名称可以用作简单名称：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>import { X, Y } from './utils';</p></li><li data-node-id="20251220180742-0lhniwc"><p>X // 表示来自utils的X</p></li><li><p>Y // 表示来自utils的Y</p></li></ol></pre>

如果标识符列表定义了ident as alias，则实体ident将绑定在名称alias下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>import { X as Z, Y } from './utils';</p></li><li data-node-id="20251220180742-lajhc16"><p>Z // 表示来自Utils的X</p></li><li><p>Y // 表示来自Utils的Y</p></li><li data-node-id="20251220180742-steljop"><p>X // 编译时错误：'X'不可见</p></li></ol></pre>

**动态导入**

在应用开发的有些场景中，如果希望根据条件导入模块或者按需导入模块，可以使用动态导入代替静态导入。

import()语法被称为动态导入（dynamic import），是一种类似函数的表达式，用于动态导入模块。调用这种方式，会返回一个promise。

如下例所示，import(modulePath)可以加载模块并返回一个promise，该promise resolve为一个包含其所有导出的模块对象。该表达式可以在代码中的任意位置调用。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// Calc.ts</p></li><li data-node-id="20251220180742-ztk1gn8"><p>export function add(a:number, b:number):number {</p></li><li><p>  let c = a + b;</p></li><li data-node-id="20251220180742-9gwt7o9"><p>  console.info('Dynamic import, %d + %d = %d', a, b, c);</p></li><li><p>  return c;</p></li><li data-node-id="20251220180742-wpnih9q"><p>}</p></li><li></li><li data-node-id="20251220180742-wb3p5nu"><p>// Index.ets</p></li><li><p>import('./Calc').then((obj: ESObject) => {</p></li><li data-node-id="20251220180742-10h4hfr"><p>  console.info(obj.add(3, 5));</p></li><li><p>}).catch((err: Error) => {</p></li><li data-node-id="20251220180742-34lvjdx"><p>  console.error('Module dynamic import error: ', err);</p></li><li><p>});</p></li></ol></pre>

如果在异步函数中，可以使用let module = await import(modulePath)。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// say.ts</p></li><li data-node-id="20251220180742-ep2lt3p"><p>export function hi() {</p></li><li><p>  console.info('Hello');</p></li><li data-node-id="20251220180742-vy6l6vi"><p>}</p></li><li><p>export function bye() {</p></li><li data-node-id="20251220180742-ab8se38"><p>  console.info('Bye');</p></li><li><p>}</p></li></ol></pre>

那么，可以像下面这样进行动态导入：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>async function test() {</p></li><li data-node-id="20251220180742-j1fvgv6"><p>  let ns = await import('./say');</p></li><li><p>  let hi = ns.hi;</p></li><li data-node-id="20251220180742-f8e5xod"><p>  let bye = ns.bye;</p></li><li><p>  hi();</p></li><li data-node-id="20251220180742-i20kq2n"><p>  bye();</p></li><li><p>}</p></li></ol></pre>

更多的使用动态import的业务场景和使用实例见[动态import](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-dynamic-import)。

**导入HarmonyOS SDK的开放能力**

HarmonyOS SDK提供的开放能力（接口）也需要在导入声明后使用。可直接导入接口模块来使用该模块内的所有接口能力，例如：

<pre class="ts prettyprint linenums hljs language-typescript" hw-language="ts" data-highlighted="yes"><ol class="linenums"><li><p>import UIAbility from '@ohos.app.ability.UIAbility';</p></li></ol></pre>

从HarmonyOS
 NEXT Developer Preview
1版本开始引入Kit概念。SDK对同一个Kit下的接口模块进行了封装，开发者在示例代码中可通过导入Kit的方式来使用Kit所包含的接口能力。其中，Kit封装的接口模块可查看SDK目录下Kit子目录中各Kit的定义。在代码开发中，推荐通过导入Kit方式使用开放能力。

通过导入Kit方式使用开放能力有三种方式：

* 方式一：导入Kit下单个模块的接口能力。例如：
* <pre class="ts prettyprint linenums hljs language-typescript" hw-language="ts" data-highlighted="yes"><ol class="linenums"><li><p>import { UIAbility } from '@kit.AbilityKit';</p></li></ol></pre>
* 方式二：导入Kit下多个模块的接口能力。例如：
* <pre class="ts prettyprint linenums hljs language-typescript" hw-language="ts" data-highlighted="yes"><ol class="linenums"><li><p>import { UIAbility, Ability, Context } from '@kit.AbilityKit';</p></li></ol></pre>
* 方式三：导入Kit包含的所有模块的接口能力。例如：
* <pre class="ts prettyprint linenums hljs language-typescript" hw-language="ts" data-highlighted="yes"><ol class="linenums"><li><p>import * as module from '@kit.AbilityKit';</p></li></ol></pre>

  其中，“module”为别名，可自定义，然后通过该名称调用模块的接口。
  说明

  方式三可能会导入过多无需使用的模块，导致编译后的HAP包太大，占用过多资源，请谨慎使用。

### 顶层语句

顶层语句是指在模块最外层编写的语句，不被任何函数、类或块级作用域包裹。这些语句包括变量声明、函数声明和表达式。

## 关键字

### this

关键字this只能在类的实例方法中使用。

**示例**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class A {</p></li><li data-node-id="20251220180742-yqbbzel"><p>  count: string = 'a';</p></li><li><p>  m(i: string): void {</p></li><li data-node-id="20251220180742-so83cqu"><p>    this.count = i;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-2ci3ase"><p>}</p></li></ol></pre>

使用限制：

* 不支持this类型
* 不支持在函数和类的静态方法中使用this

**示例**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>class A {</p></li><li data-node-id="20251220180742-e96bnhm"><p>  n: number = 0;</p></li><li><p>  f1(arg1: this) {} // 编译时错误，不支持this类型</p></li><li data-node-id="20251220180742-bs8eded"><p>  static f2(arg1: number) {</p></li><li><p>    this.n = arg1;  // 编译时错误，不支持在类的静态方法中使用this</p></li><li data-node-id="20251220180742-bou9d7h"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-lh2hcqs"></li><li><p>function foo(arg1: number) {</p></li><li data-node-id="20251220180742-dv4a4n3"><p>  this.n = i;       // 编译时错误，不支持在函数中使用this</p></li><li><p>}</p></li></ol></pre>

关键字this的指向:

* 调用实例方法的对象
* 正在构造的对象

## 注解

注解（Annotation）是一种语言特性，它通过添加元数据来改变应用声明的语义。

注解的声明和使用如下所示：

**示例：**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// 注解的声明：</p></li><li data-node-id="20251220180742-t0yfwdt"><p>@interface ClassAuthor {</p></li><li><p>  authorName: string</p></li><li data-node-id="20251220180742-ul6upfz"><p>}</p></li><li></li><li data-node-id="20251220180742-emlt7f1"><p>// 注解的使用：</p></li><li><p>@ClassAuthor({authorName: "Bob"})</p></li><li data-node-id="20251220180742-rqikqah"><p>class MyClass {</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-ipwty50"><p>}</p></li></ol></pre>

* 使用@interface声明注解。
* 注解ClassAuthor需要将元信息添加到类声明中。
* 注解必须放置在声明之前。
* 注解可以包含上述示例中所示的参数。

对于要使用的注解，其名称必须以符号@（例如：@MyAnno）为前缀。符号@和名称之间不允许有空格和行分隔符。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>ClassAuthor({authorName: "Bob"}) // 编译错误：注解需要'@'为前缀</p></li><li data-node-id="20251220180742-j8ryjhq"><p>@ ClassAuthor({authorName: "Bob"}) // 编译错误：符号`@`和名称之间不允许有空格和行分隔符</p></li></ol></pre>

如果在使用位置无法访问注解名称，则会发生编译错误。

注解声明可以导出并在其他文件中使用。

多个注解可以应用于同一个声明（注解间的先后顺序不影响使用）。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@MyAnno()</p></li><li data-node-id="20251220180742-l1ju6mp"><p>@ClassAuthor({authorName: "John Smith"})</p></li><li><p>class MyClass {</p></li><li data-node-id="20251220180742-j31a8wf"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

注解不是Typescript中的特性，只能在.ets/.d.ets文件中使用。

注意

应用开发中，在[release模式下构建](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/ide-hvigor-build-har#section19788284410)源码HAR，并同时[开启混淆](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/source-obfuscation)时，由于编译产物为JS文件，而在JS中没有注解的实现机制，因此会在编译过程中被移除，导致无法通过注解实现AOP插桩。

为避免因此引起的功能异常，禁止在JS HAR(编译产物中存在JS的HAR包)中使用注解。

如果需要在release模式并且开启混淆的情况下构建含有注解的HAR包，可以构建[字节码HAR](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/ide-hvigor-build-har#section16598338112415)。

### 用户自定义注解

**从API version 20及之后版本，支持用户自定义注解。**

**用户自定义注解的声明**

用户自定义注解的定义与interface的定义类似，其中的interface关键字以符号@为前缀。

注解字段仅限于下面列举的类型：

* number
* boolean
* string
* 枚举
* 以上类型的数组说明

  * 如果使用其他类型用作注解字段的类型，则会发生编译错误。
  * 注解字段类型不支持BigInt。

注解字段的默认值必须使用常量表达式来指定。

常量表达式的场景如下所示：

* 数字字面量
* 布尔字面量
* 字符串字面量
* 枚举值（需要在编译时确定值）
* 以上常量组成的数组
  说明

  如果枚举值不能在编译时确定，会编译报错。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.ts</p></li><li data-node-id="20251220180742-x5uql35"><p>export enum X {</p></li><li><p>  x = foo(); // x不是编译时能确定的常量</p></li><li data-node-id="20251220180742-asb2mri"><p>}</p></li><li></li><li data-node-id="20251220180742-dbcxcfh"><p>// b.ets</p></li><li><p>import {X} from './a';</p></li><li data-node-id="20251220180742-2bof3s0"></li><li><p>@interface Position {</p></li><li data-node-id="20251220180742-vpyxi03"><p>  data: number = X.x; // 编译错误：注解字段的默认值必须使用常量表达式</p></li><li><p>}</p></li></ol></pre>

注解必须定义在顶层作用域（top-level），否则会出现编译报错。

注解的名称不能与注解定义所在作用域内可见的其他实体名称相同，否则会出现编译报错。

注解不支持类型Typescript中的合并，否则会出现编译报错。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>namespace ns {</p></li><li data-node-id="20251220180742-v3qk5pk"><p>  @interface MataInfo { // 编译错误：注解必须定义在顶层作用域</p></li><li><p>    // ...</p></li><li data-node-id="20251220180742-4oyiflj"><p>  }</p></li><li><p>}</p></li><li data-node-id="20251220180742-y5yu62r"></li><li><p>@interface Position {</p></li><li data-node-id="20251220180742-2h5lz56"><p>  // ...</p></li><li><p>}</p></li><li data-node-id="20251220180742-v9siurc"></li><li><p>class Position { // 编译错误：注解的名称不能与注解定义所在作用域内可见的其他实体名称相同</p></li><li data-node-id="20251220180742-1qxcrx8"><p>  // ...</p></li><li><p>}</p></li><li data-node-id="20251220180742-euwzdrg"></li><li><p>@interface ClassAuthor {</p></li><li data-node-id="20251220180742-wond749"><p>  name: string;</p></li><li><p>}</p></li><li data-node-id="20251220180742-in2nfn1"></li><li><p>@interface ClassAuthor { // 编译错误：注解的名称不能与注解定义所在作用域内可见的其他实体名称相同</p></li><li data-node-id="20251220180742-3udy6rs"><p>  data: string;</p></li><li><p>}</p></li></ol></pre>

注解不是类型，把注解当类型使用时会出现编译报错（例如：对注解使用类型别名）。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@interface Position {}</p></li><li data-node-id="20251220180742-nemsyx2"><p>type Pos = Position; // 编译错误：注解不是类型</p></li></ol></pre>

注解不支持在类的getter和setter方法中添加，若添加注解会编译报错。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@interface ClassAuthor {</p></li><li data-node-id="20251220180742-9ivcr57"><p>  authorName: string;</p></li><li><p>}</p></li><li data-node-id="20251220180742-6jlqhnx"></li><li><p>@ClassAuthor({authorName: 'John Smith'})</p></li><li data-node-id="20251220180742-zmvls9r"><p>class MyClass {</p></li><li><p>  private _name: string = 'Bob';</p></li><li data-node-id="20251220180742-xib9nm6"></li><li><p>  @ClassAuthor({authorName: 'John Smith'}) // 编译错误：注解不支持在类的getter和setter方法添加</p></li><li data-node-id="20251220180742-rd22sns"><p>  get name() {</p></li><li><p>    return this._name;</p></li><li data-node-id="20251220180742-o5zvnop"><p>  }</p></li><li></li><li data-node-id="20251220180742-hv6pl2o"><p>  @ClassAuthor({authorName: 'John Smith'}) // 编译错误：注解不支持在类的getter和setter方法添加</p></li><li><p>  set name(authorName: string) {</p></li><li data-node-id="20251220180742-uad5qx5"><p>    this._name = authorName;</p></li><li><p>  }</p></li><li data-node-id="20251220180742-m018wrm"><p>}</p></li></ol></pre>

**用户自定义注解的使用**

注解声明示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@interface ClassPreamble {</p></li><li data-node-id="20251220180742-6q9m6yo"><p>  authorName: string;</p></li><li><p>  revision: number = 1;</p></li><li data-node-id="20251220180742-ejyahiq"><p>}</p></li><li><p>@interface MyAnno {}</p></li></ol></pre>

当前仅允许对class declarations和method declarations使用注解，对类和方法可以同时使用同一个注解。

注解用法示例如下：

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@ClassPreamble({authorName: "John", revision: 2})</p></li><li data-node-id="20251220180742-wayhf0g"><p>class C1 {</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-hdb5nlt"><p>}</p></li><li></li><li data-node-id="20251220180742-18g7o0p"><p>@ClassPreamble({authorName: "Bob"}) // revision的默认值为1</p></li><li><p>class C2 {</p></li><li data-node-id="20251220180742-h376v1u"><p>  // ...</p></li><li><p>}</p></li><li data-node-id="20251220180742-q2jjzpj"></li><li><p>@MyAnno() // 对类和方法可以同时使用同一个注解</p></li><li data-node-id="20251220180742-p07c5xx"><p>class C3 {</p></li><li><p>  @MyAnno()</p></li><li data-node-id="20251220180742-97ycyni"><p>  foo() {}</p></li><li><p>  @MyAnno()</p></li><li data-node-id="20251220180742-hg3jf5h"><p>  static bar() {}</p></li><li><p>}</p></li></ol></pre>

注解中的字段顺序不影响使用。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@ClassPreamble({authorName: "John", revision: 2})</p></li><li data-node-id="20251220180742-qegf8cf"><p>// the same as:</p></li><li><p>@ClassPreamble({revision: 2, authorName: "John"})</p></li></ol></pre>

使用注解时，必须给所有没有默认值的字段赋值，否则会发生编译错误。

说明

赋值应当与注解声明的类型一致，所赋的值与注解字段默认值的要求一样，只能使用常量表达式。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@ClassPreamble() // 编译错误：authorName字段未定义</p></li><li data-node-id="20251220180742-eh99hbq"><p>class C1 {</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-ohwszrb"><p>}</p></li></ol></pre>

如果注解中定义了数组类型的字段，则使用数组字面量来设置该字段的值。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@interface ClassPreamble {</p></li><li data-node-id="20251220180742-ouwhnx7"><p>  authorName: string;</p></li><li><p>  revision: number = 1;</p></li><li data-node-id="20251220180742-fqdl4hs"><p>  reviewers: string[];</p></li><li><p>}</p></li><li data-node-id="20251220180742-hwd31uo"></li><li><p>@ClassPreamble(</p></li><li data-node-id="20251220180742-iwpzi80"><p>  {</p></li><li><p>    authorName: "Alice",</p></li><li data-node-id="20251220180742-8m00wmx"><p>    reviewers: ["Bob", "Clara"]</p></li><li><p>  }</p></li><li data-node-id="20251220180742-p5r0bfu"><p>)</p></li><li><p>class C3 {</p></li><li data-node-id="20251220180742-7x8e6vw"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

如果不需要定义注解字段，可以省略注解名称后的括号。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@MyAnno</p></li><li data-node-id="20251220180742-b264ydj"><p>class C4 {</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-8dh22kq"><p>}</p></li></ol></pre>

**导入和导出注解**

注解也可以被导入导出。针对导出，当前仅支持在定义时的导出，即export @interface的形式。

**示例：**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>export @interface MyAnno {}</p></li></ol></pre>

针对导入，当前仅支持import {}和import * as两种方式。

**示例：**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.ets</p></li><li data-node-id="20251220180742-69e0vu5"><p>export @interface MyAnno {}</p></li><li><p>export @interface ClassAuthor {}</p></li><li data-node-id="20251220180742-lhyvs6i"></li><li><p>// b.ets</p></li><li data-node-id="20251220180742-3au6qz4"><p>import { MyAnno } from './a';</p></li><li><p>import * as ns from './a';</p></li><li data-node-id="20251220180742-724fatx"></li><li><p>@MyAnno</p></li><li data-node-id="20251220180742-53yr8vg"><p>@ns.ClassAuthor</p></li><li><p>class C {</p></li><li data-node-id="20251220180742-6yq9dgw"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

* 不允许在import中对注解进行重命名。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>import { MyAnno as Anno } from './a'; // 编译错误：不允许在import中对注解进行重命名</p></li></ol></pre>

不允许对注解使用任何其他形式的 import/export，这会导致编译报错。

* 由于注解不是类型，因此禁止使用type符号进行导入和导出。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>import type { MyAnno } from './a'; // 编译错误：注解不允许使用'type'符号进行导入和导出</p></li></ol></pre>

* 如果仅从模块导入注解，则不会触发模块的副作用。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.ets</p></li><li data-node-id="20251220180742-ufnhtbo"><p>export @interface Anno {}</p></li><li></li><li data-node-id="20251220180742-f55leyq"><p>export @interface ClassAuthor {}</p></li><li></li><li data-node-id="20251220180742-ltsxgl8"><p>console.info('hello');</p></li><li></li><li data-node-id="20251220180742-l250vc4"><p>// b.ets</p></li><li><p>import { Anno } from './a';</p></li><li data-node-id="20251220180742-l8275u6"><p>import * as ns from './a';</p></li><li></li><li data-node-id="20251220180742-2df36vy"><p>// 仅引用了Anno注解，不会导致a.ets的console.info执行</p></li><li><p>class X {</p></li><li data-node-id="20251220180742-i4ja6ib"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

**.d.ets文件中的注解**

注解可以出现在.d.ets文件中。

可以在.d.ets文件中用环境声明（ambient declaration）来声明注解。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>ambientAnnotationDeclaration:</p></li><li data-node-id="20251220180742-n2p4tfa"><p>  'declare' userDefinedAnnotationDeclaration</p></li><li><p>  ;</p></li></ol></pre>

**示例：**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.d.ets</p></li><li data-node-id="20251220180742-188n3rk"><p>export declare @interface ClassAuthor {}</p></li></ol></pre>

上述声明中：

* 不会引入新的注解定义，而是提供注解的类型信息。
* 注解需定义在其他源代码文件中。
* 注解的环境声明和实现需要完全一致，包括字段的类型和默认值。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.d.ets</p></li><li data-node-id="20251220180742-194pgzo"><p>export declare @interface NameAnno{name: string = ""}</p></li><li></li><li data-node-id="20251220180742-ukp4r2i"><p>// a.ets</p></li><li><p>export @interface NameAnno{name: string = ""} // ok</p></li></ol></pre>

环境声明的注解和class类似，也可以被import使用。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.d.ets</p></li><li data-node-id="20251220180742-pv3awmp"><p>export declare @interface MyAnno {}</p></li><li></li><li data-node-id="20251220180742-9cso7if"><p>// b.ets</p></li><li><p>import { MyAnno } from './a';</p></li><li data-node-id="20251220180742-whe97mn"></li><li><p>@MyAnno</p></li><li data-node-id="20251220180742-28j5wrc"><p>class C {</p></li><li><p>  // ...</p></li><li data-node-id="20251220180742-qaqmukf"><p>}</p></li></ol></pre>

**编译器自动生成的.d.ets文件**

当编译器根据ets代码自动生成.d.ets文件时，存在以下2种情况。

1. 当注解定义被导出时，源代码中的注解定义会在.d.ets文件中保留。

* <pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.ets</p></li><li data-node-id="20251220180742-hsarmwo"><p>export @interface ClassAuthor {}</p></li><li></li><li data-node-id="20251220180742-ys0gxn9"><p>@interface MethodAnno { // 没导出</p></li><li><p>  data: number;</p></li><li data-node-id="20251220180742-u0y4l9a"><p>}</p></li><li></li><li data-node-id="20251220180742-2xd1z9w"><p>// a.d.ets 编译器生成的声明文件</p></li><li><p>export declare @interface ClassAuthor {}</p></li></ol></pre>
* 当下面所有条件成立时，源代码中实体的注解实例会在.d.ets文件中保留。
  2.1 注解的定义被导出（import的注解也算作被导出）。
  2.2 如果实体是类，则类被导出。
  2.3 如果实体是方法，则类被导出，并且方法不是私有方法。

1. <pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// a.ets</p></li><li data-node-id="20251220180742-m85q50l"><p>import { ClassAuthor } from './author';</p></li><li></li><li data-node-id="20251220180742-r0ko588"><p>export @interface MethodAnno {</p></li><li><p>  data: number = 0;</p></li><li data-node-id="20251220180742-ryckmhx"><p>}</p></li><li></li><li data-node-id="20251220180742-zg984q6"><p>@ClassAuthor</p></li><li><p>class MyClass {</p></li><li data-node-id="20251220180742-y02rylw"><p>  @MethodAnno({data: 123})</p></li><li><p>  foo() {}</p></li><li data-node-id="20251220180742-sw2ceh9"></li><li><p>  @MethodAnno({data: 456})</p></li><li data-node-id="20251220180742-f3e2i93"><p>  private bar() {}</p></li><li><p>}</p></li><li data-node-id="20251220180742-8ixdklw"></li><li><p>// a.d.ets 编译器生成的声明文件</p></li><li data-node-id="20251220180742-73nyn44"><p>import {ClassAuthor} from "./author";</p></li><li></li><li data-node-id="20251220180742-zq7drru"><p>export declare @interface MethodAnno {</p></li><li><p>  data: number = 0;</p></li><li data-node-id="20251220180742-8yt0kew"><p>}</p></li><li></li><li data-node-id="20251220180742-lgzc3i1"><p>@ClassAuthor</p></li><li><p>export declare class MyClass {</p></li><li data-node-id="20251220180742-5xppo7h"><p>  @MethodAnno({data: 123})</p></li><li><p>  foo(): void;</p></li><li data-node-id="20251220180742-527oyjm"></li><li><p>  bar; // 私有方法不保留注解</p></li><li data-node-id="20251220180742-a5m0ilz"><p>}</p></li></ol></pre>

**开发者生成的.d.ets文件**

开发者生成的.d.ets文件中的注解信息不会自动应用到实现的源代码中。

**示例：**

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>// b.d.ets 开发者生成的声明文件</p></li><li data-node-id="20251220180742-k9s9yhv"><p>@interface ClassAuthor {}</p></li><li></li><li data-node-id="20251220180742-a2yf6hq"><p>@ClassAuthor // 声明文件中有注解</p></li><li><p>class C {</p></li><li data-node-id="20251220180742-b5zd3m3"><p>  // ...</p></li><li><p>}</p></li><li data-node-id="20251220180742-kerdnn2"></li><li><p>// b.ets 开发者对声明文件实现的源代码</p></li><li data-node-id="20251220180742-au4qyew"><p>@interface ClassAuthor {}</p></li><li></li><li data-node-id="20251220180742-gubb8y4"><p>// 实现文件中没有注解</p></li><li><p>class C {</p></li><li data-node-id="20251220180742-3hm47m2"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

在最终编译产物中，class C没有注解。

**重复注解和继承**

同一个实体不能重复使用同一注解，否则会导致编译错误。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@MyAnno({name: "123", value: 456})</p></li><li data-node-id="20251220180742-pwd6lfz"><p>@MyAnno({name: "321", value: 654}) // 编译错误：不允许重复注释</p></li><li><p>class C {</p></li><li data-node-id="20251220180742-493rskq"><p>  // ...</p></li><li><p>}</p></li></ol></pre>

子类不会继承基类的注解，也不会继承基类方法的注解。

**注解和抽象类、抽象方法**

不支持对抽象类或抽象方法使用注解，否则将导致编译错误。

<pre class="typescript prettyprint linenums hljs language-typescript" hw-language="typescript" data-highlighted="yes"><ol class="linenums"><li><p>@MyAnno // 编译错误：不允许在抽象类和抽象方法上使用注解</p></li><li data-node-id="20251220180742-05ny944"><p>abstract class C {</p></li><li><p>  @MyAnno</p></li><li data-node-id="20251220180742-u1u0v0l"><p>  abstract foo(): void; // 编译错误：不允许在抽象类和抽象方法上使用注解</p></li><li><p>}</p></li></ol></pre>

## ArkUI支持

本节演示ArkTS为创建图形用户界面（GUI）程序提供的机制。ArkUI基于TypeScript提供了一系列扩展能力，以声明式地描述应用程序的GUI以及GUI组件间的交互。

### ArkUI示例

[MVVM代码示例](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-mvvm#代码示例)提供了一个完整的基于ArkUI的应用程序，以展示其GUI编程功能。

有关ArkUI功能的更多详细信息，请参见ArkUI[基本语法概述](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-basic-syntax-overview)。

[](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-get-started "初识ArkTS语言")

[初识ArkTS语言](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-get-started "初识ArkTS语言")

[ArkTS编程规范](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-coding-style-guide "ArkTS编程规范")

[](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-coding-style-guide "ArkTS编程规范")

相关推荐

*文档*[泛型接口](https://developer.huawei.com/consumer/cn/doc/cangjie-guides-V5/generic_interface-V5 "泛型接口")

*文档*[从Java到ArkTS的迁移指导](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/getting-started-with-arkts-for-java-programmers "从Java到ArkTS的迁移指导")

*文档*[ArkTS高性能编程实践](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-high-performance-programming "ArkTS高性能编程实践")

*文档*[oh_predicates.h](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/capi-oh-predicates-h "oh_predicates.h")

*文档*[单元测试框架使用指导](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/unittest-guidelines "单元测试框架使用指导")

*文档*[包的导入](https://developer.huawei.com/consumer/cn/doc/cangjie-guides-V5/import-V5 "包的导入")

*文档*[OH_VObject](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/capi-rdb-oh-vobject "OH_VObject")

*文档*[OH_Predicates](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/capi-rdb-oh-predicates "OH_Predicates")

*文档*[使用Node-API进行扩展能力功能开发](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/use-napi-about-extension "使用Node-API进行扩展能力功能开发")

*文档*[GraphicsAccelerate](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/_graphics_accelerate "GraphicsAccelerate")

意见反馈

**以上内容对您是否有帮助？**

**意见反馈**

如果您有其他疑问，您也可以通过开发者社区问答频道来和我们联系探讨。

[社区提问](https://developer.huawei.com/consumer/cn/forum/)[智能客服提问](https://developer.huawei.com/consumer/cn/customerService/#/bot-dev-top/faq-top/faq-talk-top)

本文导读

[基本知识](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#基本知识)

[声明](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#声明)

[类型](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#类型)

[运算符](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#运算符)

[语句](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#语句)

[函数](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#函数)

[函数声明](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#函数声明)

[可选参数](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#可选参数)

[rest参数](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#rest参数)

[返回类型](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#返回类型)

[函数的作用域](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#函数的作用域)

[函数调用](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#函数调用)

[函数类型](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#函数类型)

[箭头函数（又名Lambda函数）](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#箭头函数又名lambda函数)

[闭包](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#闭包)

[函数重载](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#函数重载)

[类](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#类)

[字段](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#字段)

[方法](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#方法)

[构造函数](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#构造函数)

[可见性修饰符](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#可见性修饰符)

[对象字面量](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#对象字面量)

[抽象类](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#抽象类)

[接口](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#接口)

[接口属性](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#接口属性)

[接口继承](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#接口继承)

[抽象类和接口](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#抽象类和接口)

[泛型类型和函数](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#泛型类型和函数)

[泛型类和接口](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#泛型类和接口)

[泛型约束](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#泛型约束)

[泛型函数](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#泛型函数)

[泛型默认值](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#泛型默认值)

[空安全](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#空安全)

[非空断言运算符](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#非空断言运算符)

[空值合并运算符](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#空值合并运算符)

[可选链](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#可选链)

[模块](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#模块)

[导出](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#导出)

[导入](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#导入)

[顶层语句](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#顶层语句)

[关键字](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#关键字)

[this](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#this)

[注解](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#注解)

[用户自定义注解](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#用户自定义注解)

[ArkUI支持](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#arkui支持)

[ArkUI示例](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/introduction-to-arkts#arkui示例)

[ ]

* [![](https://developer.huawei.com/images/foot/1xinlang.png)]()
* [![](https://developer.huawei.com/images/foot/2bz.png)]()
* [![](https://developer.huawei.com/images/foot/3wx.png)]()
* [![](https://developer.huawei.com/images/foot/4app.png)]()
* [![](https://developer.huawei.com/images/foot/5luntan.png)]()
* [![](https://developer.huawei.com/images/foot/6youxiang.png)]()

华为开发者联盟 版权所有 ©2025

[使用条款](https://developer.huawei.com/consumer/cn/devservice/use)

[华为开发者联盟用户协议](https://developer.huawei.com/consumer/cn/doc/start/useragreement-0000001494912825)

[关于华为开发者联盟与隐私的声明](https://developer.huawei.com/consumer/cn/devservice/term)

[cookies](https://consumer.huawei.com/cn/legal/cookie-policy/)

[开源软件声明](https://developer.huawei.com/consumer/cn/opensource/)
