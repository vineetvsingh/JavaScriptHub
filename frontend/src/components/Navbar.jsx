import { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/topics', label: 'Topics' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/playground', label: 'Playground' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { isAuthenticated, username, logout } = useAuth()
  const profileRef = useRef(null)

  const close = () => setOpen(false)

  useEffect(() => {
    if (!profileOpen) return
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [profileOpen])

  return (
    <>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo} onClick={close}>
          JS<span>.hub</span>
        </Link>

        <div className={styles.links}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.navRight}>
          {isAuthenticated ? (
            <div className={`${styles.profileWrap} ${styles.ctaDesktop}`} ref={profileRef}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(o => !o)}
                aria-label="Profile menu"
              >
                {username?.[0]?.toUpperCase() ?? '?'}
              </button>
              {profileOpen && (
                <div className={styles.profileDropdown}>
                  <div className={styles.profileName}>@{username}</div>
                  <button
                    className={styles.profileLogout}
                    onClick={() => { logout(); setProfileOpen(false) }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={`${styles.authLink} ${styles.ctaDesktop}`}>Log in</Link>
          )}
          <Link to="/playground" className={`${styles.cta} ${styles.ctaDesktop}`}>Open Editor</Link>
          <button
            className={styles.hamburger}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`${styles.bar} ${open ? styles.barTop : ''}`} />
            <span className={`${styles.bar} ${open ? styles.barMid : ''}`} />
            <span className={`${styles.bar} ${open ? styles.barBot : ''}`} />
          </button>
        </div>
      </nav>

      {open && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink}
              onClick={close}
            >
              {label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <div className={styles.mobileUserInfo}>
                <span className={styles.mobileEmail}>@{username}</span>
              </div>
              <button className={styles.mobileLogout} onClick={() => { logout(); close() }}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.mobileAuthLink} onClick={close}>
              Log in
            </Link>
          )}
          <Link to="/playground" className={styles.mobileCta} onClick={close}>
            Open Editor
          </Link>
        </div>
      )}
    </>
  )
}
