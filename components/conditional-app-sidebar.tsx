'use client'
import { usePathname } from 'next/navigation'
import AppSidebar from '@/components/app-sidebar'

export default function ConditionalAppSidebar() {
  const pathname = usePathname()
  if (pathname.startsWith('/app/admin')) return null
  return <AppSidebar />
}
