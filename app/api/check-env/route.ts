// app/api/check-env/route.ts
import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET() {
  const key = process.env.RESEND_API_KEY
  return NextResponse.json({
    defined: !!key,
    prefix: key?.slice(0, 3) || null,
  })
}
