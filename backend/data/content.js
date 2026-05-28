export const topics = [
  {
    slug: 'variables-scope',
    title: 'Variables & Scope',
    description: 'var, let, const. Hoisting, block scope, and the temporal dead zone.',
    level: 'beginner',
    icon: '{ }',
    tags: ['variables', 'hoisting', 'scope'],
    content: `
## Variables in JavaScript

JavaScript has three ways to declare variables, and picking the wrong one causes subtle bugs.

### var — the old way

\`\`\`js
var name = "Alice";
console.log(name); // "Alice"

// var is function-scoped, not block-scoped
if (true) {
  var leaky = "I leak outside the block!";
}
console.log(leaky); // "I leak outside the block!" ← dangerous
\`\`\`

### let — block-scoped, reassignable

\`\`\`js
let count = 0;
count = 1; // fine

if (true) {
  let blockOnly = "only here";
}
// console.log(blockOnly); // ReferenceError ← good, contained
\`\`\`

### const — block-scoped, no reassignment

\`\`\`js
const PI = 3.14159;
// PI = 3; // TypeError

// NOTE: const objects are still mutable
const user = { name: "Alice" };
user.name = "Bob"; // This works!
// user = {}; // This doesn't — the binding is const, not the value
\`\`\`

### Hoisting

\`\`\`js
// var declarations are hoisted (moved to top), initialized as undefined
console.log(x); // undefined (not an error!)
var x = 5;

// let/const are hoisted but NOT initialized — Temporal Dead Zone
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;
\`\`\`

### Rule of thumb

Use \`const\` by default. Use \`let\` when you need to reassign. Never use \`var\`.
    `
  },
  {
    slug: 'functions-closures',
    title: 'Functions & Closures',
    description: 'Declarations, expressions, arrow functions, and how closures give functions memory.',
    level: 'beginner',
    icon: 'fn()',
    tags: ['functions', 'closures', 'arrow functions', 'scope'],
    content: `
## Functions in JavaScript

### Function Declarations — hoisted

\`\`\`js
greet("Alice"); // works before declaration due to hoisting

function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Function Expressions — not hoisted

\`\`\`js
const double = function(n) {
  return n * 2;
};

console.log(double(5)); // 10
\`\`\`

### Arrow Functions — concise, no own \`this\`

\`\`\`js
const add = (a, b) => a + b;
const square = n => n * n; // single param, no parens needed

// Multi-line needs braces + return
const divide = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};
\`\`\`

### The \`this\` difference — critical

\`\`\`js
const obj = {
  name: "JS.hub",
  regularFn: function() {
    return this.name; // "JS.hub" — this = obj
  },
  arrowFn: () => {
    return this.name; // undefined — arrow inherits outer this
  }
};
\`\`\`

### Closures — functions with memory

A closure is when an inner function retains access to its outer function's variables even after the outer function returns.

\`\`\`js
function makeCounter(start = 0) {
  let count = start; // private to makeCounter

  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count
  };
}

const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
console.log(counter.value()); // 11
// count is not accessible from outside — true encapsulation
\`\`\`

### Practical closure: memoization

\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = n => { /* imagine expensive calc */ return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(12); // calculates
fastSquare(12); // returns from cache instantly
\`\`\`
    `
  },
  {
    slug: 'arrays',
    title: 'Array Methods',
    description: 'map, filter, reduce, flat, find — functional data transformation patterns.',
    level: 'beginner',
    icon: '[]',
    tags: ['arrays', 'map', 'filter', 'reduce'],
    content: `
## Array Methods

### map — transform every element

\`\`\`js
const prices = [10, 25, 30];
const withTax = prices.map(p => p * 1.18);
// [11.8, 29.5, 35.4]
\`\`\`

### filter — keep matching elements

\`\`\`js
const scores = [45, 72, 88, 34, 91];
const passing = scores.filter(s => s >= 50);
// [72, 88, 91]
\`\`\`

### reduce — collapse to a single value

\`\`\`js
const cart = [
  { item: "Book", price: 299 },
  { item: "Pen", price: 49 },
  { item: "Notebook", price: 149 },
];

const total = cart.reduce((sum, item) => sum + item.price, 0);
// 497
\`\`\`

### Chaining — the real power

\`\`\`js
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: false },
  { name: "Carol", age: 30, active: true },
];

const activeAdultNames = users
  .filter(u => u.active && u.age >= 18)
  .map(u => u.name)
  .sort();
// ["Alice", "Carol"]
\`\`\`

### find vs findIndex

\`\`\`js
const item = cart.find(i => i.price > 200);      // { item: "Book", price: 299 }
const idx  = cart.findIndex(i => i.price > 200); // 0
\`\`\`

### flat and flatMap

\`\`\`js
const nested = [[1, 2], [3, [4, 5]]];
nested.flat();    // [1, 2, 3, [4, 5]]
nested.flat(2);   // [1, 2, 3, 4, 5]

const sentences = ["Hello world", "JS is great"];
const words = sentences.flatMap(s => s.split(" "));
// ["Hello", "world", "JS", "is", "great"]
\`\`\`
    `
  },
  {
    slug: 'async-await',
    title: 'Async / Await',
    description: 'Promises, async/await, error handling, and parallel execution.',
    level: 'intermediate',
    icon: '~>',
    tags: ['async', 'promises', 'fetch', 'error handling'],
    content: `
## Async JavaScript

### The Problem: callbacks lead to hell

\`\`\`js
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // deeply nested, hard to read, hard to error-handle
    });
  });
});
\`\`\`

### Promises — a cleaner contract

\`\`\`js
const fetchUser = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) reject(new Error("ID required"));
    setTimeout(() => resolve({ id, name: "Alice" }), 500);
  });
};

fetchUser(1)
  .then(user => console.log(user))
  .catch(err => console.error(err));
\`\`\`

### async/await — synchronous-looking async

\`\`\`js
async function loadUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (err) {
    console.error("Failed:", err.message);
    throw err; // re-throw if caller needs to handle it
  }
}
\`\`\`

### Parallel execution — don't await sequentially if you don't need to

\`\`\`js
// SLOW: sequential (waits for each one)
const user  = await fetchUser(1);   // 500ms
const posts = await fetchPosts(1);  // + 500ms = 1000ms total

// FAST: parallel
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1)
]); // ~500ms total
\`\`\`

### Promise.allSettled — when you want all results, even failures

\`\`\`js
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(999), // might fail
  fetchUser(2),
]);

results.forEach(result => {
  if (result.status === 'fulfilled') console.log(result.value);
  else console.error(result.reason);
});
\`\`\`
    `
  },
  {
    slug: 'event-loop',
    title: 'Event Loop',
    description: 'Call stack, Web APIs, task queue, microtask queue — how JS stays single-threaded.',
    level: 'intermediate',
    icon: '↻',
    tags: ['event loop', 'microtasks', 'call stack', 'concurrency'],
    content: `
## The Event Loop

JavaScript is single-threaded — it can only do one thing at a time. The event loop is how it handles async operations without blocking.

### Execution order: a mental model

1. **Call Stack** — executes synchronous code, top to bottom
2. **Web APIs** — browser handles timers, fetch, DOM events off-thread
3. **Microtask Queue** — Promise callbacks go here (highest priority)
4. **Task Queue** (Macrotask) — setTimeout, setInterval callbacks go here

After each task, ALL microtasks are drained before the next task runs.

### Classic quiz question

\`\`\`js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2
// Why?
// "1" — synchronous
// setTimeout queued as macrotask
// Promise.then queued as microtask
// "4" — synchronous
// Microtasks run: "3"
// Macrotasks run: "2"
\`\`\`

### Why this matters in practice

\`\`\`js
// This blocks the entire UI for 2 seconds:
const end = Date.now() + 2000;
while (Date.now() < end) {} // 🚫 never do this
console.log("Done — but UI was frozen");

// Instead, break work into chunks:
function processChunk(items, index = 0) {
  if (index >= items.length) return;
  processItem(items[index]);
  setTimeout(() => processChunk(items, index + 1), 0); // yields to event loop
}
\`\`\`
    `
  },
  {
    slug: 'prototypes-classes',
    title: 'Prototypes & Classes',
    description: 'How inheritance really works in JS. Prototype chain, ES6 classes, and the difference.',
    level: 'intermediate',
    icon: '::',
    tags: ['OOP', 'prototypes', 'classes', 'inheritance'],
    content: `
## Prototypes & Classes

### Prototype chain — JavaScript's inheritance model

Every object in JS has a hidden \`[[Prototype]]\` link. When you access a property, JS walks the chain until it finds it (or hits \`null\`).

\`\`\`js
const animal = {
  breathe() { return "inhale... exhale"; }
};

const dog = Object.create(animal); // dog's prototype = animal
dog.bark = function() { return "woof!"; };

dog.bark();    // "woof!" — own property
dog.breathe(); // "inhale... exhale" — from prototype
\`\`\`

### Constructor functions — the old way

\`\`\`js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return \`Hi, I'm \${this.name}\`;
};

const alice = new Person("Alice", 25);
alice.greet(); // "Hi, I'm Alice"
\`\`\`

### ES6 Classes — syntactic sugar over prototypes

\`\`\`js
class Person {
  #age; // private field

  constructor(name, age) {
    this.name = name;
    this.#age = age;
  }

  greet() {
    return \`Hi, I'm \${this.name}\`;
  }

  get ageInfo() {
    return \`Age: \${this.#age}\`;
  }

  static create(name, age) {
    return new Person(name, age);
  }
}

class Developer extends Person {
  constructor(name, age, lang) {
    super(name, age);
    this.lang = lang;
  }

  greet() {
    return \`\${super.greet()}, I code in \${this.lang}\`;
  }
}

const dev = new Developer("Bob", 28, "JavaScript");
dev.greet(); // "Hi, I'm Bob, I code in JavaScript"
\`\`\`
    `
  },
  {
    slug: 'modules',
    title: 'Modules & Bundling',
    description: 'ES modules, CommonJS, dynamic imports, and how bundlers like Vite work.',
    level: 'intermediate',
    icon: '◫',
    tags: ['modules', 'ESM', 'CommonJS', 'imports'],
    content: `
## JavaScript Modules

### ES Modules (ESM) — the modern standard

\`\`\`js
// math.js — named exports
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export default function subtract(a, b) { return a - b; }

// main.js — importing
import subtract, { add, multiply } from './math.js';
import * as math from './math.js'; // import everything

console.log(add(2, 3));       // 5
console.log(math.multiply(4, 5)); // 20
\`\`\`

### Dynamic imports — load on demand

\`\`\`js
// Only loads the heavy chart library when user clicks
button.addEventListener('click', async () => {
  const { renderChart } = await import('./charts.js');
  renderChart(data);
});
\`\`\`

### CommonJS (CJS) — Node.js legacy

\`\`\`js
// utils.js
const add = (a, b) => a + b;
module.exports = { add };

// index.js
const { add } = require('./utils');
\`\`\`

### Key differences

| | ESM | CommonJS |
|---|---|---|
| Syntax | import/export | require/module.exports |
| Loading | Static (compile-time) | Dynamic (runtime) |
| Tree-shaking | Yes | No |
| Browser native | Yes | No |
| Node.js | .mjs or "type":"module" | Default |

### How Vite works

Vite serves ES modules directly in development (no bundling step — instant HMR). For production, it uses Rollup to tree-shake and bundle. This is why your dev server starts in milliseconds.
    `
  },
  {
    slug: 'proxy-reflect',
    title: 'Proxy & Reflect',
    description: 'Intercept and redefine object operations. The foundation of reactive systems.',
    level: 'advanced',
    icon: '⟳',
    tags: ['proxy', 'reflect', 'meta-programming'],
    content: `
## Proxy & Reflect

Proxy lets you intercept fundamental operations on objects: property access, assignment, deletion, function calls, and more.

### Basic proxy — validation

\`\`\`js
const validator = {
  set(target, prop, value) {
    if (prop === 'age') {
      if (typeof value !== 'number') throw new TypeError('Age must be a number');
      if (value < 0 || value > 150) throw new RangeError('Age out of range');
    }
    target[prop] = value;
    return true; // must return true on success
  }
};

const person = new Proxy({}, validator);
person.name = "Alice";  // fine
person.age = 25;        // fine
// person.age = -5;     // RangeError
// person.age = "old";  // TypeError
\`\`\`

### Reactive data (how Vue 3 works)

\`\`\`js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      console.log(\`Reading: \${prop}\`);
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      console.log(\`Setting \${prop} = \${value}\`);
      const result = Reflect.set(target, prop, value);
      // trigger UI re-render here
      return result;
    }
  });
}

const state = reactive({ count: 0 });
state.count++;  // logs: Reading: count, Setting count = 1
\`\`\`

### Reflect — the companion API

Reflect mirrors Proxy traps as functions, making it easy to pass operations through while adding behaviour.

\`\`\`js
// Instead of:      target[prop] = value; return true;
// Use:             return Reflect.set(target, prop, value);
// Always forwards the default behaviour correctly, even for edge cases.
\`\`\`
    `
  },
  {
    slug: 'destructuring-spread',
    title: 'Destructuring & Spread',
    description: 'Clean extraction from arrays and objects. Rest params, spread operator, defaults.',
    level: 'beginner',
    icon: '...',
    tags: ['destructuring', 'spread', 'rest', 'ES6'],
    content: `
## Destructuring & Spread

### Object destructuring

\`\`\`js
const user = { name: "Alice", age: 25, role: "admin" };

const { name, age } = user;
const { name: userName, role = "guest" } = user; // rename + default

// nested
const { address: { city } } = { address: { city: "Prayagraj" } };
\`\`\`

### Array destructuring

\`\`\`js
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// swap without temp variable
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1

// skip elements
const [,, third] = [1, 2, 3]; // third = 3
\`\`\`

### Function parameters

\`\`\`js
function renderUser({ name, age = 18, role = "user" }) {
  return \`\${name} (\${age}) — \${role}\`;
}

renderUser({ name: "Alice", age: 25, role: "admin" });
\`\`\`

### Spread operator

\`\`\`js
// merge objects (last one wins on conflict)
const defaults = { theme: "dark", lang: "en" };
const userPrefs = { lang: "hi", fontSize: 16 };
const config = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "hi", fontSize: 16 }

// clone arrays without mutation
const original = [1, 2, 3];
const copy = [...original, 4, 5]; // [1, 2, 3, 4, 5]
\`\`\`
    `
  },
  {
    slug: 'this-binding',
    title: 'this & Binding',
    description: 'How this is determined at call time, not definition time. call, apply, bind, and arrow function rules.',
    level: 'beginner',
    icon: '⇢',
    tags: ['this', 'call', 'apply', 'bind'],
    content: `
## The \`this\` Keyword

\`this\` is not who wrote the function — it's who called it. It's determined at call time.

### Rule 1: Method call — this = the object before the dot

\`\`\`js
const user = {
  name: "Alice",
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
};

user.greet(); // "Hello, I'm Alice" — this = user
\`\`\`

### Rule 2: Plain function call — this = undefined (strict) or global

\`\`\`js
function show() {
  console.log(this); // undefined in strict mode, window in browser
}

const fn = user.greet;
fn(); // "Hello, I'm undefined" — lost the object context!
\`\`\`

### Rule 3: Arrow functions — this inherited from enclosing scope

\`\`\`js
const timer = {
  seconds: 0,
  start() {
    // Arrow function captures this from start()
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};

timer.start(); // works — this.seconds increments correctly
\`\`\`

### call and apply — invoke with explicit this

\`\`\`js
function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

greet.call(alice, "Hello", "!");  // "Hello, Alice!"
greet.apply(bob, ["Hi", "."]);    // "Hi, Bob."
// call: args spread out  |  apply: args as array
\`\`\`

### bind — create a permanently bound function

\`\`\`js
const greetAlice = greet.bind(alice, "Hey");
greetAlice("?"); // "Hey, Alice?"

// Classic use: event handlers
class Button {
  constructor(label) {
    this.label = label;
    this.handleClick = this.handleClick.bind(this); // bind once
  }
  handleClick() {
    console.log(\`\${this.label} clicked\`);
  }
}
\`\`\`

### Common gotcha: losing context in callbacks

\`\`\`js
const counter = {
  count: 0,
  increment() { this.count++; },
};

// BAD: this is lost
setTimeout(counter.increment, 100); // this.count is NaN

// GOOD: arrow wrapper preserves context
setTimeout(() => counter.increment(), 100);

// GOOD: bind
setTimeout(counter.increment.bind(counter), 100);
\`\`\`
    `
  },
  {
    slug: 'error-handling',
    title: 'Error Handling',
    description: 'try/catch/finally, built-in error types, custom errors, and handling failures in async code.',
    level: 'intermediate',
    icon: '⚠',
    tags: ['errors', 'try-catch', 'async', 'custom errors'],
    content: `
## Error Handling in JavaScript

### try / catch / finally

\`\`\`js
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error("Parse failed:", err.message);
    return null;
  } finally {
    console.log("parseJSON finished"); // always runs, even on error
  }
}

parseJSON('{"valid": true}'); // returns object
parseJSON("not json");        // logs error, returns null
\`\`\`

### Built-in error types

\`\`\`js
try {
  null.property;       // TypeError
} catch (e) { console.log(e instanceof TypeError); } // true

try {
  undeclaredVar;       // ReferenceError
} catch (e) { console.log(e instanceof ReferenceError); } // true

try {
  eval("{");           // SyntaxError (rare at runtime)
} catch (e) { console.log(e instanceof SyntaxError); } // true

try {
  new Array(-1);       // RangeError
} catch (e) { console.log(e instanceof RangeError); } // true
\`\`\`

### Custom error classes

\`\`\`js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "NetworkError";
    this.status = status;
  }
}

function validateAge(age) {
  if (typeof age !== "number") throw new ValidationError("age", "Age must be a number");
  if (age < 0 || age > 150) throw new ValidationError("age", "Age out of range");
  return age;
}

try {
  validateAge("old");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(\`Field "\${err.field}": \${err.message}\`);
  } else {
    throw err; // re-throw unexpected errors
  }
}
\`\`\`

### Async error handling

\`\`\`js
// With async/await — use try/catch
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new NetworkError(res.status, "Request failed");
    return await res.json();
  } catch (err) {
    if (err instanceof NetworkError && err.status === 404) {
      return null; // handle 404 gracefully
    }
    throw err; // re-throw everything else
  }
}

// With Promise chains — use .catch()
fetch("/api/data")
  .then(res => res.json())
  .catch(err => console.error("Fetch error:", err));
\`\`\`

### Unhandled rejections

\`\`\`js
// Always handle rejections — unhandled ones crash Node.js
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason);
});

// In the browser
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled:", e.reason);
});
\`\`\`
    `
  },
  {
    slug: 'generators-iterators',
    title: 'Generators & Iterators',
    description: 'The iterator protocol, generator functions, yield, and building lazy sequences.',
    level: 'advanced',
    icon: 'function*',
    tags: ['generators', 'iterators', 'yield', 'lazy evaluation'],
    content: `
## Generators & Iterators

### The Iterator Protocol

An object is iterable if it has a \`[Symbol.iterator]\` method that returns an iterator. An iterator has a \`next()\` method that returns \`{ value, done }\`.

\`\`\`js
// Manual iterator
function makeRange(start, end) {
  let current = start;
  return {
    [Symbol.iterator]() { return this; },
    next() {
      if (current <= end) return { value: current++, done: false };
      return { value: undefined, done: true };
    }
  };
}

for (const n of makeRange(1, 3)) {
  console.log(n); // 1, 2, 3
}

const arr = [...makeRange(1, 5)]; // [1, 2, 3, 4, 5]
\`\`\`

### Generator functions — simpler iterator creation

\`\`\`js
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i; // pauses here, resumes on next()
  }
}

const gen = range(1, 3);
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Spread and for...of work automatically
console.log([...range(1, 5)]); // [1, 2, 3, 4, 5]
\`\`\`

### Infinite sequences — values produced lazily

\`\`\`js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

function* take(n, iter) {
  for (const val of iter) {
    if (n-- <= 0) return;
    yield val;
  }
}

console.log([...take(5, naturals())]); // [1, 2, 3, 4, 5]
\`\`\`

### Two-way communication with yield

\`\`\`js
function* calculator() {
  let result = 0;
  while (true) {
    const input = yield result; // yield sends result out, receives input back
    result += input;
  }
}

const calc = calculator();
calc.next();       // start — { value: 0, done: false }
calc.next(10);     // add 10 — { value: 10, done: false }
calc.next(5);      // add 5  — { value: 15, done: false }
\`\`\`

### Practical use: paginated API fetching

\`\`\`js
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page}\`);
    const data = await res.json();
    if (!data.items.length) return;
    yield data.items;
    page++;
  }
}

for await (const items of fetchPages("/api/posts")) {
  console.log("Got page:", items);
}
\`\`\`
    `
  },
  {
    slug: 'typescript-basics',
    title: 'TypeScript Basics',
    description: 'Type annotations, interfaces, union types, generics, and the most useful utility types.',
    level: 'intermediate',
    icon: 'TS',
    tags: ['typescript', 'types', 'interfaces', 'generics'],
    content: `
## TypeScript Basics

TypeScript is JavaScript with a type system. Types are erased at compile time — the output is plain JS.

### Type annotations

\`\`\`ts
// Primitives
let name: string = "Alice";
let age: number = 25;
let active: boolean = true;

// Arrays
let scores: number[] = [90, 85, 92];
let tags: Array<string> = ["js", "ts"];

// Functions
function add(a: number, b: number): number {
  return a + b;
}

// Optional and default params
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}!\`;
}
\`\`\`

### Interfaces and type aliases

\`\`\`ts
interface User {
  id: number;
  name: string;
  email?: string; // optional
  readonly createdAt: Date; // cannot be reassigned
}

type Status = "active" | "inactive" | "pending"; // union

type ApiResponse<T> = {
  data: T;
  error: string | null;
  status: number;
};

const res: ApiResponse<User> = {
  data: { id: 1, name: "Alice", createdAt: new Date() },
  error: null,
  status: 200,
};
\`\`\`

### Generics — reusable typed functions

\`\`\`ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]);       // type: number | undefined
first(["a", "b"]);      // type: string | undefined

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 25 };
getProperty(user, "name"); // string ✓
// getProperty(user, "email"); // Error: not a key of user ✗
\`\`\`

### Utility types — transform existing types

\`\`\`ts
interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type PartialConfig  = Partial<Config>;   // all fields optional
type ReadonlyConfig = Readonly<Config>;  // all fields readonly
type HostOnly       = Pick<Config, "host" | "port">; // subset
type WithoutDebug   = Omit<Config, "debug">;         // exclude

// Record — map of known keys to a type
type Roles = Record<"admin" | "user" | "guest", string[]>;
const permissions: Roles = {
  admin: ["read", "write", "delete"],
  user:  ["read", "write"],
  guest: ["read"],
};
\`\`\`

### Type narrowing — working with unions

\`\`\`ts
type Shape = { kind: "circle"; radius: number }
           | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect":   return shape.width * shape.height;
  }
}
\`\`\`
    `
  },
  {
  slug: 'dom-manipulation',
  title: 'DOM Manipulation',
  description: 'Selecting, creating, and modifying HTML elements with JavaScript.',
  level: 'beginner',
  icon: '⬚',
  tags: ['DOM', 'browser', 'elements'],
  content: `
## DOM Manipulation

The DOM (Document Object Model) is the browser's representation of your HTML as a tree of objects you can manipulate with JavaScript.

### Selecting elements

\`\`\`js
// Single element
const title = document.querySelector('h1');
const btn = document.querySelector('#submit-btn');
const card = document.querySelector('.card');

// Multiple elements
const items = document.querySelectorAll('li');
const buttons = document.querySelectorAll('.btn');

// Older but still common
const el = document.getElementById('myId');
\`\`\`

### Reading and changing content

\`\`\`js
const heading = document.querySelector('h1');

// Read
console.log(heading.textContent); // plain text
console.log(heading.innerHTML);   // HTML string

// Write
heading.textContent = 'New Title';
heading.innerHTML = 'Title with <strong>bold</strong>';
\`\`\`

### Changing styles and classes

\`\`\`js
const box = document.querySelector('.box');

// Inline styles
box.style.backgroundColor = '#1a1a2e';
box.style.padding = '16px';

// Classes (preferred — keeps CSS in CSS)
box.classList.add('active');
box.classList.remove('hidden');
box.classList.toggle('dark');
box.classList.contains('active'); // true/false
\`\`\`

### Reading and setting attributes

\`\`\`js
const link = document.querySelector('a');

link.getAttribute('href');           // read
link.setAttribute('href', '/home');  // write
link.removeAttribute('disabled');    // remove
link.hasAttribute('disabled');       // check
\`\`\`

### Creating and inserting elements

\`\`\`js
// Create
const li = document.createElement('li');
li.textContent = 'New item';
li.classList.add('list-item');

// Insert
const ul = document.querySelector('ul');
ul.appendChild(li);                    // at the end
ul.prepend(li);                        // at the start
ul.insertBefore(li, ul.children[2]);  // before specific child

// Modern insertAdjacentElement
ul.insertAdjacentElement('beforeend', li);
\`\`\`

### Removing elements

\`\`\`js
const el = document.querySelector('.old-item');
el.remove(); // modern, simple
\`\`\`

### Traversing the tree

\`\`\`js
const item = document.querySelector('.item');

item.parentElement;          // parent node
item.children;               // HTMLCollection of children
item.nextElementSibling;     // next sibling element
item.previousElementSibling; // previous sibling element
item.firstElementChild;      // first child
item.lastElementChild;       // last child
\`\`\`
  `
},
{
  slug: 'events',
  title: 'Events & Event Handling',
  description: 'addEventListener, event delegation, bubbling, capturing, and common event types.',
  level: 'beginner',
  icon: '⚡',
  tags: ['events', 'DOM', 'browser', 'listeners'],
  content: `
## Events & Event Handling

### Adding event listeners

\`\`\`js
const btn = document.querySelector('#btn');

btn.addEventListener('click', function(event) {
  console.log('clicked!', event);
});

// Arrow function
btn.addEventListener('click', (e) => {
  console.log(e.target); // the element that was clicked
});
\`\`\`

### The event object

\`\`\`js
document.addEventListener('click', (e) => {
  e.target;          // element that triggered the event
  e.currentTarget;   // element the listener is attached to
  e.type;            // 'click'
  e.clientX;         // mouse X position
  e.clientY;         // mouse Y position
  e.key;             // for keyboard events: 'Enter', 'Escape', etc.
  e.preventDefault(); // stop default browser behavior
  e.stopPropagation(); // stop event from bubbling up
});
\`\`\`

### Event bubbling — events travel up the tree

\`\`\`js
// If you click a <button> inside a <div> inside <body>,
// the event fires on button → div → body → html → document

document.querySelector('.child').addEventListener('click', (e) => {
  console.log('child clicked');
  // e.stopPropagation(); // uncomment to stop bubbling
});

document.querySelector('.parent').addEventListener('click', () => {
  console.log('parent also fires!'); // fires too, due to bubbling
});
\`\`\`

### Event delegation — one listener for many elements

Instead of adding a listener to every list item, add one to the parent:

\`\`\`js
// BAD: listener on every item
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', handleClick);
});

// GOOD: one listener on the parent
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    handleClick(e.target);
  }
});

// Works for dynamically added items too!
\`\`\`

### Removing listeners

\`\`\`js
function handleClick() { console.log('clicked'); }

btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick); // must be same reference

// once: auto-removes after first fire
btn.addEventListener('click', handleClick, { once: true });
\`\`\`

### Common event types

\`\`\`js
// Mouse
el.addEventListener('click', handler);
el.addEventListener('dblclick', handler);
el.addEventListener('mouseover', handler);
el.addEventListener('mouseout', handler);
el.addEventListener('mousemove', handler);

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.ctrlKey && e.key === 's') save();
});

// Form
form.addEventListener('submit', (e) => {
  e.preventDefault(); // stop page reload
  const data = new FormData(form);
});

input.addEventListener('input', (e) => console.log(e.target.value));
input.addEventListener('change', handler); // fires on blur

// Page lifecycle
window.addEventListener('load', handler);       // everything loaded
document.addEventListener('DOMContentLoaded', handler); // DOM ready
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);
\`\`\`
  `
},
{
  slug: 'regular-expressions',
  title: 'Regular Expressions',
  description: 'Pattern matching with regex. Syntax, flags, groups, and common use cases.',
  level: 'beginner',
  icon: '/./',
  tags: ['regex', 'strings', 'patterns'],
  content: `
## Regular Expressions

A regular expression (regex) is a pattern used to match, search, or replace text.

### Creating a regex

\`\`\`js
// Literal syntax (preferred)
const pattern = /hello/;
const withFlags = /hello/gi; // global, case-insensitive

// Constructor (when pattern is dynamic)
const dynamic = new RegExp('hello', 'gi');
\`\`\`

### Flags

\`\`\`js
/pattern/g  // global — find all matches, not just first
/pattern/i  // case-insensitive
/pattern/m  // multiline — ^ and $ match line start/end
/pattern/s  // dotAll — . matches newlines too
\`\`\`

### Testing and matching

\`\`\`js
// test() — returns true/false
/^\d{5}$/.test('12345');  // true (5 digits)
/^\d{5}$/.test('1234x');  // false

// match() — returns matches
'hello world'.match(/\w+/g); // ['hello', 'world']

// exec() — returns detailed match info
const re = /(\d{4})-(\d{2})-(\d{2})/;
const result = re.exec('2024-01-15');
// result[0] = '2024-01-15' (full match)
// result[1] = '2024', result[2] = '01', result[3] = '15' (groups)
\`\`\`

### Character classes and quantifiers

\`\`\`js
// Character classes
/\d/   // digit [0-9]
/\w/   // word char [a-zA-Z0-9_]
/\s/   // whitespace
/\D/   // NOT digit
/[aeiou]/ // any vowel
/[^aeiou]/ // NOT a vowel

// Quantifiers
/a*/   // 0 or more a's
/a+/   // 1 or more a's
/a?/   // 0 or 1 a
/a{3}/ // exactly 3 a's
/a{2,4}/ // 2 to 4 a's

// Anchors
/^hello/  // starts with hello
/world$/  // ends with world
/\bhello\b/ // whole word "hello"
\`\`\`

### Named groups — readable captures

\`\`\`js
const dateRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { groups } = '2024-01-15'.match(dateRe);
console.log(groups.year);  // '2024'
console.log(groups.month); // '01'
\`\`\`

### Replace and split

\`\`\`js
// replace
'hello world'.replace(/o/g, '0'); // 'hell0 w0rld'

// replace with function
'hello world'.replace(/\w+/g, w => w.toUpperCase()); // 'HELLO WORLD'

// split
'one, two,  three'.split(/,\s*/); // ['one', 'two', 'three']
\`\`\`

### Common patterns

\`\`\`js
const patterns = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone:    /^[+]?[\d\s\-()]{10,}$/,
  url:      /^https?:\/\/[^\s]+$/,
  slug:     /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
};

patterns.email.test('user@example.com'); // true
patterns.hexColor.test('#1a2b3c');        // true
\`\`\`
  `
},
{
  slug: 'json-web-apis',
  title: 'JSON & Web APIs',
  description: 'JSON parsing and serialization, the Fetch API, and working with REST endpoints.',
  level: 'beginner',
  icon: '{}',
  tags: ['JSON', 'fetch', 'API', 'HTTP'],
  content: `
## JSON & Web APIs

### JSON basics

JSON (JavaScript Object Notation) is the standard format for exchanging data between a server and a browser.

\`\`\`js
// JavaScript object → JSON string
const user = { name: "Alice", age: 25, active: true };
const json = JSON.stringify(user);
// '{"name":"Alice","age":25,"active":true}'

// Pretty print
JSON.stringify(user, null, 2);
// {
//   "name": "Alice",
//   "age": 25,
//   "active": true
// }

// JSON string → JavaScript object
const parsed = JSON.parse(json);
console.log(parsed.name); // "Alice"
\`\`\`

### JSON gotchas

\`\`\`js
// These get dropped or transformed by JSON.stringify:
JSON.stringify({ fn: () => {}, undef: undefined }); // '{}'
JSON.stringify({ date: new Date() }); // '{"date":"2024-01-15T..."}'  — string, not Date
JSON.stringify({ n: NaN, i: Infinity }); // '{"n":null,"i":null}'

// Always wrap JSON.parse in try/catch
try {
  const data = JSON.parse(maybeInvalidJson);
} catch (e) {
  console.error('Invalid JSON:', e.message);
}
\`\`\`

### The Fetch API

\`\`\`js
// GET request
const response = await fetch('https://api.example.com/users');
const users = await response.json();

// Always check response.ok — fetch doesn't throw on 4xx/5xx
if (!response.ok) {
  throw new Error(\`HTTP error: \${response.status}\`);
}
\`\`\`

### POST, PUT, DELETE

\`\`\`js
// POST — create
const newUser = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', age: 25 }),
}).then(res => res.json());

// PUT — update
await fetch(\`/api/users/\${id}\`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice Updated' }),
});

// DELETE
await fetch(\`/api/users/\${id}\`, { method: 'DELETE' });
\`\`\`

### A reusable API client pattern

\`\`\`js
async function api(path, options = {}) {
  const res = await fetch(\`/api\${path}\`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || \`HTTP \${res.status}\`);
  }

  return res.json();
}

// Usage
const users = await api('/users');
const user  = await api('/users/1');
await api('/users', { method: 'POST', body: { name: 'Alice' } });
\`\`\`

### Handling loading and error states

\`\`\`js
async function loadUsers() {
  let loading = true;
  let error = null;
  let users = [];

  try {
    users = await api('/users');
  } catch (err) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { users, error, loading };
}
\`\`\`
  `
},
{
  slug: 'promises',
  title: 'Promises',
  description: 'How promises work internally, promise chaining, and all the static methods.',
  level: 'intermediate',
  icon: '◎',
  tags: ['promises', 'async', 'chaining'],
  content: `
## Promises

### How a Promise works internally

\`\`\`js
// A Promise is an object representing a value that isn't available yet.
// It's in one of three states:
// pending → fulfilled (resolved with a value)
// pending → rejected (failed with a reason)
// Once settled, it never changes state.

const p = new Promise((resolve, reject) => {
  // do async work...
  if (success) resolve(value);
  else reject(new Error('something failed'));
});
\`\`\`

### Promise chaining — .then returns a new Promise

\`\`\`js
fetch('/api/user/1')
  .then(res => res.json())          // transform response
  .then(user => fetchPosts(user.id)) // return another promise
  .then(posts => console.log(posts)) // receive its resolved value
  .catch(err => console.error(err))  // catches any error above
  .finally(() => setLoading(false)); // always runs
\`\`\`

### Common mistake: forgetting to return

\`\`\`js
// WRONG — the chain doesn't wait for fetchPosts
.then(user => {
  fetchPosts(user.id); // missing return!
})

// CORRECT
.then(user => {
  return fetchPosts(user.id);
})
// or
.then(user => fetchPosts(user.id))
\`\`\`

### Static methods

\`\`\`js
// Promise.all — all must resolve, rejects on first failure
const [user, posts] = await Promise.all([fetchUser(1), fetchPosts(1)]);

// Promise.allSettled — waits for all, never rejects
const results = await Promise.allSettled([fetchUser(1), fetchUser(999)]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});

// Promise.race — resolves/rejects with first to settle
const first = await Promise.race([fetchFast(), fetchSlow()]);

// Promise.any — resolves with first success, rejects only if ALL fail
const fastest = await Promise.any([mirror1(), mirror2(), mirror3()]);

// Promise.resolve / Promise.reject — wrap values
const p = Promise.resolve(42); // already resolved
await p; // 42
\`\`\`

### Promisifying callback-based code

\`\`\`js
// Old callback style
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promisified
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

const data = await readFile('file.txt');
\`\`\`

### Timeout pattern

\`\`\`js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timed out')), ms)
  );
  return Promise.race([promise, timeout]);
}

const user = await withTimeout(fetchUser(1), 5000);
\`\`\`
  `
},
{
  slug: 'set-map',
  title: 'Set & Map',
  description: 'ES6 collections. When to use Set and Map instead of arrays and plain objects.',
  level: 'intermediate',
  icon: '⊕',
  tags: ['Set', 'Map', 'collections', 'ES6'],
  content: `
## Set & Map

### Set — a collection of unique values

\`\`\`js
const set = new Set([1, 2, 3, 2, 1]);
console.log(set); // Set {1, 2, 3} — duplicates removed

set.add(4);
set.delete(1);
set.has(2);    // true
set.size;      // 3

// Iteration
for (const val of set) console.log(val);
const arr = [...set]; // convert to array
\`\`\`

### Most common Set use case: deduplication

\`\`\`js
const tags = ['js', 'react', 'js', 'css', 'react'];
const unique = [...new Set(tags)]; // ['js', 'react', 'css']
\`\`\`

### Set operations

\`\`\`js
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...a, ...b]); // {1,2,3,4,5,6}

// Intersection
const intersection = new Set([...a].filter(x => b.has(x))); // {3,4}

// Difference
const difference = new Set([...a].filter(x => !b.has(x))); // {1,2}
\`\`\`

### Map — key-value pairs with any key type

\`\`\`js
const map = new Map();

// Keys can be anything — objects, functions, primitives
map.set('name', 'Alice');
map.set(42, 'the answer');
map.set(true, 'yes');

const objKey = { id: 1 };
map.set(objKey, 'user data');

map.get('name');    // 'Alice'
map.get(objKey);    // 'user data'
map.has(42);        // true
map.delete(true);
map.size;           // 3

// Iteration
for (const [key, value] of map) {
  console.log(key, value);
}

const keys   = [...map.keys()];
const values = [...map.values()];
const entries = [...map.entries()];
\`\`\`

### Map vs plain object

| | Map | Object |
|---|---|---|
| Key types | Any | String/Symbol only |
| Order | Insertion order | Mostly insertion order |
| Size | map.size | Object.keys(o).length |
| Iteration | for...of | for...in / Object.entries |
| Performance | Better for frequent add/delete | Better for static data |

### When to use Map

\`\`\`js
// Counting occurrences — cleaner than an object
function wordCount(text) {
  const counts = new Map();
  for (const word of text.split(' ')) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
}

// Caching with object keys
const cache = new Map();
function getUser(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = expensiveLookup(obj);
  cache.set(obj, result);
  return result;
}
\`\`\`
  `
},
{
  slug: 'symbol-weakmap',
  title: 'Symbol & WeakMap',
  description: 'Unique identifiers with Symbol, private-ish properties, and memory-safe maps with WeakMap.',
  level: 'intermediate',
  icon: '◈',
  tags: ['Symbol', 'WeakMap', 'WeakSet', 'memory'],
  content: `
## Symbol & WeakMap

### Symbol — guaranteed unique values

\`\`\`js
const a = Symbol('description');
const b = Symbol('description');
console.log(a === b); // false — always unique

// Common use: unique object keys that don't clash
const ID = Symbol('id');
const user = { name: 'Alice', [ID]: 123 };

user[ID];          // 123
user['id'];        // undefined — Symbol key is separate
Object.keys(user); // ['name'] — Symbols are hidden from most iteration
\`\`\`

### Well-known Symbols — customize built-in behavior

\`\`\`js
// Symbol.iterator — make any object iterable
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) return { value: current++, done: false };
        return { value: undefined, done: true };
      }
    };
  }
}

console.log([...new Range(1, 5)]); // [1, 2, 3, 4, 5]

// Symbol.toPrimitive — control type coercion
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return \`\${this.amount} \${this.currency}\`;
    return this.amount;
  }
}

const price = new Money(100, 'USD');
console.log(\`Price: \${price}\`); // "Price: 100 USD"
console.log(price + 50);         // 150
\`\`\`

### WeakMap — keys must be objects, entries are garbage-collected

\`\`\`js
const cache = new WeakMap();

function process(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = expensiveOperation(obj);
  cache.set(obj, result);
  return result;
}

// When obj is garbage collected, cache entry disappears too.
// No memory leak. With a regular Map, the entry would stay forever.
\`\`\`

### WeakMap for private data

\`\`\`js
const _private = new WeakMap();

class BankAccount {
  constructor(balance) {
    _private.set(this, { balance });
  }

  deposit(amount) {
    _private.get(this).balance += amount;
  }

  get balance() {
    return _private.get(this).balance;
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.balance); // 1500
// account._private — undefined, no access
\`\`\`

### WeakSet — set of objects, garbage-collected

\`\`\`js
const visited = new WeakSet();

function process(node) {
  if (visited.has(node)) return; // already processed
  visited.add(node);
  // ... process node
}
// When nodes are removed from the DOM, visited entries disappear too
\`\`\`
  `
},
{
  slug: 'fetch-http',
  title: 'Fetch & HTTP',
  description: 'HTTP methods, headers, status codes, authentication, and real-world fetch patterns.',
  level: 'intermediate',
  icon: '⇅',
  tags: ['fetch', 'HTTP', 'API', 'headers', 'auth'],
  content: `
## Fetch & HTTP

### HTTP fundamentals

\`\`\`js
// Methods and what they mean
GET    // read data (no body)
POST   // create new resource
PUT    // replace entire resource
PATCH  // update part of resource
DELETE // remove resource

// Status codes you'll see constantly
200 // OK
201 // Created (after POST)
204 // No Content (after DELETE)
400 // Bad Request (your fault)
401 // Unauthorized (not logged in)
403 // Forbidden (logged in but no permission)
404 // Not Found
422 // Unprocessable Entity (validation failed)
429 // Too Many Requests (rate limited)
500 // Internal Server Error (their fault)
\`\`\`

### Full fetch with error handling

\`\`\`js
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message), { status: res.status });
  }

  if (res.status === 204) return null; // no content
  return res.json();
}
\`\`\`

### Authentication headers

\`\`\`js
// Bearer token (JWT)
const data = await fetchJSON('/api/profile', {
  headers: {
    Authorization: \`Bearer \${localStorage.getItem('token')}\`
  }
});

// Basic auth
const credentials = btoa('username:password');
fetchJSON('/api/data', {
  headers: { Authorization: \`Basic \${credentials}\` }
});
\`\`\`

### Sending different body types

\`\`\`js
// JSON (most common)
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
});

// Form data (file uploads)
const form = new FormData();
form.append('name', 'Alice');
form.append('avatar', fileInput.files[0]);
fetch('/api/users', { method: 'POST', body: form });
// Don't set Content-Type for FormData — browser sets it with boundary

// URL-encoded form
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ email: 'a@b.com', password: '123' }),
});
\`\`\`

### Abort controller — cancel requests

\`\`\`js
const controller = new AbortController();

// Cancel after 5 seconds
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const data = await fetch('/api/slow', {
    signal: controller.signal
  });
  clearTimeout(timeout);
  return data.json();
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Request cancelled');
  } else {
    throw err;
  }
}
\`\`\`

### Request deduplication pattern

\`\`\`js
const pending = new Map();

async function dedupedFetch(url) {
  if (pending.has(url)) return pending.get(url);

  const promise = fetch(url).then(r => r.json()).finally(() => {
    pending.delete(url);
  });

  pending.set(url, promise);
  return promise;
}
// Multiple calls to dedupedFetch('/api/user') only make one HTTP request
\`\`\`
  `
},
{
  slug: 'web-storage',
  title: 'Web Storage',
  description: 'localStorage, sessionStorage, cookies — when to use each and how to use them safely.',
  level: 'intermediate',
  icon: '▤',
  tags: ['localStorage', 'sessionStorage', 'cookies', 'storage'],
  content: `
## Web Storage

### localStorage — persists forever

\`\`\`js
// Store — strings only
localStorage.setItem('theme', 'dark');
localStorage.setItem('user', JSON.stringify({ name: 'Alice', id: 1 }));

// Read
const theme = localStorage.getItem('theme'); // 'dark'
const user  = JSON.parse(localStorage.getItem('user') ?? 'null');

// Delete
localStorage.removeItem('theme');
localStorage.clear(); // remove everything

// Check existence
localStorage.getItem('missing') === null; // true
\`\`\`

### sessionStorage — cleared when tab closes

\`\`\`js
// Same API as localStorage
sessionStorage.setItem('draft', JSON.stringify(formData));
const draft = JSON.parse(sessionStorage.getItem('draft') ?? 'null');

// Use for: unsaved form data, step wizard state, temporary filters
\`\`\`

### A safe storage wrapper

\`\`\`js
const storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false; // storage full or private mode
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

storage.set('prefs', { lang: 'en', theme: 'dark' });
storage.get('prefs'); // { lang: 'en', theme: 'dark' }
storage.get('missing', []); // []
\`\`\`

### Cookies — sent with every HTTP request

\`\`\`js
// Set (basic)
document.cookie = 'theme=dark; max-age=86400; path=/';

// Set with options
document.cookie = [
  'token=abc123',
  'max-age=3600',   // 1 hour
  'path=/',
  'SameSite=Strict',
  'Secure',         // HTTPS only
].join('; ');

// Read (painful raw API)
function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1] ?? null;
}

// Delete by setting max-age=0
document.cookie = 'theme=; max-age=0; path=/';
\`\`\`

### Comparison

| | localStorage | sessionStorage | Cookie |
|---|---|---|---|
| Capacity | ~5MB | ~5MB | ~4KB |
| Expires | Never | Tab close | Set manually |
| Sent to server | No | No | Yes (every request) |
| Accessible in JS | Yes | Yes | Yes (unless HttpOnly) |
| Use for | Preferences, cache | Temp state | Auth tokens, server needs |

### Security rules

\`\`\`js
// NEVER store sensitive data in localStorage/sessionStorage
// It's accessible by any JS on the page — XSS can steal it.

// Auth tokens: use HttpOnly cookies (server sets them, JS can't read)
// Non-sensitive preferences: localStorage is fine
// Credit cards, passwords: never store client-side at all
\`\`\`
  `
},
{
  slug: 'iterators',
  title: 'Iterators & for...of',
  description: 'The iterator protocol, for...of loops, spread with iterables, and built-in iterables.',
  level: 'intermediate',
  icon: '⟳',
  tags: ['iterators', 'for...of', 'spread', 'Symbol.iterator'],
  content: `
## Iterators & for...of

### Built-in iterables

Arrays, strings, Maps, Sets, and NodeLists are all iterable — they work with \`for...of\` and spread.

\`\`\`js
// Arrays
for (const item of ['a', 'b', 'c']) console.log(item);

// Strings — iterates over characters
for (const char of 'hello') console.log(char);

// Map
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, val] of map) console.log(key, val);

// Set
for (const val of new Set([1, 2, 3])) console.log(val);

// Spread works on any iterable
const chars = [... 'hello']; // ['h','e','l','l','o']
const arr = [...new Set([1,2,2,3])]; // [1,2,3]
\`\`\`

### The iterator protocol

An object is iterable if it has \`[Symbol.iterator]()\` that returns an iterator. An iterator has \`next()\` that returns \`{ value, done }\`.

\`\`\`js
const arr = [10, 20, 30];
const iter = arr[Symbol.iterator]();

iter.next(); // { value: 10, done: false }
iter.next(); // { value: 20, done: false }
iter.next(); // { value: 30, done: false }
iter.next(); // { value: undefined, done: true }
\`\`\`

### Making your own iterable

\`\`\`js
class Countdown {
  constructor(start) { this.start = start; }

  [Symbol.iterator]() {
    let current = this.start;
    return {
      next() {
        if (current >= 0) return { value: current--, done: false };
        return { value: undefined, done: true };
      }
    };
  }
}

for (const n of new Countdown(5)) {
  console.log(n); // 5, 4, 3, 2, 1, 0
}

console.log([...new Countdown(3)]); // [3, 2, 1, 0]
\`\`\`

### Destructuring uses the iterator protocol

\`\`\`js
const [a, b, ...rest] = new Countdown(5);
// a=5, b=4, rest=[3,2,1,0]

// This is why destructuring works on strings, Maps, Sets:
const [first, second] = 'hello'; // first='h', second='e'
const [[k, v]] = new Map([['key', 'val']]); // k='key', v='val'
\`\`\`

### Practical: paginated data as an iterable

\`\`\`js
function paginated(items, pageSize) {
  return {
    [Symbol.iterator]() {
      let index = 0;
      return {
        next() {
          if (index >= items.length) return { value: undefined, done: true };
          const page = items.slice(index, index + pageSize);
          index += pageSize;
          return { value: page, done: false };
        }
      };
    }
  };
}

for (const page of paginated([1,2,3,4,5,6,7], 3)) {
  console.log(page); // [1,2,3], then [4,5,6], then [7]
}
\`\`\`
  `
},
{
  slug: 'closures-practice',
  title: 'Closures in Practice',
  description: 'Module pattern, partial application, once, memoize — real patterns built on closures.',
  level: 'intermediate',
  icon: '(())',
  tags: ['closures', 'patterns', 'module', 'memoize'],
  content: `
## Closures in Practice

Closures aren't just a concept — they're the foundation of the most common JavaScript patterns.

### Module pattern — private state without classes

\`\`\`js
const counter = (() => {
  let count = 0; // private

  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = 0; },
    value: () => count,
  };
})();

counter.increment(); // 1
counter.increment(); // 2
counter.value();     // 2
// count — not accessible from outside
\`\`\`

### once — run a function exactly one time

\`\`\`js
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initApp = once(() => {
  console.log('App initialized');
  return true;
});

initApp(); // 'App initialized', returns true
initApp(); // silent, returns true (cached)
initApp(); // silent, returns true (cached)
\`\`\`

### Memoize — cache expensive results

\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

fib(40); // fast — each value computed once
\`\`\`

### Partial application — pre-fill arguments

\`\`\`js
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function multiply(a, b) { return a * b; }

const double = partial(multiply, 2);
const triple = partial(multiply, 3);

double(5); // 10
triple(5); // 15

// Real use: pre-fill a fetch base URL
const get = partial(fetch, '/api');
\`\`\`

### The classic loop closure bug — and the fix

\`\`\`js
// BUG: all handlers close over the same i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// prints: 3, 3, 3

// FIX 1: use let (block-scoped, new binding each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// prints: 0, 1, 2

// FIX 2: IIFE to capture current value (old-school)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// prints: 0, 1, 2
\`\`\`
  `
},
{
  slug: 'memory-management',
  title: 'Memory Management',
  description: 'How JavaScript allocates and frees memory, common memory leaks, and how to find them.',
  level: 'advanced',
  icon: '◉',
  tags: ['memory', 'garbage collection', 'leaks', 'performance'],
  content: `
## Memory Management

### How JavaScript manages memory

JavaScript automatically allocates memory when you create values and frees it via garbage collection (GC). The most common GC algorithm is **mark-and-sweep** — it marks everything reachable from root objects (global, call stack) and sweeps away everything else.

\`\`\`js
// Allocated automatically
let obj = { name: 'Alice' }; // object created in memory
let arr = [1, 2, 3];         // array created in memory

// Eligible for GC when no references remain
obj = null; // original object can now be collected
\`\`\`

### Common memory leak patterns

#### 1. Forgotten event listeners

\`\`\`js
// LEAK: listener added every time component mounts
function setup() {
  window.addEventListener('resize', handleResize);
}

// FIX: remove when no longer needed
function setup() {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}
\`\`\`

#### 2. Closures holding large objects

\`\`\`js
// LEAK: bigData is captured by the returned function
// and never released even if you don't need it anymore
function createHandler() {
  const bigData = new Array(1000000).fill('x');
  return function handler() {
    console.log('handled'); // bigData stays in memory forever
  };
}

// FIX: don't close over what you don't need
function createHandler() {
  const bigData = new Array(1000000).fill('x');
  const summary = bigData.length; // extract only what you need
  bigData = null; // explicitly release
  return function handler() {
    console.log('handled', summary);
  };
}
\`\`\`

#### 3. Detached DOM nodes

\`\`\`js
// LEAK: element removed from DOM but still referenced in JS
let detached;
function remove() {
  const el = document.querySelector('#item');
  detached = el; // still holds reference
  el.remove();   // removed from DOM, but not from memory
}

// FIX: null out the reference when done
function remove() {
  const el = document.querySelector('#item');
  el.remove();
  // detached = null; if you stored it somewhere
}
\`\`\`

#### 4. Timers not cleared

\`\`\`js
// LEAK: interval keeps running and holding closure references
const id = setInterval(() => {
  doWork(bigObject);
}, 1000);

// FIX: always clear intervals when done
clearInterval(id);
\`\`\`

### WeakRef — hold a reference without preventing GC

\`\`\`js
let obj = { name: 'Alice' };
const ref = new WeakRef(obj);

// Later, obj may have been collected
const val = ref.deref();
if (val) {
  console.log(val.name); // still alive
} else {
  console.log('collected');
}
\`\`\`

### Finding leaks in Chrome DevTools

\`\`\`js
// 1. Open DevTools → Memory tab
// 2. Take a heap snapshot (baseline)
// 3. Do the action you suspect leaks
// 4. Take another snapshot
// 5. Compare — look for objects that grew unexpectedly

// Useful in console:
// performance.memory.usedJSHeapSize — current heap usage
console.log(performance.memory.usedJSHeapSize / 1024 / 1024 + ' MB');
\`\`\`
  `
},
{
  slug: 'web-workers',
  title: 'Web Workers',
  description: 'Run JavaScript in background threads. Offload heavy computation without blocking the UI.',
  level: 'advanced',
  icon: '⚙',
  tags: ['web workers', 'threads', 'performance', 'concurrency'],
  content: `
## Web Workers

JavaScript runs on a single thread — heavy computation blocks the UI. Web Workers let you run scripts in background threads, communicating via messages.

### Creating a worker

\`\`\`js
// worker.js — runs in a separate thread
self.addEventListener('message', (e) => {
  const { data } = e;
  const result = heavyComputation(data);
  self.postMessage(result);
});

function heavyComputation(n) {
  let result = 0;
  for (let i = 0; i < n; i++) result += i;
  return result;
}
\`\`\`

\`\`\`js
// main.js — UI thread
const worker = new Worker('./worker.js');

worker.postMessage(1_000_000_000); // send data to worker

worker.addEventListener('message', (e) => {
  console.log('Result:', e.data); // receive result
});

worker.addEventListener('error', (e) => {
  console.error('Worker error:', e.message);
});

// Terminate when done
worker.terminate();
\`\`\`

### Transferable objects — zero-copy transfer

\`\`\`js
// Normally postMessage clones data (slow for large buffers)
// Transfer ownership instead — original becomes unusable

const buffer = new ArrayBuffer(1024 * 1024 * 32); // 32MB

// Transfer (fast, zero-copy)
worker.postMessage({ buffer }, [buffer]);
// buffer is now neutered in main thread — worker owns it

// Worker sends it back
self.addEventListener('message', (e) => {
  const { buffer } = e.data;
  // process buffer...
  self.postMessage({ buffer }, [buffer]); // transfer back
});
\`\`\`

### Worker pool — reuse workers for many tasks

\`\`\`js
class WorkerPool {
  constructor(workerUrl, size = navigator.hardwareConcurrency) {
    this.workers = Array.from({ length: size }, () => ({
      worker: new Worker(workerUrl),
      busy: false,
    }));
    this.queue = [];
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const free = this.workers.find(w => !w.busy);
      if (free) {
        this._dispatch(free, data, resolve, reject);
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  _dispatch(slot, data, resolve, reject) {
    slot.busy = true;
    slot.worker.onmessage = (e) => {
      resolve(e.data);
      slot.busy = false;
      if (this.queue.length) {
        const next = this.queue.shift();
        this._dispatch(slot, next.data, next.resolve, next.reject);
      }
    };
    slot.worker.onerror = (e) => { reject(e); slot.busy = false; };
    slot.worker.postMessage(data);
  }
}

const pool = new WorkerPool('./worker.js', 4);
const results = await Promise.all(chunks.map(chunk => pool.run(chunk)));
\`\`\`

### What workers can and cannot do

\`\`\`js
// Workers CAN:
// - Use fetch, XMLHttpRequest
// - Use setTimeout, setInterval
// - Use IndexedDB
// - Import scripts with importScripts()
// - Use most Web APIs

// Workers CANNOT:
// - Access the DOM
// - Access window, document
// - Access parent variables directly
// - Use localStorage (use IndexedDB instead)
\`\`\`
  `
},
{
  slug: 'websockets',
  title: 'WebSockets',
  description: 'Full-duplex real-time communication between browser and server.',
  level: 'advanced',
  icon: '⇄',
  tags: ['WebSocket', 'real-time', 'network', 'events'],
  content: `
## WebSockets

HTTP is request-response — the client always initiates. WebSockets provide a persistent, full-duplex channel — either side can send messages at any time.

### Basic connection

\`\`\`js
const ws = new WebSocket('wss://api.example.com/socket');
// wss:// = secure (like https), ws:// = insecure

ws.addEventListener('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
});

ws.addEventListener('message', (e) => {
  const data = JSON.parse(e.data);
  console.log('Received:', data);
});

ws.addEventListener('close', (e) => {
  console.log('Disconnected:', e.code, e.reason);
});

ws.addEventListener('error', (e) => {
  console.error('WebSocket error:', e);
});

// Close from client
ws.close(1000, 'Done'); // 1000 = normal closure
\`\`\`

### Connection states

\`\`\`js
ws.readyState;
// WebSocket.CONNECTING = 0
// WebSocket.OPEN       = 1
// WebSocket.CLOSING    = 2
// WebSocket.CLOSED     = 3

// Only send when open
function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}
\`\`\`

### Auto-reconnect with exponential backoff

\`\`\`js
class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.delay = 1000;
    this.maxDelay = 30000;
    this.handlers = {};
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.delay = 1000; // reset on successful connect
      this.handlers.open?.();
    };

    this.ws.onmessage = (e) => this.handlers.message?.(e);

    this.ws.onclose = () => {
      console.log(\`Reconnecting in \${this.delay}ms\`);
      setTimeout(() => this.connect(), this.delay);
      this.delay = Math.min(this.delay * 2, this.maxDelay);
    };
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  on(event, handler) {
    this.handlers[event] = handler;
    return this;
  }
}

const socket = new ReconnectingWebSocket('wss://api.example.com/ws');
socket.on('message', (e) => console.log(JSON.parse(e.data)));
socket.send({ type: 'ping' });
\`\`\`

### Heartbeat — detect stale connections

\`\`\`js
// Many proxies drop idle connections after 60-90 seconds.
// Send a ping periodically to keep the connection alive.

let heartbeat;

ws.addEventListener('open', () => {
  heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000); // every 30 seconds
});

ws.addEventListener('close', () => {
  clearInterval(heartbeat);
});
\`\`\`

### WebSocket vs HTTP polling

| | WebSocket | HTTP Polling |
|---|---|---|
| Direction | Full-duplex | Client-initiated only |
| Latency | Very low | Depends on interval |
| Overhead | Low after handshake | Headers on every request |
| Use for | Chat, live data, games | Occasional updates |
  `
},
{
  slug: 'security',
  title: 'JavaScript Security',
  description: 'XSS, CSRF, Content Security Policy, and how to write defensively in the browser.',
  level: 'advanced',
  icon: '🔒',
  tags: ['security', 'XSS', 'CSRF', 'CSP'],
  content: `
## JavaScript Security

### XSS — Cross-Site Scripting

XSS happens when attacker-controlled input gets executed as JavaScript.

\`\`\`js
// VULNERABLE — never do this
const name = getUserInput();
element.innerHTML = name;
// If name = '<script>steal(document.cookie)</script>', it executes!

// SAFE options:
element.textContent = name;        // escapes everything
element.setAttribute('data-name', name); // safe for attributes

// If you must use innerHTML, sanitize first:
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userHtml);
\`\`\`

\`\`\`js
// VULNERABLE — building HTML by concatenation
const html = '<div>' + userInput + '</div>';

// SAFE — use template with textContent after
const div = document.createElement('div');
div.textContent = userInput;
\`\`\`

### Content Security Policy (CSP)

CSP is a response header that tells the browser what scripts are allowed to run.

\`\`\`js
// Set by server — HTTP header
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com

// This blocks:
// - Inline <script> tags
// - eval()
// - Scripts from unauthorized domains

// In meta tag (less powerful, no report-uri)
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
\`\`\`

### CSRF — Cross-Site Request Forgery

CSRF tricks a logged-in user's browser into making unintended requests.

\`\`\`js
// Attack: malicious site makes request to bank.com using victim's cookies
// <img src="https://bank.com/transfer?to=attacker&amount=10000">

// Defense 1: CSRF tokens (server generates, client echoes)
const token = document.querySelector('meta[name="csrf-token"]').content;
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token,
  },
  body: JSON.stringify({ to: 'bob', amount: 100 }),
});

// Defense 2: SameSite cookies (server sets)
Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
// SameSite=Strict — cookie not sent on cross-site requests at all
// SameSite=Lax    — sent on top-level navigations only
\`\`\`

### Sensitive data handling

\`\`\`js
// NEVER store in localStorage/sessionStorage:
// - Auth tokens (use HttpOnly cookies instead)
// - Passwords
// - Credit card numbers
// - PII

// HttpOnly cookie — JS cannot read it, XSS can't steal it
// Server sets: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// If you must store tokens in JS (SPAs), accept the tradeoff:
// - Keep tokens short-lived (15 min)
// - Use refresh tokens in HttpOnly cookies
// - Clear on logout: localStorage.clear()
\`\`\`

### eval and dangerous patterns

\`\`\`js
// NEVER use eval with user input
eval(userInput); // executes arbitrary code

// Also dangerous:
new Function(userInput)();
setTimeout(userInput, 0); // string form of setTimeout
document.write(userInput);

// Safe alternatives:
// - JSON.parse instead of eval for data
// - textContent instead of innerHTML for display
// - Sandboxed iframes with allow-scripts but no allow-same-origin
\`\`\`

### Subresource Integrity (SRI)

\`\`\`html
<!-- Verify CDN scripts haven't been tampered with -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous">
</script>
<!-- Browser checks hash — if it doesn't match, script is blocked -->
\`\`\`
  `
},
{
  slug: 'performance',
  title: 'Performance Optimization',
  description: 'Measuring, profiling, and fixing JavaScript performance issues in real applications.',
  level: 'advanced',
  icon: '⚡',
  tags: ['performance', 'optimization', 'profiling', 'rendering'],
  content: `
## Performance Optimization

### Measure first, optimize second

\`\`\`js
// performance.now() — high-resolution timer
const start = performance.now();
doExpensiveWork();
const end = performance.now();
console.log(\`Took \${end - start}ms\`);

// console.time / timeEnd — quick profiling
console.time('sort');
largeArray.sort();
console.timeEnd('sort'); // sort: 23.4ms

// User Timing API — mark and measure named spans
performance.mark('render-start');
renderComponent();
performance.mark('render-end');
performance.measure('render', 'render-start', 'render-end');
performance.getEntriesByName('render')[0].duration; // ms
\`\`\`

### Avoid layout thrashing

\`\`\`js
// SLOW: read → write → read → write (forces browser to recalculate layout each time)
for (const el of elements) {
  const height = el.offsetHeight; // read — forces layout
  el.style.height = height + 10 + 'px'; // write
}

// FAST: batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // all reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // all writes
});

// BETTER: use requestAnimationFrame for visual updates
requestAnimationFrame(() => {
  elements.forEach((el, i) => {
    el.style.height = heights[i] + 10 + 'px';
  });
});
\`\`\`

### Debounce and throttle expensive handlers

\`\`\`js
// Resize and scroll fire hundreds of times per second
window.addEventListener('scroll', throttle(updatePosition, 16)); // ~60fps
window.addEventListener('resize', debounce(recalculateLayout, 150));
\`\`\`

### Virtual lists — only render what's visible

\`\`\`js
// Rendering 10,000 DOM nodes is slow.
// Only render what's in the viewport.

function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={e => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => (
          <div key={startIndex + i} style={{
            position: 'absolute',
            top: (startIndex + i) * itemHeight,
            height: itemHeight
          }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

### Code splitting — load only what you need

\`\`\`js
// Static import — always loaded
import HeavyChart from './HeavyChart';

// Dynamic import — loaded on demand
const HeavyChart = await import('./HeavyChart');

// In React
const HeavyChart = React.lazy(() => import('./HeavyChart'));

// Route-based splitting (load page code only when navigating to it)
const AdminPage = React.lazy(() => import('./pages/Admin'));
\`\`\`

### Object pooling — reuse objects instead of creating new ones

\`\`\`js
// In hot loops, avoid creating objects — GC pauses hurt performance
class ObjectPool {
  constructor(create, reset, initialSize = 10) {
    this.create = create;
    this.reset = reset;
    this.pool = Array.from({ length: initialSize }, create);
  }

  acquire() {
    return this.pool.pop() ?? this.create();
  }

  release(obj) {
    this.reset(obj);
    this.pool.push(obj);
  }
}

const vecPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (v) => { v.x = 0; v.y = 0; }
);

// In game loop
const vel = vecPool.acquire();
vel.x = 5; vel.y = 3;
// ... use vel ...
vecPool.release(vel); // reuse instead of GC
\`\`\`
  `
}
];

