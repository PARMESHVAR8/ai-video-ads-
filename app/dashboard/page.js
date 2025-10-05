"use client"

import { useState, useCallback } from "react"
import styles from "../styles/page.module.css"
import { Sidebar } from "../../components/dashboard/sidebar"
import { Topbar } from "../../components/dashboard/topbar"
import { MainContent } from "../../components/dashboard/main-content"
import { CreateAdModal } from "../../components/dashboard/create-ad-modal"
import { ResponsiveDrawer } from "../../components/dashboard/responsive-drawer"

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const openCreate = useCallback(() => setCreateOpen(true), [])
  const closeCreate = useCallback(() => setCreateOpen(false), [])

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

      {/* Create Ad modal */}
      <CreateAdModal open={createOpen} onClose={closeCreate} />
    </div>
  )
}

