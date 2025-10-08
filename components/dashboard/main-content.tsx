"use client"
import styles from "./main-content.module.css"
import { Card } from "./card"
import { VideoList } from "./video-list"

type Props = {
  onCreateAdClick: () => void
}


export function MainContent({ onCreateAdClick }: Props) {
  return (
    <div className={styles.wrap}>
      <section aria-labelledby="quick-start">
        <h2 id="quick-start" className={styles.sectionTitle}>
          Get Started
        </h2>
        <div className={styles.grid}>
          <Card title="Create AI Ad" description="Generate a video ad from your script and style presets.">
            <button className={styles.primary} onClick={onCreateAdClick} aria-label="Open Create AI Ad">
              Start Creating
            </button>
          </Card>

          <Card title="Upload" description="Upload existing video assets for editing and analytics.">
            <button className={styles.surfaceBtn}>Upload Video</button>
          </Card>

          <Card title="Generate Image" description="Create thumbnails or storyboards with AI image generation.">
            <button className={styles.surfaceBtn}>Generate Image</button>
          </Card>

          <Card title="Chatbot" description="Ask the assistant to help write scripts or optimize targeting.">
            <button className={styles.surfaceBtn}>Open Chat</button>
          </Card>
        </div>
      </section>

      <section aria-labelledby="recent-videos">
        <h2 id="recent-videos" className={styles.sectionTitle}>
          Recent Videos
        </h2>
        <VideoList
          items={[
            { id: "1", title: "Spring Promo 15s", duration: "00:15", status: "Ready" },
            { id: "2", title: "Story Ad Beta", duration: "00:12", status: "Rendering" },
            { id: "3", title: "Template: Clean Tech", duration: "00:06", status: "Draft" },
          ]}
        />
      </section>
    </div>
  )
}
