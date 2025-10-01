"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Lightweight placeholders to avoid external icon and animation deps in editor checks
const IconPlaceholder = ({ children }: { children?: React.ReactNode }) => (
  <svg className="h-5 w-5 text-sky-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
  </svg>
)


const features = [
  {
    icon: IconPlaceholder,
    title: "AI Script Generation",
    description: "Turn a brief into compelling, on-brand ad scripts instantly.",
  },
  {
    icon: IconPlaceholder,
    title: "Smart Video Editing",
    description: "Automatic cuts, pacing, captions, and transitions tuned by AI.",
  },
  {
    icon: IconPlaceholder,
    title: "Custom Branding",
    description: "Apply your logo, colors, and fonts to every ad, consistently.",
  },
  {
    icon: IconPlaceholder,
    title: "One-Click Export",
    description: "Export optimized videos for all major ad platforms in seconds.",
  },
]

export default function Features() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Powerful Features</h2>
        <p className="mt-3 text-white/70">
          Everything you need to concept, assemble, and ship high-performing video ads.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title}>
            <Card className="h-full border-white/10 bg-white/[0.04] backdrop-blur">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-sky-500/20 to-violet-600/20 p-2 ring-1 ring-white/10">
                  <f.icon />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-white/70">{f.description}</CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}
