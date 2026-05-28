import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'var(--font-code)',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--yellow)', letterSpacing: '2px', marginBottom: '4px' }}>
        // 404
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#fff' }}>
        Page not found
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '340px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
        <code style={{ color: 'var(--yellow)', background: 'var(--yellow-dim)', padding: '1px 6px', borderRadius: '4px' }}>
          {pathname}
        </code>{' '}
        doesn't exist. Maybe it was moved or you mistyped the URL.
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            background: 'var(--yellow)',
            color: '#0D0D14',
            fontFamily: 'var(--font-code)',
            fontSize: '12px',
            fontWeight: 700,
            padding: '9px 22px',
            borderRadius: '7px',
          }}
        >
          Go home
        </Link>
        <Link
          to="/topics"
          style={{
            background: 'transparent',
            color: 'var(--text)',
            fontFamily: 'var(--font-code)',
            fontSize: '12px',
            padding: '9px 22px',
            borderRadius: '7px',
            border: '1px solid var(--border)',
          }}
        >
          Browse topics
        </Link>
      </div>
    </main>
  )
}
