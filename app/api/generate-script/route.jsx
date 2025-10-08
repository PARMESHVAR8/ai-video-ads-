 import { P } from "framer-motion/dist/types.d-DsEeKk6G"
import { NextResponse } from "next/server"
import OpenAI from "openai"

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})
export async function POST(request) {

    const { topic } = await request.json()
    const PROMPT = GENERATE_SCRIPT_PROMPT.replace("{topic}", topic)

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-preview-09-2025",
    messages: [
      { role: "user", content: PROMPT }
    ],
  })

  console.log(completion.choices[0].message)
  return NextResponse.json(completion.choices[0].message?.content)
}