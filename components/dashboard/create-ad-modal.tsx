/**
 * How to wire real APIs (TODOs)
 * - OpenAI GPT API (Script Generation):
 *   - Use @ai-sdk/generateText or OpenAI REST API with process.env.OPENAI_API_KEY (server-side only).
 *   - Prompt: product name, description, tone, target language → return ~90–120 word ad script with CTA.
 * - D-ID / Pika / Synthesia (Video Generation):
 *   - D-ID: POST /talks with script, voice, and avatar; poll job status until complete.
 *   - Synthesia: CreateVideo with script, avatar, voice; poll until ready.
 *   - Pika: For image-to-video or text-to-video pipelines.
 *   - Store API keys in env vars (server-side). Never embed secrets in the client bundle.
 * - FFmpeg + Python Fallback:
 *   - Server-side pipeline: stitch images → apply TTS audio track (e.g., ElevenLabs/Coqui) → use Stable Diffusion or SDXL for motion frames if needed.
 *   - Expose an API route to accept job metadata, enqueue, and return job IDs to poll.
 *
 * This component ships stubs with process.env placeholders and accepts callback props to integrate your real backends.
 */

"use client"

import type React from "react"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

/* ===========================
   Types
   =========================== */

type OptionType = "script" | "photos"
type AspectRatio = "1:1" | "9:16" | "16:9" | "4:5"
type VideoPhase = "queued" | "processing" | "done" | "downloadable"

export type Avatar = {
  id: string
  name: string
  src: string // e.g., "/images/avatars/avatar01.png"
  alt?: string
}

export type VoicePreset = {
  id: string
  name: string // e.g., "Aarav (male, Hindi)"
  gender: "male" | "female"
  lang: "en" | "hi"
}

type ProductTone = "professional" | "playful"

type ProductDetails = {
  productName: string
  description: string
  tone: ProductTone
  language: "en" | "hi"
}

type UploadImage = {
  id: string
  src: string
  file?: File
  alt: string
}

export type JobMetadata = {
  title: string
  option: OptionType
  avatarId?: string
  voiceId: string
  ratio: AspectRatio
  script?: string
  images?: Array<{ src: string; alt: string }>
}

export type JobResult = {
  id: string
  url: string
  ratio: AspectRatio
  durationSec: number
  thumbnail?: string
}

/* ===========================
   Props
   =========================== */

export type CreateAdModelProps = {
  initialCredits?: number // default 70
  onSubscribe?: () => void
  onGenerate?: (job: JobMetadata) => Promise<JobResult[]> // optional override to handle generation externally
  avatars?: Avatar[] // allow injection
  voices?: VoicePreset[] // allow injection
  onComplete?: (results: JobResult[]) => void
}

/* ===========================
   DEV FLAG
   =========================== */

// Toggle to true to simulate generation front-end only.
const DEV_MODE = true

/* ===========================
   Constants
   =========================== */

const CREDITS_PER_VIDEO = 10
const VIDEOS_TO_GENERATE = 3

const defaultAvatars: Avatar[] = Array.from({ length: 20 }).map((_, i) => {
  const idx = (i + 1).toString().padStart(2, "0")
  return {
    id: `a${idx}`,
    name: `Avatar ${idx}`,
    src: `/images/avatars/avatar${idx}.png`,
    alt: `Avatar ${idx}`,
  }
})

const defaultVoices: VoicePreset[] = [
  { id: "v1", name: "Aarav (male, Hindi)", gender: "male", lang: "hi" },
  { id: "v2", name: "Isha (female, Hindi)", gender: "female", lang: "hi" },
  { id: "v3", name: "Ravi (male, Hindi)", gender: "male", lang: "hi" },
  { id: "v4", name: "Meera (female, Hindi)", gender: "female", lang: "hi" },
  { id: "v5", name: "Liam (male, English)", gender: "male", lang: "en" },
  { id: "v6", name: "Emma (female, English)", gender: "female", lang: "en" },
  { id: "v7", name: "Noah (male, English)", gender: "male", lang: "en" },
  { id: "v8", name: "Olivia (female, English)", gender: "female", lang: "en" },
  { id: "v9", name: "Aditi (female, Hindi)", gender: "female", lang: "hi" },
  { id: "v10", name: "Arjun (male, Hindi)", gender: "male", lang: "hi" },
]

