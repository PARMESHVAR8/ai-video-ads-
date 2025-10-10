"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import styles from "../styles/page.module.css"
import { Sidebar } from "../../components/dashboard/sidebar"
import { Topbar } from "../../components/dashboard/topbar"
import { MainContent } from "../../components/dashboard/main-content"
import { ResponsiveDrawer } from "../../components/dashboard/responsive-drawer"

export default function Page() {
  const router = useRouter()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  // navigate to /ai_ad instead of opening modal
  const openCreate = useCallback(() => {
    router.push("/ai_ad")
  }, [router])

  return (
    <div className={styles.container}>
      {/* Desktop / Tablet sidebar */}
      <aside className={styles.sidebarDesktop}>
        <Sidebar onCreateAdClick={openCreate} />
      </aside>

      {/* Mobile topbar and drawer trigger */}
      <div className={styles.contentWrap}>
        <Topbar onMenuClick={openDrawer} onCreateAdClick={openCreate} />
        <main className={styles.main} role="main" aria-labelledby="page-title">
          <h1 id="page-title" className={styles.srOnly}>
            AI Ad Platform Dashboard
          </h1>
          <MainContent onCreateAdClick={openCreate} />
        </main>
      </div>

      {/* Mobile drawer for sidebar */}
      <ResponsiveDrawer open={drawerOpen} onClose={closeDrawer} ariaLabel="Primary navigation">
        <Sidebar
          onCreateAdClick={() => {
            closeDrawer()
            openCreate()
          }}
        />
      </ResponsiveDrawer>
    </div>
  )
}

