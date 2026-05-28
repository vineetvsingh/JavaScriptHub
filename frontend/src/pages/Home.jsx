import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useTopics } from '../hooks/useTopics'
import { useChallenges } from '../hooks/useChallenges'
import styles from './Home.module.css'

const levelColor = { beginner: '#639922', intermediate: '#BA7517', advanced: '#E24B4A' }

const PHRASES = ['back.', 'basics.', 'advanced.', 'mastery.', 'production.']

const CODE_SNIPPETS = [
  `// JS.hub
const learn = async (topic) => {
  const knowledge = await study(topic);
  return knowledge.apply();
};

const journey = [
  'variables', 'closures',
  'async/await', 'performance',
].map(learn);

await Promise.all(journey);
console.log('production ready ✓');`,

  `// closures
function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const counter = makeCounter(10);
counter.increment();
console.log(counter.value()); // 11`,

  `// debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const search = debounce(query, 300);
search('javascript');`,

  `// array methods
const products = [
  { name: 'Laptop', price: 75000 },
  { name: 'Phone', price: 25000 },
  { name: 'Tablet', price: 35000 },
];

const affordable = products
  .filter(p => p.price < 50000)
  .map(p => p.name);

console.log(affordable);`,

  `// fetch with error handling
async function getUser(id) {
  const res = await fetch('/api/' + id);
  if (!res.ok) {
    throw new Error('User not found');
  }
  return res.json();
}

const user = await getUser(1);
console.log(user.name);`,

  `// memoize
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}`,
]

const FULL_CODE = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]

function highlight(code) {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Split into lines, process each line
  return escaped.split('\n').map(line => {
    // If comment line, color whole line and return
    if (line.trimStart().startsWith('//')) {
      return `<span style="color:#7C8FF0">${line}</span>`
    }

    return line
      // strings
      .replace(/('[^']*'|"[^"]*")/g, '<span style="color:#98C379">$1</span>')
      // method calls
      .replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span style="color:#61AFEF">$1</span>')
      // keywords
      .replace(/\b(const|let|var|async|await|return|function|class|new|if|else|for|while|throw|this|extends|constructor|of|in|try|catch|finally|import|export|default|switch|case|break|continue|typeof|instanceof|delete|void|yield)\b/g, '<span style="color:#C678DD">$1</span>')
      // built-ins
      .replace(/\b(Promise|console|Map|Set|JSON|Object|Array|Error|Math|Date|setTimeout|clearTimeout|fetch)\b/g, '<span style="color:#E5C07B">$1</span>')
      // numbers
      .replace(/\b(\d+)\b/g, '<span style="color:#D19A66">$1</span>')
  }).join('\n')
}

export default function Home() {
  const { completedTopics } = useProgress()
  const { topics } = useTopics()
  const { challenges } = useChallenges()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [displayedCode, setDisplayedCode] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    let timeoutId
    const intervalId = setInterval(() => {
      setExiting(true)
      timeoutId = setTimeout(() => {
        setExiting(false)
        setPhraseIndex(i => (i + 1) % PHRASES.length)
      }, 300)
    }, 3000)
    return () => { clearInterval(intervalId); clearTimeout(timeoutId) }
  }, [])

  useEffect(() => {
    if (charIndex >= FULL_CODE.length) return
    const timeout = setTimeout(() => {
      setDisplayedCode(FULL_CODE.slice(0, charIndex + 1))
      setCharIndex(i => i + 1)
    }, 35)
    return () => clearTimeout(timeout)
  }, [charIndex])

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>// learn · practice · master</div>
          <h1 className={styles.heroTitle}>
            JavaScript,<br />front to{' '}
            <em
              key={phraseIndex}
              className={`${styles.heroPhrase} ${exiting ? styles.heroPhraseOut : ''}`}
            >
              {PHRASES[phraseIndex]}
            </em>
          </h1>
          <p className={styles.heroSub}>
            Everything you need to go from <code>console.log("hello")</code> to
            production-grade code. Pick a topic, crack a challenge, run it live.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/topics" className={styles.btnPrimary}>Start Learning</Link>
            <Link to="/playground" className={styles.btnGhost}>Open Playground</Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroCode}>
            <div className={styles.heroCodeHeader}>
              <span className={styles.dot} style={{background:'#FF5F57'}} />
              <span className={styles.dot} style={{background:'#FFBD2E'}} />
              <span className={styles.dot} style={{background:'#28C840'}} />
              <span className={styles.heroCodeFilename}>script.js</span>
              <Link
                to="/playground"
                state={{ code: FULL_CODE }}
                className={styles.tryItBtn}
              >
                Try it →
              </Link>
            </div>
            <pre className={styles.heroCodeBody}>
              <span dangerouslySetInnerHTML={{ __html: highlight(displayedCode) }} />
              <span className={styles.cursor}>▋</span>
            </pre>
          </div>
        </div>
      </section>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{topics.length || '—'}</span>
          <span className={styles.statLabel}>Topics</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{challenges.length || '—'}</span>
          <span className={styles.statLabel}>Challenges</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>ES2024</span>
          <span className={styles.statLabel}>Up to date</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>Live</span>
          <span className={styles.statLabel}>Playground</span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionAccent} />
          <h2>Core topics</h2>
          <span className={styles.sectionTag}>START HERE</span>
        </div>
        <div className={styles.topicsGrid}>
          {topics.slice(0, 6).map(topic => (
            <Link
              to={`/topics/${topic.slug}`}
              key={topic.slug}
              className={`${styles.topicCard} ${completedTopics.includes(topic.slug) ? styles.topicCardDone : ''}`}
              style={{ '--level-color': levelColor[topic.level] }}
            >
              {completedTopics.includes(topic.slug) && <span className={styles.doneBadge}>✓</span>}
              <div className={styles.topicIcon}>{topic.icon}</div>
              <div className={styles.topicTitle}>{topic.title}</div>
              <div className={styles.topicDesc}>{topic.description}</div>
              <span className={styles.topicPill} style={{ color: levelColor[topic.level], background: levelColor[topic.level] + '22' }}>
                {topic.level}
              </span>
            </Link>
          ))}
        </div>
        <div style={{ padding: '0 0 2rem 0', textAlign: 'center' }}>
          <Link to="/topics" className={styles.btnGhost}>View all {topics.length || '...'} topics →</Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionAccent} />
          <h2>Featured challenges</h2>
          <span className={styles.sectionTag}>PRACTICE</span>
        </div>
        <div className={styles.challengeList}>
          {challenges.slice(0, 3).map(ch => (
            <Link to="/challenges" key={ch.id} className={styles.challengeItem}>
              <span className={styles.chNum}>#{String(ch.id).padStart(3, '0')}</span>
              <div className={styles.chInfo}>
                <div className={styles.chTitle}>{ch.title}</div>
                <div className={styles.chMeta}>{ch.tags.join(' · ')}</div>
              </div>
              <span className={styles.chLevel} style={{ color: levelColor[ch.level], background: levelColor[ch.level] + '22' }}>
                {ch.level}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}