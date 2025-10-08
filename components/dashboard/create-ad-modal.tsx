"use client"

import type React from "react"
import { useEffect, useRef, useCallback } from "react"
import styles from "./create-ad-modal.module.css"

type Props = {
  open: boolean
  onClose: () => void
}

export function CreateAdModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && firstFieldRef.current) {
      firstFieldRef.current.focus()
    }
  }, [open])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      // Simple focus loop
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    },
    [onClose],
  )

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-ad-title"
      onKeyDown={onKeyDown}
    >
      <div className={styles.modal} ref={dialogRef}>
        <div className={styles.header}>
          <h2 id="create-ad-title">Create AI Ad</h2>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Close create ad">
            ✕
          </button>
        </div>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            alert("Generating preview...")
          }}
        >
          <label className={styles.label}>
            <span>Title</span>
            <input
              ref={firstFieldRef}
              className={styles.input}
              type="text"
              name="title"
              placeholder="Title"
            />
          </label>

          <label className={styles.label}>
            <span>Script</span>
            <textarea
              className={styles.textarea}
              name="script"
              rows={5}
              placeholder="Write your ad script here..."
            ></textarea>
          </label>

          <div className={styles.grid2}>
            {/* <label className={styles.label}>
              <span>Style</span>
              <select className={styles.select} name="style" defaultValue="clean">
                <option value="clean">Clean</option>
                <option value="bold">Bold</option>
                <option value="playful">Playful</option>
              </select>
            </label> */}

            <label className={styles.label}>
              <span>Aspect Ratio</span>
              <select className={styles.select} name="ratio" defaultValue="16:9">
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
              </select>
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.ghost} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primary}>
              Generate Preview
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
