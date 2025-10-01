"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

type Testimonial = {
  name: string
  role: string
  quote: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    name: "Olivia Green",
    role: "Performance Marketer",
    quote: "We shipped platform-ready ads 10x faster. The AI script suggestions were scarily good.",
    avatar: "/female-profile-photo.png",
  },
  {
    name: "Daniel Lee",
    role: "Brand Lead",
    quote: "Our team finally aligned on messaging and visuals. The exports worked perfectly across channels.",
    avatar: "/male-profile-photo.png",
  },
  {
    name: "Sophia Patel",
    role: "E-commerce Founder",
    quote: "CPCs dropped and CTRs climbed. It’s our new go-to for rapid creative testing.",
    avatar: "/profile-photo-founder.jpg",
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const total = testimonials.length
  const visible = useMemo(() => testimonials[index], [index])

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, 4500)
    return () => clearInterval(id)
  }, [total])

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h2 className="text-3xl font-semibold md:text-4xl">Loved by Teams</h2>
        <p className="mt-3 text-white/70">What our customers say</p>
      </motion.div>

      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-8 max-w-3xl"
      >
        <Card className="border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <CardContent className="flex flex-col items-center gap-4 p-0 text-center">
            <div className="flex items-center gap-1.5 text-sky-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <p className="text-pretty text-base text-white/90 md:text-lg">"{visible.quote}"</p>
            <div className="mt-2 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={visible.avatar || "/file.svg"} alt={`${visible.name} profile photo`} />
                <AvatarFallback>{visible.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-sm font-medium">{visible.name}</div>
                <div className="text-xs text-white/60">{visible.role}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                aria-label="Previous testimonial"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setIndex((i) => (i - 1 + total) % total)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Next testimonial"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setIndex((i) => (i + 1) % total)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
