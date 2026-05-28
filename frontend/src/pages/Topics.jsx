import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTopics } from '../hooks/useTopics'
import { useProgress } from '../context/ProgressContext'
import styles from './Topics.module.css'

const levelColor = { beginner: '#639922', intermediate: '#BA7517', advanced: '#E24B4A' }
const LEVELS = ['beginner', 'intermediate', 'advanced']

export default function Topics() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all')
  const { topics, loading, error } = useTopics()
  const { completedTopics } = useProgress()
  const doneCount = completedTopics.filter(s => topics.some(t => t.slug === s)).length

  const query = search.trim().toLowerCase()
  const filtered = topics.filter(t => {
    const matchesLevel = level === 'all' || t.level === level
    const matchesSearch = !query ||
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    return matchesLevel && matchesSearch
  })

  const isFiltered = !!query || level !== 'all'

  if (loading) return <main className={styles.main}><div style={{padding:'4rem',textAlign:'center',color:'var(--muted)'}}>Loading topics...</div></main>
  if (error) return <main className={styles.main}><div style={{padding:'4rem',textAlign:'center',color:'#E24B4A'}}>Failed to load: {error}</div></main>

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.tag}>// {topics.length} topics</div>
          <h1>All Topics</h1>
          <p>Structured from first principles to advanced internals.</p>
          {doneCount > 0 && (
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(doneCount / topics.length) * 100}%` }} />
              </div>
              <span className={styles.progressLabel}>{doneCount} / {topics.length} complete</span>
            </div>
          )}
        </div>
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search topics, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>×</button>
            )}
          </div>
          <div className={styles.levelFilters}>
            <button
              className={`${styles.filterBtn} ${level === 'all' ? styles.filterActive : ''}`}
              onClick={() => setLevel('all')}
            >
              All
            </button>
            {LEVELS.map(l => (
              <button
                key={l}
                className={`${styles.filterBtn} ${level === l ? styles.filterActive : ''}`}
                style={level === l ? { color: levelColor[l], background: levelColor[l] + '22', borderColor: levelColor[l] + '88' } : {}}
                onClick={() => setLevel(level === l ? 'all' : l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isFiltered ? (
        <section className={styles.section}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>∅</div>
              <div className={styles.emptyMsg}>No topics match your search</div>
              <button className={styles.clearBtn} onClick={() => { setSearch(''); setLevel('all') }}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles.resultsCount}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </div>
              <div className={styles.grid}>
                {filtered.map(topic => (
                  <Link to={`/topics/${topic.slug}`} key={topic.slug} className={`${styles.card} ${completedTopics.includes(topic.slug) ? styles.cardDone : ''}`}>
                    {completedTopics.includes(topic.slug) && <span className={styles.doneBadge}>✓</span>}
                    <div className={styles.cardIcon}>{topic.icon}</div>
                    <div className={styles.cardTitle}>{topic.title}</div>
                    <div className={styles.cardDesc}>{topic.description}</div>
                    <div className={styles.cardBottom}>
                      <div className={styles.cardTags}>
                        {topic.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.tag2}>{tag}</span>
                        ))}
                      </div>
                      <span
                        className={styles.levelPill}
                        style={{ color: levelColor[topic.level], background: levelColor[topic.level] + '22' }}
                      >
                        {topic.level}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        LEVELS.map(lvl => {
          const levelTopics = topics.filter(t => t.level === lvl)
          if (!levelTopics.length) return null
          return (
            <section key={lvl} className={styles.section}>
              <div className={styles.levelHeader}>
                <span className={styles.levelBadge} style={{ color: levelColor[lvl], background: levelColor[lvl] + '22' }}>
                  {lvl}
                </span>
                <span className={styles.levelCount}>{levelTopics.length} topics</span>
              </div>
              <div className={styles.grid}>
                {levelTopics.map(topic => (
                  <Link to={`/topics/${topic.slug}`} key={topic.slug} className={`${styles.card} ${completedTopics.includes(topic.slug) ? styles.cardDone : ''}`}>
                    {completedTopics.includes(topic.slug) && <span className={styles.doneBadge}>✓</span>}
                    <div className={styles.cardIcon}>{topic.icon}</div>
                    <div className={styles.cardTitle}>{topic.title}</div>
                    <div className={styles.cardDesc}>{topic.description}</div>
                    <div className={styles.cardTags}>
                      {topic.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.tag2}>{tag}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })
      )}
    </main>
  )
}