/* ===========================
   Utility helpers
   =========================== */

function classNames(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ")
}

function formatCredits(n: number) {
  return `${n} credits`
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function ratioHint(ratio: AspectRatio): string {
  switch (ratio) {
    case "1:1":
      return "Square — ideal for feeds"
    case "9:16":
      return "Portrait — ideal for Stories/Reels"
    case "16:9":
      return "Landscape — great for YouTube"
    case "4:5":
      return "Portrait — compact feed"
  }
}

/* Reorder helper for images */
function reorder<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const copy = arr.slice()
  const [item] = copy.splice(fromIndex, 1)
  copy.splice(toIndex, 0, item)
  return copy
}

/* ===========================
   API Stub Functions
   =========================== */

/**
 * generateScriptWithOpenAI(productDetails, language)
 * - Expected request: { productName, description, tone, language }
 * - Returns: Promise<string> - short ad script (90–120 words)
 * - Note: Move to a server action / route handler, keep keys in process.env.
 */
async function generateScriptWithOpenAI(details: ProductDetails): Promise<string> {
  // Example: Use AI SDK server-side:
  // const { text } = await generateText({
  //   model: "openai/gpt-5-mini",
  //   prompt: `Write a ${details.tone} ${details.language === "hi" ? "Hindi" : "English"} 30s ad script for ${details.productName}...`
  // })
  // return text

  // DEV fallback:
  return Promise.resolve(
    `${details.language === "hi" ? "नमस्ते!" : "Hello!"} Presenting ${details.productName}. ${
      details.description
    } ${details.language === "hi" ? "आज ही आज़माएँ!" : "Try it today!"}`,
  )
}

/**
 * callDID_API({ script, avatar, voice, ratio })
 * - Expected request: { script: string, avatar: Avatar, voice: VoicePreset, ratio: AspectRatio }
 * - Returns: Promise<string> videoURL
 * - Note: Requires D-ID API Key in process.env.DID_API_KEY (server-side).
 */
async function callDID_API(params: {
  script: string
  avatar: Avatar
  voice: VoicePreset
  ratio: AspectRatio
}): Promise<string> {
  // TODO: Implement server proxy: POST /api/did with payload above, then poll for job status.
  // const res = await fetch("/api/did", { method: "POST", body: JSON.stringify(params) })
  // const { url } = await res.json()
  // return url

  return DEV_MODE
    ? Promise.resolve(`https://example.com/video-did-${Math.floor(Math.random() * 999)}.mp4`)
    : Promise.reject(new Error("callDID_API not wired"))
}

/**
 * callPikaOrSynthesia({ images, voice, script, ratio })
 * - Expected request: { images: {src, alt}[], voice: VoicePreset, script: string, ratio: AspectRatio }
 * - Returns: Promise<string> videoURL
 * - Note: Use Pika/Synthesia SDKs via server-side routes. Keep secrets in env vars.
 */
async function callPikaOrSynthesia(params: {
  images: Array<{ src: string; alt?: string }>
  voice: VoicePreset
  script: string
  ratio: AspectRatio
}): Promise<string> {
  // TODO: Implement server proxy for image-to-video pipeline.
  return DEV_MODE
    ? Promise.resolve(`https://example.com/video-pika-${Math.floor(Math.random() * 999)}.mp4`)
    : Promise.reject(new Error("callPikaOrSynthesia not wired"))
}

/**
 * generateWithFFmpegPython({ images, tts, stableDiffusion })
 * - Expected request: { images: string[], tts: string (audioURL or base64), stableDiffusion?: boolean }
 * - Returns: Promise<string> videoURL
 * - Note: Server-side heavy lifting with FFmpeg. Consider async job with queue + polling.
 */
async function generateWithFFmpegPython(_params: {
  images: string[]
  tts: string
  stableDiffusion?: boolean
}): Promise<string> {
  return DEV_MODE
    ? Promise.resolve(`https://example.com/video-ffmpeg-${Math.floor(Math.random() * 999)}.mp4`)
    : Promise.reject(new Error("generateWithFFmpegPython not wired"))
}

/* ===========================
   Component
   =========================== */

type VideoTask = {
  id: string
  phase: VideoPhase
  progress: number
  url?: string
}

