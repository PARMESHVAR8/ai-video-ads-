"use client"
import styles from "./sidebar.module.css"

type SidebarProps = {
  onCreateAdClick: () => void
}

export function Sidebar({ onCreateAdClick }: SidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Primary">
      <div className={styles.header}>
        <button className={styles.primaryButton} onClick={onCreateAdClick} aria-label="Create new AI Ad">
          + New Create Ad
        </button>
      </div>

      <ul className={styles.navList} role="list">
        <li>
          <a href="#" className={styles.navItem} aria-current="page">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className={styles.navItem}>
            My Videos
          </a>
        </li>
        <li>
          <a href="#" className={styles.navItem}>
            Create Templates
          </a>
        </li>
        <li>
          <a href="#" className={styles.navItem}>
            Analytics
          </a>
        </li>
        <li>
          <a href="#" className={styles.navItem}>
            Settings
          </a>
        </li>
      </ul>

      <div className={styles.footer}>
        <div className={styles.org}>
          <div className={styles.avatar} aria-hidden="true">
            A
          </div>
          <div>
            <div className={styles.orgName}>Acme Ads</div>
            <div className={styles.orgPlan}>Pro</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
