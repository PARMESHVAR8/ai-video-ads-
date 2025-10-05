import styles from "./video-list.module.css"

export type VideoItem = {
  id: string
  title: string
  duration: string
  status: "Ready" | "Rendering" | "Draft"
}

export function VideoList({ items }: { items: VideoItem[] }) {
  return (
    <div className={styles.wrap} role="region" aria-label="Recent videos">
      <ul className={styles.list} role="list">
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <div className={styles.thumb} aria-hidden="true">
              ▶
            </div>
            <div className={styles.meta}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.sub}>
                {item.duration} • {item.status}
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.rowBtn} aria-label={`Open ${item.title}`}>
                Open
              </button>
              <button className={styles.rowBtn} aria-label={`More actions for ${item.title}`}>
                ⋯
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
