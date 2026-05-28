import { useSandbox } from '../hooks/useSandbox'
import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap } from '@codemirror/view'
import { Prec } from '@codemirror/state'
import styles from './Playground.module.css'

const SNIPPETS = [
  {
    label: 'Hello World',
    code: `// Welcome to the JS.hub Playground!
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("JavaScript"));
`
  },
  {
    label: 'Array methods',
    code: `const products = [
  { name: "Laptop", price: 75000, inStock: true },
  { name: "Phone", price: 25000, inStock: false },
  { name: "Tablet", price: 35000, inStock: true },
  { name: "Watch", price: 15000, inStock: true },
];

const affordable = products
  .filter(p => p.inStock && p.price < 40000)
  .map(p => p.name);

const totalStock = products
  .filter(p => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);

console.log("Affordable in-stock:", affordable);
console.log("Total stock value: ₹" + totalStock.toLocaleString());
`
  },
  {
    label: 'Closure counter',
    code: `function makeCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = initial; return count; },
    value: () => count
  };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.reset());     // 10
console.log(counter.value());     // 10
`
  },
  {
    label: 'Async/await',
    code: `// Simulated async API call
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "Alice", role: "developer" });
      else reject(new Error("Invalid ID"));
    }, 100);
  });
}

async function main() {
  try {
    const user = await fetchUser(1);
    console.log("User:", JSON.stringify(user));

    const [u1, u2] = await Promise.all([fetchUser(1), fetchUser(2)]);
    console.log("Parallel fetch:", u1.name, "&", u2.name);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
`
  },
  {
    label: 'Prototype chain',
    code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() { return \`\${this.name} barks!\`; }
}

const dog = new Dog("Rex", "Labrador");
console.log(dog.speak());
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true

let proto = dog;
while (proto) {
  console.log(proto.constructor?.name || "Object");
  proto = Object.getPrototypeOf(proto);
}
`
  }
]

export default function Playground() {
  const location = useLocation()
  const fromTopic = location.state?.code

  const [code, setCode] = useState(fromTopic || SNIPPETS[0].code)
  const [activeSnippet, setActiveSnippet] = useState(fromTopic ? null : 0)

  const { iframeRef, output, running, handleRun, handleRunRef, reset } = useSandbox(code)

  const handleSnippet = (i) => {
    setActiveSnippet(i)
    setCode(SNIPPETS[i].code)
    reset()
  }

  // Stable extensions — keymap calls handleRun via ref so deps stay empty
  const extensions = useMemo(() => [
    javascript(),
    Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => { handleRunRef.current?.(); return true } }]))
  ], [])

  return (
    <main className={styles.main}>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        title="code-sandbox"
        className={styles.sandbox}
      />

      <div className={styles.toolbar}>
        <div className={styles.snippets}>
          {activeSnippet === null && (
            <span className={styles.fromTopic}>// from topic</span>
          )}
          {SNIPPETS.map((s, i) => (
            <button
              key={i}
              className={`${styles.snippet} ${activeSnippet === i ? styles.snippetActive : ''}`}
              onClick={() => handleSnippet(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.toolbarRight}>
          <span className={styles.hint}>Ctrl+Enter to run</span>
          <button className={styles.clearBtn} onClick={reset}>Clear</button>
          <button className={styles.runBtn} onClick={handleRun} disabled={running}>
            {running ? '● Running' : '▶ Run'}
          </button>
        </div>
      </div>

      <div className={styles.editorArea}>
        <div className={styles.editorPane}>
          <div className={styles.paneHeader}>
            <div className={styles.dots}>
              <span /><span /><span />
            </div>
            <span className={styles.filename}>script.js</span>
          </div>
          <div className={styles.editorWrapper}>
            <CodeMirror
              value={code}
              height="100%"
              theme={oneDark}
              extensions={extensions}
              onChange={setCode}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
                autocompletion: true,
                foldGutter: false,
                dropCursor: false,
                indentOnInput: true,
              }}
            />
          </div>
        </div>

        <div className={styles.outputPane}>
          <div className={styles.paneHeader}>
            <span className={styles.filename}>// output</span>
            <div className={styles.paneStatus}>
              {running && <span className={styles.runningDot} />}
              {running && <span className={styles.runningLabel}>running</span>}
              {!running && output.length > 0 && (
                <span className={styles.lineCount}>{output.length} line{output.length > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          <div className={styles.outputContent}>
            {output.length === 0 ? (
              <div className={styles.emptyState}>
                {running ? (
                  <>
                    <div className={styles.emptyIcon}>⋯</div>
                    <div>Executing...</div>
                  </>
                ) : (
                  <>
                    <div className={styles.emptyIcon}>▶</div>
                    <div>Run your code to see output here</div>
                  </>
                )}
              </div>
            ) : (
              output.map((line, i) => (
                <div
                  key={i}
                  className={`${styles.line} ${
                    line.type === 'err' ? styles.lineErr :
                    line.type === 'warn' ? styles.lineWarn :
                    line.type === 'muted' ? styles.lineMuted :
                    styles.lineLog
                  }`}
                >
                  <span className={styles.lineNum}>{i + 1}</span>
                  <span className={styles.lineText}>{line.msg}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