const ratios: AspectRatio[] = ["1:1", "9:16", "16:9", "4:5"]

const initialProductDetails: ProductDetails = {
  productName: "",
  description: "",
  tone: "professional",
  language: "en",
}

export default function CreateAdModel(props: CreateAdModelProps) {
  const {
    initialCredits = 70,
    onSubscribe,
    onGenerate,
    avatars = defaultAvatars,
    voices = defaultVoices,
    onComplete,
  } = props

  const formId = useId()
  const [title, setTitle] = useState("")
  const [option, setOption] = useState<OptionType>("script")
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | undefined>(avatars[0]?.id)
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("")
  const [ratio, setRatio] = useState<AspectRatio>("16:9")
  const [credits, setCredits] = useState<number>(initialCredits)

  // Option A: Script path
  const [product, setProduct] = useState<ProductDetails>(initialProductDetails)
  const [script, setScript] = useState<string>("")
  const [generatingScript, setGeneratingScript] = useState(false)

  // Option B: Photos path
  const [images, setImages] = useState<UploadImage[]>([])
  const dropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generation
  const [submitting, setSubmitting] = useState(false)
  const [tasks, setTasks] = useState<VideoTask[]>([])

  const totalCost = useMemo(() => CREDITS_PER_VIDEO * VIDEOS_TO_GENERATE, [])
  const insufficientCredits = credits < 10 // UX requirement
  const cannotAffordBatch = credits < totalCost

  const selectedAvatar = useMemo(() => avatars.find((a) => a.id === selectedAvatarId), [avatars, selectedAvatarId])
  const selectedVoice = useMemo(() => voices.find((v) => v.id === selectedVoiceId), [voices, selectedVoiceId])

  /* ===========================
     Drag & Drop for images (Option B)
     =========================== */

  useEffect(() => {
    const node = dropRef.current
    if (!node) return
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
      node.classList.add("ring-2", "ring-primary")
    }
    const onDragLeave = () => {
      node.classList.remove("ring-2", "ring-primary")
    }
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      node.classList.remove("ring-2", "ring-primary")
      if (!e.dataTransfer) return
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"))
      addFiles(files)
    }
    node.addEventListener("dragover", onDragOver)
    node.addEventListener("dragleave", onDragLeave)
    node.addEventListener("drop", onDrop)
    return () => {
      node.removeEventListener("dragover", onDragOver)
      node.removeEventListener("dragleave", onDragLeave)
      node.removeEventListener("drop", onDrop)
    }
  }, [])

  const addFiles = (files: File[]) => {
    const mapped: UploadImage[] = files.slice(0, 6 - images.length).map((file) => {
      const id = uid("img")
      const src = URL.createObjectURL(file)
      return { id, src, file, alt: file.name.replace(/\.[a-z]+$/i, "") }
    })
    setImages((prev) => [...prev, ...mapped])
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    addFiles(Array.from(e.target.files))
    e.currentTarget.value = ""
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    const to = index + direction
    if (to < 0 || to >= images.length) return
    setImages((prev) => reorder(prev, index, to))
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  /* ===========================
     Validation
     =========================== */

  const imagesValid = option === "photos" ? images.length >= 3 && images.length <= 6 : true
  const titleValid = title.trim().length > 0
  const voiceValid = !!selectedVoice
  const avatarValid = option === "script" ? !!selectedAvatar : true
  const scriptValid = option === "script" ? script.trim().length > 0 : true // ensure script exists before video generation
  const canGenerate = titleValid && voiceValid && avatarValid && (option === "script" ? scriptValid : imagesValid)

  /* ===========================
     Script Generation (Option A)
     =========================== */

  const handleGenerateScript = async () => {
    try {
      setGeneratingScript(true)
      const text = await generateScriptWithOpenAI(product)
      setScript(text)
    } catch (e) {
      console.error("[CreateAdModel] generateScript error:", e)
    } finally {
      setGeneratingScript(false)
    }
  }

  /* ===========================
     Video Generation Simulation
     =========================== */

  const simulateProgress = useCallback((taskId: string) => {
    // Simulate queued -> processing -> done -> downloadable
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, phase: "queued", progress: 5 } : t)))
    setTimeout(() => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, phase: "processing", progress: 20 } : t)))
      const tick = () => {
        setTasks((prev) => {
          const t = prev.find((x) => x.id === taskId)
          if (!t) return prev
          const newP = Math.min(100, t.progress + Math.random() * 15)
          const newPhase: VideoPhase = newP >= 100 ? "done" : t.phase === "queued" ? "processing" : t.phase
          return prev.map((x) => (x.id === taskId ? { ...x, progress: newP, phase: newPhase } : x))
        })
        const current = tasksRef.current.find((x) => x.id === taskId)
        if (current && current.progress < 100) {
          setTimeout(tick, 400 + Math.random() * 600)
        } else {
          // Mark as downloadable shortly after done
          setTimeout(() => {
            setTasks((prev) => prev.map((x) => (x.id === taskId ? { ...x, phase: "downloadable", progress: 100 } : x)))
          }, 500)
        }
      }
      setTimeout(tick, 600)
    }, 700)
  }, [])

  const tasksRef = useRef<VideoTask[]>([])
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const createTasks = () => {
    const ids = Array.from({ length: VIDEOS_TO_GENERATE }).map((_, i) => uid(`vid${i + 1}`))
    const init: VideoTask[] = ids.map((id) => ({ id, phase: "queued", progress: 0 }))
    setTasks(init)
    ids.forEach((id) => simulateProgress(id))
  }

  const finalizeTasksWithUrls = (urls: string[]) => {
    setTasks((prev) =>
      prev.map((t, i) => ({
        ...t,
        url: urls[i] || t.url || `https://example.com/video${i + 1}.mp4`,
      })),
    )
  }

  /* ===========================
     Submission
     =========================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canGenerate) return

    setSubmitting(true)
    createTasks()

    // Build job metadata
    const job: JobMetadata = {
      title,
      option,
      avatarId: selectedAvatarId,
      voiceId: selectedVoiceId,
      ratio,
      script:
        option === "script"
          ? script
          : // Option B: simple narration synthesis placeholder
            `Introducing ${title}. Discover more with our stunning visuals.`,
      images: option === "photos" ? images.map((x) => ({ src: x.src, alt: x.alt })) : undefined,
    }

    try {
      let results: JobResult[]
      if (onGenerate) {
        // Let external handler do the heavy lifting (preferred)
        results = await onGenerate(job)
      } else {
        // Local DEV simulation / stubbed pipelines
        const urls = await localGenerate(job)
        results = urls.map((url, i) => ({
          id: uid(`res${i + 1}`),
          url,
          ratio,
          durationSec: 30,
        }))
      }
      finalizeTasksWithUrls(results.map((r) => r.url))
      // Deduct credits AFTER success
      setCredits((c) => Math.max(0, c - totalCost))
      onComplete?.(results)
    } catch (err) {
      console.error("[CreateAdModel] generation error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  async function localGenerate(job: JobMetadata): Promise<string[]> {
    // Option A: avatar-based - use D-ID style pipeline
    // Option B: images-based - use Pika/Synthesia or FFmpeg fallback
    const tasks: Array<Promise<string>> = Array.from({ length: VIDEOS_TO_GENERATE }).map(async () => {
      await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2500))
      if (job.option === "script") {
        return callDID_API({
          script: job.script || "",
          avatar: selectedAvatar!,
          voice: selectedVoice!,
          ratio: job.ratio,
        })
      } else {
        // Build with uploaded images
        if (DEV_MODE) {
          return callPikaOrSynthesia({
            images: job.images || [],
            voice: selectedVoice!,
            script: job.script || "",
            ratio: job.ratio,
          })
        }
        // Fallback
        return generateWithFFmpegPython({
          images: (job.images || []).map((i) => i.src),
          tts: "tts-audio-url-or-base64",
        })
      }
    })
    const urls = await Promise.all(tasks)
    return urls
  }

  /* ===========================
     Download All (zip) - stub
     =========================== */

  const downloadAll = () => {
    const urls = tasks.filter((t) => t.url).map((t) => t.url!) as string[]
    if (urls.length === 0) return
    // Stub: generate a simple text manifest. In production, zip on server or with JSZip.
    const blob = new Blob([urls.join("\n")], { type: "text/plain" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "videos.txt" // Replace with server-made zip file
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const resetAll = () => {
    setTasks([])
  }

  /* ===========================
     Render
     =========================== */

  return (
    <section
      aria-labelledby={`${formId}-title`}
      className="w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-xl bg-card border shadow-sm"
    >
      {/* Header & Title */}
      <header className="mb-6 space-y-2">
        <h1 id={`${formId}-title`} className="text-2xl font-semibold text-balance">
          Ads Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Create AI-powered video ads. Each generated video costs {CREDITS_PER_VIDEO} credits.
        </p>
      </header>

      {/* Credits & pricing */}
      <div className="mb-6 flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
        <div className="flex-1">
          <p className="text-sm">
            Current balance: <strong title="Credits available for generating videos">{formatCredits(credits)}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Estimated cost: {CREDITS_PER_VIDEO} per video × {VIDEOS_TO_GENERATE} ={" "}
            <strong>{formatCredits(totalCost)}</strong>
          </p>
          {insufficientCredits && (
            <p className="mt-1 text-xs text-destructive font-medium">Insufficient credits. Subscribe to continue.</p>
          )}
        </div>
        <button
          type="button"
          onClick={onSubscribe}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Subscribe to add more credits"
          title="Subscribe to add more credits"
        >
          Subscribe
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate aria-describedby={`${formId}-helper`}>
        {/* Title */}
        <div className="mb-6">
          <label htmlFor={`${formId}-ad-title`} className="block text-sm font-medium mb-2">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            id={`${formId}-ad-title`}
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Spring Sale — 30s Promo"
            className={classNames(
              "w-full rounded-md border bg-background px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring",
            )}
          />
          <p id={`${formId}-helper`} className="mt-1 text-xs text-muted-foreground">
            Title appears on your dashboard.
          </p>
        </div>

        {/* Option selection */}
        <fieldset className="mb-6">
          <legend className="text-sm font-medium mb-2">Choose a generation method</legend>
          <div role="radiogroup" aria-label="Generation method" className="grid sm:grid-cols-2 gap-3">
            <label
              className={classNames(
                "flex cursor-pointer items-start gap-3 rounded-md border p-3",
                option === "script" ? "ring-2 ring-primary" : "",
              )}
            >
              <input
                type="radio"
                name="option"
                value="script"
                checked={option === "script"}
                onChange={() => setOption("script")}
                className="mt-1"
                aria-describedby={`${formId}-optA-help`}
              />
              <div className="text-sm">
                <div className="font-medium">AI video ads generator through Script</div>
                <p id={`${formId}-optA-help`} className="text-muted-foreground">
                  Provide or generate a voiceover script; we render with a talking avatar.
                </p>
              </div>
            </label>

            <label
              className={classNames(
                "flex cursor-pointer items-start gap-3 rounded-md border p-3",
                option === "photos" ? "ring-2 ring-primary" : "",
              )}
            >
              <input
                type="radio"
                name="option"
                value="photos"
                checked={option === "photos"}
                onChange={() => setOption("photos")}
                className="mt-1"
                aria-describedby={`${formId}-optB-help`}
              />
              <div className="text-sm">
                <div className="font-medium">AI video ads generator through Photos</div>
                <p id={`${formId}-optB-help`} className="text-muted-foreground">
                  Upload 3–6 images; we synthesize motion and narration.
                </p>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Avatar selection (single) */}
        {option === "script" && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Select an avatar</h3>
              <span
                className="text-xs text-muted-foreground"
                title="Avatars are AI presenters used for talking-head videos."
                aria-label="Info about avatars"
              >
                What’s this?
              </span>
            </div>
            <div
              role="radiogroup"
              aria-label="Avatar selection"
              className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3"
            >
              {avatars.slice(0, 20).map((a) => {
                const checked = selectedAvatarId === a.id
                const id = `${formId}-avatar-${a.id}`
                return (
                  <label
                    key={a.id}
                    htmlFor={id}
                    className={classNames(
                      "group relative cursor-pointer rounded-lg border p-2 focus-within:ring-2 focus-within:ring-ring",
                      checked ? "ring-2 ring-primary" : "",
                    )}
                  >
                    <input
                      id={id}
                      type="radio"
                      name="avatar"
                      className="sr-only"
                      checked={checked}
                      onChange={() => setSelectedAvatarId(a.id)}
                    />
                    <img
                      src={a.src || "/placeholder.svg"}
                      alt={a.alt || a.name}
                      className="h-20 w-full object-cover rounded-md bg-muted"
                      draggable={false}
                    />
                    <div className="mt-2 text-xs text-center text-pretty truncate">{a.name}</div>
                  </label>
                )
              })}
            </div>
          </section>
        )}

        {/* Voice selection */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              Voice preset <span className="text-destructive">*</span>
            </h3>
            <span
              className="text-xs text-muted-foreground"
              title="Prebuilt TTS voices; choose male/female and language."
              aria-label="Info about voices"
            >
              Need help?
            </span>
          </div>
          <div role="radiogroup" aria-label="Voice preset" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {voices.map((v) => {
              const checked = selectedVoiceId === v.id
              return (
                <label
                  key={v.id}
                  className={classNames(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-md border p-3",
                    checked ? "ring-2 ring-primary" : "",
                  )}
                >
                  <input
                    type="radio"
                    name="voice"
                    value={v.id}
                    checked={checked}
                    onChange={() => setSelectedVoiceId(v.id)}
                    aria-label={`Voice ${v.name}`}
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{v.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {v.gender} · {v.lang === "hi" ? "Hindi" : "English"}
                    </span>
                  </div>
                </label>
              )
            })}
          </div>
          {!voiceValid && <p className="mt-1 text-xs text-destructive">Please select a voice.</p>}
        </section>

        {/* Ratio selection */}
        <section className="mb-6">
          <h3 className="text-sm font-medium mb-2">Aspect ratio</h3>
          <div role="radiogroup" aria-label="Aspect ratio" className="flex flex-wrap gap-2">
            {ratios.map((r) => (
              <label
                key={r}
                className={classNames(
                  "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                  ratio === r ? "ring-2 ring-primary" : "",
                )}
                title={ratioHint(r)}
              >
                <input
                  type="radio"
                  name="ratio"
                  value={r}
                  checked={ratio === r}
                  onChange={() => setRatio(r)}
                  aria-label={`Aspect ratio ${r}`}
                />
                <span>{r}</span>
                <span className="text-xs text-muted-foreground">({ratioHint(r)})</span>
              </label>
            ))}
          </div>
        </section>

        {/* Option-specific UIs */}
        {option === "script" ? (
          <section className="mb-6 grid gap-4">
            {/* Product details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-product-name`} className="block text-sm font-medium mb-2">
                  Product name
                </label>
                <input
                  id={`${formId}-product-name`}
                  type="text"
                  value={product.productName}
                  onChange={(e) => setProduct({ ...product, productName: e.target.value })}
                  placeholder="e.g., Aurora Headphones"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-tone`} className="block text-sm font-medium mb-2">
                  Tone
                </label>
                <select
                  id={`${formId}-tone`}
                  value={product.tone}
                  onChange={(e) => setProduct({ ...product, tone: e.target.value as ProductTone })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="professional">Professional</option>
                  <option value="playful">Playful</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`${formId}-desc`} className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id={`${formId}-desc`}
                  rows={3}
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Key benefits, features, and a short CTA."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-lang`} className="block text-sm font-medium mb-2">
                  Target language
                </label>
                <select
                  id={`${formId}-lang`}
                  value={product.language}
                  onChange={(e) => setProduct({ ...product, language: e.target.value as ProductDetails["language"] })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>

            {/* Script editing */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor={`${formId}-script`} className="text-sm font-medium">
                  Voiceover script <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateScript}
                    disabled={generatingScript}
                    className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-60"
                    aria-label="Generate script with AI"
                    title="Generate script with AI"
                  >
                    {generatingScript ? "Generating…" : "Generate Script"}
                  </button>
                </div>
              </div>
              <textarea
                id={`${formId}-script`}
                rows={6}
                required
                aria-required="true"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste or generate a concise 30s ad script with a clear CTA…"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {!scriptValid && <p className="text-xs text-destructive">Script is required to generate the video.</p>}
            </div>
          </section>
        ) : (
          <section className="mb-6 grid gap-4">
            <div
              ref={dropRef}
              tabIndex={0}
              role="region"
              aria-label="Image uploader dropzone"
              className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center bg-muted/30"
            >
              <div className="text-sm">
                Drag &amp; drop 3–6 product images here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary underline underline-offset-2"
                  aria-label="Choose image files"
                >
                  choose files
                </button>
                .
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFileChange}
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use crisp, well-lit photos. You can reorder after adding.
              </p>
            </div>

            {images.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <li key={img.id} className="rounded-md border p-2">
                    <div className="relative">
                      <img
                        src={img.src || "/placeholder.svg"}
                        alt={img.alt || `Ad image ${idx + 1}`}
                        className="h-28 w-full rounded object-cover bg-muted"
                        draggable={false}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveImage(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Move image ${idx + 1} up`}
                        className="rounded-md border bg-background px-2 py-1 text-xs disabled:opacity-50"
                        title="Move up"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(idx, 1)}
                        disabled={idx === images.length - 1}
                        aria-label={`Move image ${idx + 1} down`}
                        className="rounded-md border bg-background px-2 py-1 text-xs disabled:opacity-50"
                        title="Move down"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        aria-label={`Remove image ${idx + 1}`}
                        className="ml-auto rounded-md border border-destructive/40 text-destructive px-2 py-1 text-xs hover:bg-destructive/10"
                        title="Remove image"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2">
                      <label className="mb-1 block text-xs font-medium" htmlFor={`${img.id}-alt`}>
                        Alt text
                      </label>
                      <input
                        id={`${img.id}-alt`}
                        type="text"
                        value={img.alt}
                        onChange={(e) =>
                          setImages((prev) => prev.map((p) => (p.id === img.id ? { ...p, alt: e.target.value } : p)))
                        }
                        className="w-full rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!imagesValid && (
              <p className="text-xs text-destructive">Please upload 3–6 images to continue with the Photos path.</p>
            )}
          </section>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            Generation states: queued → processing → done → downloadable
          </div>
          <div className="flex items-center gap-3">
            {!!tasks.length && (
              <button
                type="button"
                onClick={resetAll}
                className="rounded-md border bg-background px-4 py-2 text-sm hover:bg-muted"
                aria-label="Reset generation results"
                title="Reset"
              >
                Reset
              </button>
            )}
            <button
              type="submit"
              disabled={
                submitting || !canGenerate || cannotAffordBatch || insufficientCredits // block when credits are too low to start
              }
              className={classNames(
                "inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:opacity-60",
              )}
              aria-disabled={submitting || !canGenerate || cannotAffordBatch || insufficientCredits}
              aria-label="Generate 3 videos"
              title={
                !canGenerate
                  ? "Complete required fields to generate"
                  : cannotAffordBatch || insufficientCredits
                    ? "Not enough credits"
                    : "Generate 3 videos"
              }
            >
              {submitting ? "Generating…" : `Generate ${VIDEOS_TO_GENERATE} Videos`}
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {tasks.length > 0 && (
        <section className="mt-8" aria-live="polite" aria-atomic="false">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium">Generation results</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadAll}
                disabled={!tasks.every((t) => !!t.url)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-60"
                aria-label="Download all results"
                title="Download all (zip)"
              >
                Download all
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {tasks.map((t, i) => (
              <div key={t.id} className="rounded-md border p-3 bg-card/50" aria-label={`Video task ${i + 1}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Video #{i + 1}</div>
                  <div
                    className={classNames(
                      "text-xs",
                      t.phase === "downloadable"
                        ? "text-green-600"
                        : t.phase === "processing"
                          ? "text-amber-600"
                          : "text-muted-foreground",
                    )}
                    aria-live="polite"
                  >
                    {t.phase === "downloadable" ? "Ready to download" : t.phase}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-2 w-full rounded bg-muted">
                    <div
                      className="h-2 rounded bg-primary transition-all"
                      style={{ width: `${Math.min(100, Math.floor(t.progress))}%` }}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.floor(t.progress)}
                      role="progressbar"
                      aria-label={`Progress for video ${i + 1}`}
                    />
                  </div>
                  <div className="mt-1 text-right text-[11px] text-muted-foreground">{Math.floor(t.progress)}%</div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  {!t.url ? (
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                      Preparing download…
                    </span>
                  ) : (
                    <>
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted"
                        aria-label={`Open video ${i + 1}`}
                      >
                        Open
                      </a>
                      <a
                        href={t.url}
                        download
                        className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:opacity-90"
                        aria-label={`Download video ${i + 1}`}
                      >
                        Download
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
