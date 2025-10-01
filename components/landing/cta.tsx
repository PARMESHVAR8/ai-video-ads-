"use client"

import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16 md:pb-24">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-violet-600/10 p-8 text-center backdrop-blur md:p-12">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Start Creating AI Video Ads Today</h2>
        <p className="mx-auto mt-2 max-w-2xl text-white/70">Join free and generate your first video ad in minutes.</p>
        <div className="mt-6">
          <Button
            size="lg"
            className="bg-gradient-to-r from-sky-500 to-violet-600 text-white hover:from-sky-400 hover:to-violet-500"
          >
            Sign Up Free
          </Button>
        </div>
  </div>
    </section>
  )
}
