import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET() {
  const result = await sendWelcomeEmail(
    'mamadoumouctarbah70@gmail.com', 
    'Test User'
  )
  
  return NextResponse.json(result)
}