import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '2rem',
        fontFamily: 'var(--font-code)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', opacity: 0.3 }}>⚠</div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>Something went wrong</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', maxWidth: '400px', lineHeight: 1.6 }}>
          {this.state.error?.message || 'An unexpected error occurred.'}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '8px',
            background: 'var(--yellow)',
            color: '#0D0D14',
            border: 'none',
            padding: '9px 22px',
            borderRadius: '7px',
            fontFamily: 'var(--font-code)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Reload page
        </button>
      </div>
    )
  }
}
