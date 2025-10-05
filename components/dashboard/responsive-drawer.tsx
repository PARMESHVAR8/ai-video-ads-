"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import styles from "./responsive-drawer.module.css"

type Props = React.PropsWithChildren<{
  open: boolean
  onClose: () => void
  ariaLabel?: string
}>

export function ResponsiveDrawer({ open, onClose, ariaLabel, children }: Props) {
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onKey])

  return (
    <div className={styles.root} aria-hidden={!open} style={{ pointerEvents: open ? "auto" : "none" }}>
      <div className={open ? styles.backdropOpen : styles.backdrop} onClick={onClose} />
      <aside
        className={open ? styles.drawerOpen : styles.drawer}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="true"
      >
        {children}
      </aside>
    </div>
  )
}
