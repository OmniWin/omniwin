import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        destructive:
          "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/80",
        outline: "text-zinc-950 dark:text-zinc-50",
        gray: "bg-gray-50 text-gray-600 ring-gray-500/80 ring-1",
        red: "bg-red-700/10 text-red-700 ring-red-600/80 ring-1",
        yellow: "bg-yellow-700/10 text-yellow-800 ring-yellow-600/80 ring-1",
        green: "bg-green-700/10 text-green-700 ring-green-600/80 ring-1",
        blue: "bg-blue-700/10 text-blue-700 ring-blue-700/80 ring-1",
        indigo: "bg-indigo-700/10 text-indigo-700 ring-indigo-700/80 ring-1",
        purple: "bg-purple-700/10 text-purple-700 ring-purple-700/80 ring-1",
        pink: "bg-pink-700/10 text-pink-700 ring-pink-700/80 ring-1",
        sky: "bg-sky-700/10 text-sky-700 ring-sky-700/80 ring-1",
        lime: "bg-lime-700/10 text-lime-700 ring-lime-700/80 ring-1",
        emerald: "bg-emerald-700/10 text-emerald-500 ring-emerald-700/80 ring-1",
        blood: "bg-blood-700/10 text-blood-700 ring-blood-700/80 ring-1",
        water: "bg-water-700/10 text-water-500 ring-water-700/80 ring-1",
        zinc: "bg-zinc-700/10 text-zinc-700 ring-zinc-700/80 ring-1",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      form: {
        pill: "rounded-full",
        round: "rounded-md",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      form: "round",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, size, form, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, form }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