export const challenges = [
  {
    id: 1,
    title: 'Flatten a nested array',
    description: 'Implement flattenArray(arr) that works like Array.flat(Infinity) — without using .flat().',
    level: 'intermediate',
    tags: ['arrays', 'recursion'],
    starterCode: `function flattenArray(arr) {
  // your implementation here
}

// Tests
console.log(flattenArray([1, [2, [3, [4]]]]));
// Expected: [1, 2, 3, 4]

console.log(flattenArray([[1, 2], [3, [4, [5]]]]));
// Expected: [1, 2, 3, 4, 5]`,
    solution: `function flattenArray(arr) {
  return arr.reduce((flat, item) =>
    flat.concat(Array.isArray(item) ? flattenArray(item) : item), []);
}`,
    hint: 'Think recursively — if an element is an array, flatten it too.'
  },
  {
    id: 2,
    title: 'Build Promise.all() from scratch',
    description: 'Implement myPromiseAll(promises) that behaves like Promise.all() — resolves when all resolve, rejects on first rejection.',
    level: 'advanced',
    tags: ['async', 'promises'],
    starterCode: `function myPromiseAll(promises) {
  // your implementation here
}

// Tests
myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]

myPromiseAll([
  Promise.resolve(1),
  Promise.reject("oops"),
  Promise.resolve(3)
]).catch(console.error); // "oops"`,
    solution: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((promise, i) => {
      Promise.resolve(promise).then(value => {
        results[i] = value;
        completed++;
        if (completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}`,
    hint: 'Track how many promises have resolved. When the count matches the input length, resolve with all results.'
  },
  {
    id: 3,
    title: 'Implement debounce',
    description: 'Write debounce(fn, delay) — returns a function that only calls fn after delay ms of silence.',
    level: 'intermediate',
    tags: ['closures', 'timers'],
    starterCode: `function debounce(fn, delay) {
  // your implementation here
}

// Test: this should only log once after typing stops
const search = debounce((query) => {
  console.log("Searching for:", query);
}, 300);

search("j");
search("ja");
search("jav");
search("java"); // Only this call fires (after 300ms silence)`,
    solution: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    hint: 'Use a closure to hold a timer reference. Clear it on each call, reset it fresh.'
  },
  {
    id: 4,
    title: 'Deep clone an object',
    description: 'Write deepClone(obj) that handles nested objects, arrays, and Date — without JSON.parse/stringify.',
    level: 'advanced',
    tags: ['objects', 'recursion'],
    starterCode: `function deepClone(obj) {
  // your implementation here
}

// Tests
const original = {
  name: "Alice",
  scores: [1, 2, 3],
  address: { city: "Prayagraj" },
  created: new Date("2024-01-01")
};

const clone = deepClone(original);
clone.address.city = "Mumbai";
clone.scores.push(4);

console.log(original.address.city); // "Prayagraj" (unchanged)
console.log(original.scores);       // [1, 2, 3] (unchanged)`,
    solution: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}`,
    hint: 'Handle each type separately: primitives, Dates, arrays, then plain objects. Recurse on values.'
  },
  {
    id: 5,
    title: 'Build an EventEmitter',
    description: 'Implement a class with on(event, fn), off(event, fn), and emit(event, ...args).',
    level: 'intermediate',
    tags: ['OOP', 'design patterns'],
    starterCode: `class EventEmitter {
  // your implementation here
}

// Tests
const emitter = new EventEmitter();

function onData(data) {
  console.log("received:", data);
}

emitter.on("data", onData);
emitter.emit("data", { id: 1 }); // "received: { id: 1 }"
emitter.emit("data", { id: 2 }); // "received: { id: 2 }"
emitter.off("data", onData);
emitter.emit("data", { id: 3 }); // nothing (listener removed)`,
    solution: `class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }
  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
    return this;
  }
  off(event, fn) {
    const fns = this.listeners.get(event) || [];
    this.listeners.set(event, fns.filter(f => f !== fn));
    return this;
  }
  emit(event, ...args) {
    (this.listeners.get(event) || []).forEach(fn => fn(...args));
    return this;
  }
}`,
    hint: 'Use a Map of event name → array of functions. on() pushes, off() filters, emit() calls each.'
  },
  {
    id: 6,
    title: 'Implement Array.prototype.reduce',
    description: 'Write myReduce(arr, fn, initialValue) that replicates the native .reduce() behaviour.',
    level: 'beginner',
    tags: ['arrays', 'functional'],
    starterCode: `function myReduce(arr, fn, initialValue) {
  // your implementation here
}

// Tests
console.log(myReduce([1, 2, 3, 4], (acc, val) => acc + val, 0));
// Expected: 10

console.log(myReduce([1, 2, 3], (acc, val) => [...acc, val * 2], []));
// Expected: [2, 4, 6]

console.log(myReduce([5, 3, 8, 1], (max, val) => val > max ? val : max));
// Expected: 8 (no initial value — use first element)`,
    solution: `function myReduce(arr, fn, initialValue) {
  let acc = initialValue !== undefined ? initialValue : arr[0];
  const start = initialValue !== undefined ? 0 : 1;
  for (let i = start; i < arr.length; i++) {
    acc = fn(acc, arr[i], i, arr);
  }
  return acc;
}`,
    hint: 'If no initialValue, use arr[0] as accumulator and start iterating from index 1.'
  },
  {
    id: 7,
    title: 'Implement throttle',
    description: 'Write throttle(fn, limit) — returns a function that calls fn at most once every limit milliseconds, no matter how often it is invoked.',
    level: 'intermediate',
    tags: ['closures', 'timers', 'performance'],
    starterCode: `function throttle(fn, limit) {
  // your implementation here
}

// Test: scroll handler that fires at most once per 200ms
const onScroll = throttle(() => {
  console.log("scroll fired at", Date.now());
}, 200);

// Simulate rapid calls
onScroll(); // fires immediately
onScroll(); // ignored (within 200ms)
onScroll(); // ignored

setTimeout(onScroll, 250); // fires (past 200ms window)
setTimeout(() => console.log("done"), 300);`,
    solution: `function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}`,
    hint: 'Track the timestamp of the last successful call. Only invoke fn if enough time has passed since then.'
  },
  {
    id: 8,
    title: 'Implement curry',
    description: 'Write curry(fn) that transforms a multi-argument function into a chain of single-argument functions. curry(add)(1)(2)(3) should equal add(1, 2, 3).',
    level: 'advanced',
    tags: ['closures', 'functional', 'higher-order functions'],
    starterCode: `function curry(fn) {
  // your implementation here
}

// Tests
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6
console.log(curriedAdd(1, 2, 3));   // 6

const multiply = (a, b) => a * b;
const double = curry(multiply)(2);
console.log(double(5));  // 10
console.log(double(7));  // 14`,
    solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}`,
    hint: 'Compare args.length to fn.length (the function\'s expected arity). If you have enough args, call fn. Otherwise return a new function that collects more.'
  },
  {
    id: 9,
    title: 'Implement pipe',
    description: 'Write pipe(...fns) that composes functions left-to-right: pipe(f, g, h)(x) === h(g(f(x))). Then implement compose that goes right-to-left.',
    level: 'intermediate',
    tags: ['functional', 'composition', 'higher-order functions'],
    starterCode: `function pipe(...fns) {
  // your implementation here
}

function compose(...fns) {
  // your implementation here
}

// Tests
const double = x => x * 2;
const addTen = x => x + 10;
const square = x => x * x;

const transform = pipe(double, addTen, square);
console.log(transform(3));  // square(addTen(double(3))) = square(16) = 256

const transform2 = compose(square, addTen, double);
console.log(transform2(3)); // same result: 256

// Real-world example
const processName = pipe(
  s => s.trim(),
  s => s.toLowerCase(),
  s => s.replace(/\\s+/g, '-')
);
console.log(processName("  Hello World  ")); // "hello-world"`,
    solution: `function pipe(...fns) {
  return (x) => fns.reduce((v, f) => f(v), x);
}

function compose(...fns) {
  return (x) => fns.reduceRight((v, f) => f(v), x);
}`,
    hint: 'pipe uses reduce (left-to-right), compose uses reduceRight (right-to-left). Both thread a value through each function in sequence.'
  },
  {
  id: 10,
  title: 'Check if a string is a palindrome',
  description: 'Write isPalindrome(str) that returns true if the string reads the same forwards and backwards. Ignore case and non-alphanumeric characters.',
  level: 'beginner',
  tags: ['strings', 'regex'],
  starterCode: `function isPalindrome(str) {
  // your implementation here
}

// Tests
console.log(isPalindrome('racecar'));        // true
console.log(isPalindrome('A man a plan a canal Panama')); // true
console.log(isPalindrome('hello'));          // false
console.log(isPalindrome('Was it a car or a cat I saw')); // true`,
  solution: `function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
  hint: 'Strip non-alphanumeric characters and lowercase first, then compare the string to its reverse.'
},
{
  id: 11,
  title: 'Count word frequency',
  description: 'Write wordFrequency(str) that returns an object with each word as a key and its count as the value. Case-insensitive.',
  level: 'beginner',
  tags: ['strings', 'objects', 'reduce'],
  starterCode: `function wordFrequency(str) {
  // your implementation here
}

// Tests
console.log(wordFrequency('the cat sat on the mat'));
// { the: 2, cat: 1, sat: 1, on: 1, mat: 1 }

console.log(wordFrequency('To be or not to be'));
// { to: 2, be: 2, or: 1, not: 1 }

console.log(wordFrequency(''));
// {}`,
  solution: `function wordFrequency(str) {
  if (!str.trim()) return {};
  return str.toLowerCase().split(/\s+/).reduce((acc, word) => {
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, {});
}`,
  hint: 'Split on whitespace, lowercase each word, then use reduce to build the frequency object.'
},
{
  id: 12,
  title: 'Parse a query string',
  description: 'Write parseQuery(str) that converts a URL query string into an object. Handle repeated keys as arrays.',
  level: 'beginner',
  tags: ['strings', 'objects'],
  starterCode: `function parseQuery(str) {
  // your implementation here
}

// Tests
console.log(parseQuery('name=Alice&age=25&active=true'));
// { name: 'Alice', age: '25', active: 'true' }

console.log(parseQuery('tag=js&tag=react&tag=css'));
// { tag: ['js', 'react', 'css'] }

console.log(parseQuery('?page=1&limit=10'));
// { page: '1', limit: '10' }`,
  solution: `function parseQuery(str) {
  const query = str.startsWith('?') ? str.slice(1) : str;
  if (!query) return {};
  return query.split('&').reduce((acc, pair) => {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    if (key in acc) {
      acc[key] = [].concat(acc[key], value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}`,
  hint: 'Split on & to get pairs, then on = to get key/value. If a key already exists, convert it to an array.'
},
{
  id: 13,
  title: 'Memoize a function',
  description: 'Write memoize(fn) that caches results based on arguments. Repeated calls with the same arguments should return the cached result without calling fn again.',
  level: 'intermediate',
  tags: ['closures', 'cache', 'optimization'],
  starterCode: `function memoize(fn) {
  // your implementation here
}

// Tests
let callCount = 0;
const slowSquare = (n) => {
  callCount++;
  return n * n;
};

const fastSquare = memoize(slowSquare);

console.log(fastSquare(4));  // 16
console.log(fastSquare(4));  // 16 (cached)
console.log(fastSquare(5));  // 25
console.log(fastSquare(5));  // 25 (cached)
console.log('fn called:', callCount); // fn called: 2 (not 4)`,
  solution: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
  hint: 'Use a Map to store results. Serialize the arguments array as the cache key.'
},
{
  id: 14,
  title: 'Implement Promise.race',
  description: 'Write myPromiseRace(promises) that resolves or rejects as soon as the first promise settles.',
  level: 'intermediate',
  tags: ['promises', 'async'],
  starterCode: `function myPromiseRace(promises) {
  // your implementation here
}

// Tests
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 200));
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 50));
const fail = new Promise((_, reject) => setTimeout(() => reject('error'), 100));

myPromiseRace([slow, fast]).then(console.log);   // 'fast'
myPromiseRace([slow, fail]).catch(console.error); // 'error'
myPromiseRace([fast, fail]).then(console.log);    // 'fast' (wins before fail)`,
  solution: `function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve).catch(reject);
    }
  });
}`,
  hint: 'The first call to resolve or reject wins — subsequent calls are ignored by the Promise constructor.'
},
{
  id: 15,
  title: 'Build an LRU Cache',
  description: 'Implement an LRU (Least Recently Used) cache with get(key) and put(key, value). When capacity is exceeded, evict the least recently used item.',
  level: 'intermediate',
  tags: ['data structures', 'Map', 'cache'],
  starterCode: `class LRUCache {
  constructor(capacity) {
    // your implementation here
  }

  get(key) {
    // return value or -1 if not found
  }

  put(key, value) {
    // insert or update, evict LRU if over capacity
  }
}

// Tests
const cache = new LRUCache(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
console.log(cache.get('a')); // 1 (a is now most recently used)
cache.put('d', 4);           // evicts 'b' (least recently used)
console.log(cache.get('b')); // -1 (evicted)
console.log(cache.get('c')); // 3
console.log(cache.get('d')); // 4`,
  solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // move to end (most recent)
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value); // delete first (oldest)
    }
  }
}`,
  hint: 'Map preserves insertion order. Delete and re-insert on access to move to end. The first key is always the LRU.'
},
{
  id: 16,
  title: 'Group array by key',
  description: 'Write groupBy(arr, fn) that groups array elements by the return value of fn. Returns an object where keys are group names and values are arrays.',
  level: 'intermediate',
  tags: ['arrays', 'reduce', 'objects'],
  starterCode: `function groupBy(arr, fn) {
  // your implementation here
}

