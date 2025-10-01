"use client"

import Link from "next/link"
import { Github, Linkedin, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="text-center md:text-left">
          <div className="text-sm font-medium">AI Video Ad Generator</div>
          <div className="text-xs text-white/60">© {new Date().getFullYear()} All rights reserved.</div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
          <Link href="#" className="hover:text-white">
            About
          </Link>
          <span className="text-white/30" aria-hidden="true">
            |
          </span>
          <Link href="#" className="hover:text-white">
            Pricing
          </Link>
          <span className="text-white/30" aria-hidden="true">
            |
          </span>
          <Link href="#" className="hover:text-white">
            Contact
          </Link>
          <span className="text-white/30" aria-hidden="true">
            |
          </span>
          <Link href="#" className="hover:text-white">
            Privacy Policy
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link aria-label="LinkedIn" href="#" className="text-white/70 transition hover:text-white">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link aria-label="Twitter/X" href="#" className="text-white/70 transition hover:text-white">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link aria-label="YouTube" href="#" className="text-white/70 transition hover:text-white">
            <Youtube className="h-5 w-5" />
          </Link>
          <Link aria-label="GitHub" href="#" className="text-white/70 transition hover:text-white">
            <Github className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
