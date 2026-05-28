import { useSandbox } from '../hooks/useSandbox'
import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap } from '@codemirror/view'
import { Prec } from '@codemirror/state'
import { useChallenges } from '../hooks/useChallenges'
import { useProgress } from '../context/ProgressContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import styles from './Challenges.module.css'

const levelColor = { beginner: '#639922', intermediate: '#BA7517', advanced: '#E24B4A' }

export default function Challenges() {
  const { challenges, loading } = useChallenges()
  const { completedChallenges, markChallengeComplete, unmarkChallenge } = useProgress()
  const { isAuthenticated } = useAuth()
  const [selected, setSelected] = useState(null)
  const [code, setCode] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [mobileTab, setMobileTab] = useState('list')

  const { iframeRef, output, running, handleRun, handleRunRef, reset } = useSandbox(code)

  useEffect(() => {
    if (challenges.length > 0 && !selected) {
      api.getChallenge(challenges[0].id).then(full => {
        setSelected(full)
        setCode(full.starterCode)
      })
    }
  }, [challenges])

  const handleSelect = (ch) => {
    reset()
    setShowSolution(false)
    setShowHint(false)
    setMobileTab('editor')
    api.getChallenge(ch.id).then(full => {
      setSelected(full)
      setCode(full.starterCode)
    })
  }

  const handleReset = () => {
    reset()
    setCode(selected.starterCode)
    setShowSolution(false)
  }

  const handleSolution = () => {
    if (!showSolution) setCode(selected.solution)
    else setCode(selected.starterCode)
    setShowSolution(s => !s)
    reset()
  }

  const extensions = useMemo(() => [
    javascript(),
    Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => { handleRunRef.current?.(); return true } }]))
  ], [])

  const query = search.trim().toLowerCase()
  const filtered = challenges
    .filter(c => filter === 'all' || c.level === filter)
    .filter(c => !query ||
      c.title.toLowerCase().includes(query) ||
      c.tags.some(t => t.toLowerCase().includes(query))
    )

  if (loading || !selected) return <main className={styles.main}><div style={{padding:'4rem',textAlign:'center',color:'var(--muted)'}}>Loading challenges...</div></main>

  return (
    <main className={styles.main}>
      <iframe ref={iframeRef} sandbox="allow-scripts" title="challenge-sandbox" className={styles.sandbox} />

      <div className={styles.mobileTabs}>
        <button
          className={`${styles.mobileTab} ${mobileTab === 'list' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobileTab('list')}
        >
          ← Challenges
        </button>
        <button
          className={`${styles.mobileTab} ${mobileTab === 'editor' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobileTab('editor')}
        >
          Editor →
        </button>
      </div>

      <div className={`${styles.sidebar} ${mobileTab === 'editor' ? styles.hiddenMobile : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Challenges</h2>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>×</button>
            )}
          </div>
          <div className={styles.filters}>
            {['all', 'beginner', 'intermediate', 'advanced'].map(f => (
              <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <div className={styles.noResults}>No challenges match</div>
          ) : filtered.map(ch => (
            <button key={ch.id} className={`${styles.item} ${selected.id === ch.id ? styles.itemActive : ''}`} onClick={() => handleSelect(ch)}>
              <span className={styles.num}>#{String(ch.id).padStart(3, '0')}</span>
              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>
                  {ch.title}
                  {completedChallenges.includes(ch.id) && <span style={{color:'#6BCB6B', marginLeft:'8px'}}>✓</span>}
                </div>
                <span className={styles.itemLevel} style={{ color: levelColor[ch.level], background: levelColor[ch.level] + '22' }}>
                  {ch.level}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`${styles.editor} ${mobileTab === 'list' ? styles.hiddenMobile : ''}`}>
        <div className={styles.editorHeader}>
          <div className={styles.challengeInfo}>
            <h1 className={styles.challengeTitle}>{selected.title}</h1>
            <p className={styles.challengeDesc}>{selected.description}</p>
          </div>
          <div className={styles.editorActions}>
            <button className={styles.hintBtn} onClick={() => setShowHint(h => !h)}>
              {showHint ? 'Hide hint' : 'Hint'}
            </button>
            <button className={styles.solutionBtn} onClick={handleSolution}>
              {showSolution ? 'Hide solution' : 'Show solution'}
            </button>
            <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
            {isAuthenticated ? (
              <button
                className={completedChallenges.includes(selected?.id) ? styles.doneBtn : styles.markBtn}
                onClick={() => {
                  if (completedChallenges.includes(selected?.id)) {
                    unmarkChallenge(selected.id)
                  } else {
                    markChallengeComplete(selected.id)
                  }
                }}
              >
                {completedChallenges.includes(selected?.id) ? '✓ Completed' : 'Mark complete'}
              </button>
            ) : (
              <Link to="/login" className={styles.loginBtn}>Log in to track</Link>
            )}
            <button className={styles.runBtn} onClick={handleRun} disabled={running}>
              {running ? '● Running' : '▶ Run'}
            </button>
          </div>
        </div>

        {showHint && (
          <div className={styles.hint}>
            <span className={styles.hintLabel}>Hint</span>
            {selected.hint}
          </div>
        )}

        <div className={styles.codeArea}>
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

          <div className={styles.outputPanel}>
            <div className={styles.outputHeader}>
              <span className={styles.outputLabel}>// output</span>
              <div className={styles.outputStatus}>
                {running && <span className={styles.runningDot} />}
                {!running && output.length > 0 && (
                  <span className={styles.lineCount}>{output.length} line{output.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <div className={styles.outputContent}>
              {output.length === 0 ? (
                <div className={styles.outputEmpty}>
                  {running ? 'Executing...' : 'Press ▶ Run or Ctrl+Enter'}
                </div>
              ) : (
                output.map((line, i) => (
                  <div key={i} className={`${styles.outputLine} ${
                    line.type === 'err' ? styles.outputErr :
                    line.type === 'warn' ? styles.outputWarn :
                    line.type === 'muted' ? styles.outputMuted :
                    styles.outputLog
                  }`}>
                    <span className={styles.lineNum}>{i + 1}</span>
                    <span>{line.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