// Tests
const people = [
  { name: 'Alice', dept: 'engineering' },
  { name: 'Bob', dept: 'design' },
  { name: 'Carol', dept: 'engineering' },
  { name: 'Dave', dept: 'design' },
  { name: 'Eve', dept: 'engineering' },
];

console.log(groupBy(people, p => p.dept));
// {
//   engineering: [Alice, Carol, Eve],
//   design: [Bob, Dave]
// }

console.log(groupBy([1,2,3,4,5,6], n => n % 2 === 0 ? 'even' : 'odd'));
// { odd: [1,3,5], even: [2,4,6] }`,
  solution: `function groupBy(arr, fn) {
  return arr.reduce((groups, item) => {
    const key = fn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}`,
  hint: 'Use reduce. For each item, call fn to get the group key, then push the item into that group array.'
},
{
  id: 17,
  title: 'Build a reactive observable value',
  description: 'Implement createSignal(initialValue) that returns [get, set]. Subscribers registered with subscribe(fn) are called whenever the value changes.',
  level: 'intermediate',
  tags: ['closures', 'reactive', 'patterns'],
  starterCode: `function createSignal(initialValue) {
  // your implementation here
  // return [get, set, subscribe]
}

// Tests
const [count, setCount, subscribe] = createSignal(0);

subscribe(val => console.log('count changed:', val));

console.log(count()); // 0
setCount(1);          // count changed: 1
setCount(2);          // count changed: 2
console.log(count()); // 2

// Multiple subscribers
const [name, setName, onName] = createSignal('Alice');
onName(v => console.log('name:', v));
onName(v => console.log('greeting: Hello', v));
setName('Bob');
// name: Bob
// greeting: Hello Bob`,
  solution: `function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  const get = () => value;

  const set = (newValue) => {
    if (newValue === value) return;
    value = newValue;
    subscribers.forEach(fn => fn(value));
  };

  const subscribe = (fn) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn); // returns unsubscribe
  };

  return [get, set, subscribe];
}`,
  hint: 'Store subscribers in a Set. get() returns the value. set() updates and notifies all subscribers.'
},
{
  id: 18,
  title: 'Build a minimal Promise',
  description: 'Implement MyPromise with a constructor, .then(), and .catch(). Support chaining — .then() should return a new MyPromise.',
  level: 'advanced',
  tags: ['promises', 'async', 'OOP'],
  starterCode: `class MyPromise {
  constructor(executor) {
    // your implementation here
  }

  then(onFulfilled, onRejected) {
    // return a new MyPromise
  }

  catch(onRejected) {
    // shorthand for then(null, onRejected)
  }
}

// Tests
new MyPromise((resolve) => resolve(1))
  .then(v => v + 1)
  .then(v => v * 2)
  .then(v => console.log(v)); // 4

new MyPromise((_, reject) => reject('oops'))
  .then(v => console.log('should not run'))
  .catch(e => console.log('caught:', e)); // caught: oops

new MyPromise((resolve) => resolve(10))
  .then(v => new MyPromise(resolve => resolve(v * 2)))
  .then(v => console.log(v)); // 20`,
  solution: `class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];
    try {
      executor(
        (value) => this._resolve(value),
        (reason) => this._reject(reason)
      );
    } catch(e) { this._reject(e); }
  }

  _resolve(value) {
    if (this.state !== 'pending') return;
    if (value instanceof MyPromise) {
      value.then(v => this._resolve(v), r => this._reject(r));
      return;
    }
    this.state = 'fulfilled';
    this.value = value;
    this.handlers.forEach(h => h());
  }

  _reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    this.value = reason;
    this.handlers.forEach(h => h());
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        try {
          if (this.state === 'fulfilled') {
            resolve(onFulfilled ? onFulfilled(this.value) : this.value);
          } else if (this.state === 'rejected') {
            if (onRejected) resolve(onRejected(this.value));
            else reject(this.value);
          }
        } catch(e) { reject(e); }
      };
      if (this.state === 'pending') this.handlers.push(handle);
      else setTimeout(handle, 0);
    });
  }

  catch(onRejected) { return this.then(null, onRejected); }
}`,
  hint: 'Store handlers in an array for when the promise is still pending. When resolved/rejected, run them. then() returns a new MyPromise that resolves with the return value of the handler.'
},
{
  id: 19,
  title: 'Implement deep equality',
  description: 'Write deepEqual(a, b) that returns true if two values are deeply equal — works for nested objects, arrays, and primitives.',
  level: 'advanced',
  tags: ['recursion', 'objects', 'arrays'],
  starterCode: `function deepEqual(a, b) {
  // your implementation here
}

// Tests
console.log(deepEqual(1, 1));                   // true
console.log(deepEqual('hello', 'hello'));        // true
console.log(deepEqual([1, 2, 3], [1, 2, 3]));   // true
console.log(deepEqual([1, 2], [1, 2, 3]));       // false
console.log(deepEqual(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 2 } }
));                                              // true
console.log(deepEqual(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 3 } }
));                                              // false
console.log(deepEqual(null, null));              // true
console.log(deepEqual(null, undefined));         // false`,
  solution: `function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEqual(a[key], b[key]));
}`,
  hint: 'Handle primitives with ===. For objects, check that both have the same keys and recursively compare each value.'
},
{
  id: 20,
  title: 'Implement a rate limiter',
  description: 'Write createRateLimiter(maxCalls, windowMs) that returns a function wrapper. The wrapped function can only be called maxCalls times per windowMs milliseconds. Extra calls should be ignored.',
  level: 'advanced',
  tags: ['closures', 'timers', 'performance'],
  starterCode: `function createRateLimiter(maxCalls, windowMs) {
  // your implementation here
}

// Tests
const limiter = createRateLimiter(3, 1000); // 3 calls per second

const limited = limiter((msg) => console.log(msg));

limited('call 1'); // logs: call 1
limited('call 2'); // logs: call 2
limited('call 3'); // logs: call 3
limited('call 4'); // ignored (over limit)
limited('call 5'); // ignored (over limit)

setTimeout(() => {
  limited('call 6'); // logs: call 6 (new window)
}, 1100);`,
  solution: `function createRateLimiter(maxCalls, windowMs) {
  return function(fn) {
    let calls = [];
    return function(...args) {
      const now = Date.now();
      calls = calls.filter(t => now - t < windowMs);
      if (calls.length < maxCalls) {
        calls.push(now);
        return fn.apply(this, args);
      }
    };
  };
}`,
  hint: 'Track timestamps of recent calls. Filter out timestamps older than windowMs. If remaining count is under the limit, allow the call.'
},
{
  id: 21,
  title: 'Flatten a nested object',
  description: 'Write flattenObject(obj) that converts a deeply nested object into a flat object with dot-notation keys.',
  level: 'intermediate',
  tags: ['objects', 'recursion'],
  starterCode: `function flattenObject(obj, prefix = '') {
  // your implementation here
}

// Tests
console.log(flattenObject({
  name: 'Alice',
  address: {
    city: 'Prayagraj',
    zip: { code: '211001', suffix: '0001' }
  },
  age: 25
}));
// {
//   'name': 'Alice',
//   'address.city': 'Prayagraj',
//   'address.zip.code': '211001',
//   'address.zip.suffix': '0001',
//   'age': 25
// }`,
  solution: `function flattenObject(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, fullKey));
    } else {
      acc[fullKey] = value;
    }
    return acc;
  }, {});
}`,
  hint: 'Recurse into nested objects, building the key path as you go. Use dot notation to join parent and child keys.'
}
];
