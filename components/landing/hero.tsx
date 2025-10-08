"use client"
import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="text-center">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
          AI Video Ad Generator
        </span>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Create Stunning Video Ads with AI
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-white/70 md:text-base">
          Generate high-quality video advertisements in minutes using AI-powered technology.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {/* Primary brand color: neon blue to purple gradient, with proper text contrast */}
            <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-500 to-violet-600 text-white hover:from-sky-400 hover:to-violet-500"
            >
              Get Started
            </Button>
          </Link>

          <Link href="/demo">
            <Button size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Watch Demo
            </Button>
          </Link>
        </div>

        </div>

        {/* Illustration */}
        <div className="mt-12">
        <img
        src="/ai image.jpg"
        alt="Futuristic AI-powered video editing interface"
        // width={1200}
        // height={700}
        className="mx-auto w-full rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-2 shadow-[0_0_40px_-10px_rgba(56,189,248,0.35)]"
/>
        </div>
      </div>
    </section>
  )
}
