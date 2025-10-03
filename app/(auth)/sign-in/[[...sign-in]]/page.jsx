"use client"

import { SignIn } from "@clerk/nextjs"
import styles from "../Page.module.css"

export default function SignInPage() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.card} aria-label="Sign in form">
        <SignIn />
      </div>
    </main>
  )
}
