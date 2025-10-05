import type React from "react"
import styles from "./card.module.css"

type Props = {
  title: string
  description?: string
  children?: React.ReactNode
}

export function Card({ title, description, children }: Props) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.desc}>{description}</p> : null}
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  )
}
