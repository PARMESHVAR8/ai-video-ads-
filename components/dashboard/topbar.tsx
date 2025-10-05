"use client"
import styles from "./topbar.module.css"

type TopbarProps = {
  onMenuClick: () => void
  onCreateAdClick: () => void
}

export function Topbar({ onMenuClick, onCreateAdClick }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.iconButton} onClick={onMenuClick} aria-label="Open navigation">
          <span className={styles.hamburger} aria-hidden="true" />
        </button>
        <span className={styles.brand}>AI Ad Platform</span>
      </div>
      <div className={styles.right}>
        <button className={styles.secondaryBtn} onClick={onCreateAdClick}>
          Create AI Ad
        </button>
        <button className={styles.iconButton} aria-label="User menu">
          <span className={styles.userDot} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
