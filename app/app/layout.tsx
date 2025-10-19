// app/app/layout.tsx
import type { ReactNode } from 'react'
import AppLayoutShell from '@/components/app-layout-shell'

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppLayoutShell>{children}</AppLayoutShell>
}
