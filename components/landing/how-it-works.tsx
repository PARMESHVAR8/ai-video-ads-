"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { User, Sparkles, Play } from "lucide-react"

const steps = [
  {
    title: "Enter your brand details",
    description: "Share your brand, audience, and campaign objectives.",
    icon: User,
  },
  {
    title: "AI generates ad script & visuals",
    description: "Instantly get on-brand scripts, scenes, and motion templates.",
    icon: Sparkles,
  },
  {
    title: "Preview & export your video ad",
    description: "Fine-tune, then export in formats for every ad platform.",
    icon: Play,
  },
]

export default function HowItWorks() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-semibold md:text-4xl">How It Works</h2>
        <p className="mt-3 text-white/70">From idea to export in three simple steps.</p>
      </motion.div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="h-full border-white/10 bg-white/[0.04] backdrop-blur">
              <CardContent className="flex flex-col items-start gap-3 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-sky-500/20 to-violet-600/20 p-2 ring-1 ring-white/10">
                    <s.icon className="h-5 w-5 text-violet-300" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/60">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-medium">{s.title}</h3>
                <p className="text-sm text-white/70">{s.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
