import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { useTopic } from '../hooks/useTopic'
import { useProgress } from '../context/ProgressContext'
import { useAuth } from '../context/AuthContext'
import styles from './TopicDetail.module.css'

// Transparent background so .pre container controls the surface
const readOnlyTheme = EditorView.theme({
  '&': { backgroundColor: 'transparent' },
  '.cm-content': { padding: '14px 0' },
  '.cm-line': { padding: '0 16px' },
  '.cm-scroller': { fontFamily: 'var(--font-code)', overflowX: 'auto' },
})

function CodeBlock({ code, lang }) {
  const isTS = lang === 'ts' || lang === 'typescript'
  return (
    <CodeMirror
      value={code}
      editable={false}
      theme={oneDark}
      extensions={[
        javascript({ typescript: isTS }),
        EditorView.editable.of(false),
        readOnlyTheme,
      ]}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
        autocompletion: false,
        closeBrackets: false,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
        searchKeymap: false,
      }}
    />
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      className={styles.copyBtn}
      onClick={handleCopy}
      style={copied ? { color: '#6BCB6B', borderColor: 'rgba(100,200,100,0.35)' } : {}}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  )
}

function TryButton({ code }) {
  const navigate = useNavigate()
  return (
    <button
      className={styles.tryBtn}
      onClick={() => navigate('/playground', { state: { code } })}
    >
      Try it →
    </button>
  )
}

function renderContent(content) {
  const lines = content.trim().split('\n')
  const elements = []
  let i = 0
  let codeBuffer = []
  let inCode = false
  let codeLang = ''

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true
        codeLang = line.slice(3).trim()
        codeBuffer = []
      } else {
        const codeText = codeBuffer.join('\n')
        elements.push(
          <div key={i} className={styles.pre}>
            <div className={styles.preHeader}>
              <span className={styles.preLang}>{codeLang || 'js'}</span>
              <div className={styles.preActions}>
                <TryButton code={codeText} />
                <CopyButton text={codeText} />
              </div>
            </div>
            <CodeBlock code={codeText} lang={codeLang} />
          </div>
        )
        inCode = false
        codeBuffer = []
        codeLang = ''
      }
      i++
      continue
    }

    if (inCode) {
      codeBuffer.push(line)
      i++
      continue
    }

    // Table: collect consecutive pipe-starting lines
    if (line.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      if (tableLines.length >= 2) {
        const parseRow = row => row.split('|').slice(1, -1).map(c => c.trim())
        const headers = parseRow(tableLines[0])
        const rows = tableLines.slice(2).map(parseRow)
        elements.push(
          <div key={`t${i}`} className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>{headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className={styles.h3}>{line.slice(4)}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className={styles.h2}>{line.slice(3)}</h2>)
    } else if (line.trim() === '') {
      elements.push(<div key={i} className={styles.spacer} />)
    } else {
      const parts = line.split(/(`[^`]+`)/)
      elements.push(
        <p key={i} className={styles.p}>
          {parts.map((part, j) =>
            part.startsWith('`') && part.endsWith('`')
              ? <code key={j} className={styles.inlineCode}>{part.slice(1, -1)}</code>
              : part
          )}
        </p>
      )
    }
    i++
  }
  return elements
}

const levelColor = { beginner: '#639922', intermediate: '#BA7517', advanced: '#E24B4A' }

export default function TopicDetail() {
  const { slug } = useParams()
  const { completedTopics, markTopicComplete, unmarkTopic } = useProgress()
  const { isAuthenticated } = useAuth()
  const { topic, loading, error } = useTopic(slug)

  if (loading) return <main className={styles.main}><div style={{padding:'4rem',textAlign:'center',color:'var(--muted)'}}>Loading...</div></main>
  if (error || !topic) return <Navigate to="/topics" replace />

  const isDone = completedTopics.includes(slug)

  return (
    <main className={styles.main}>
      <div className={styles.breadcrumb}>
        <Link to="/topics">Topics</Link>
        <span>/</span>
        <span>{topic.title}</span>
      </div>

      <div className={styles.topicHeader}>
        <div className={styles.topicIcon}>{topic.icon}</div>
        <div className={styles.topicHeaderBody}>
          <h1 className={styles.topicTitle}>{topic.title}</h1>
          <div className={styles.topicMeta}>
            <span className={styles.levelBadge} style={{ color: levelColor[topic.level], background: levelColor[topic.level] + '22' }}>
              {topic.level}
            </span>
            {topic.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
          </div>
        </div>
        {isAuthenticated ? (
          <button
            className={isDone ? styles.doneBtn : styles.markBtn}
            onClick={() => isDone ? unmarkTopic(slug) : markTopicComplete(slug)}
          >
            {isDone ? '✓ Completed' : 'Mark complete'}
          </button>
        ) : (
          <Link to="/login" state={{ from: `/topics/${slug}` }} className={styles.loginBtn}>
            Log in to track
          </Link>
        )}
      </div>

      <article className={styles.article}>
        {renderContent(topic.content)}
      </article>
    </main>
  )
}
