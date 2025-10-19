import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const jar = await cookies()
  const premium = jar.get('premium')?.value === '1'
  return NextResponse.json({ premium })
}

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('premium', '1', { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 * 365 })
  return res
}
