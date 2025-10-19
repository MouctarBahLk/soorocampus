import * as React from "react"
import { cn } from "@/lib/utils"

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-sm", className)} {...props} />
}

export function AvatarFallback({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("font-medium text-slate-700", className)} {...props}>{children}</div>
}
