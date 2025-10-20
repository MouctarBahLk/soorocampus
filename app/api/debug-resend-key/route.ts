// app/api/debug-resend-key/route.ts
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
export async function GET() {
  const k = process.env.RESEND_API_KEY || ''
  return NextResponse.json({ prefix10: k.slice(0,10), suffix6: k.slice(-6), len: k.length })
}
