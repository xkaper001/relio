import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTempUsername(): string {
  const randomNum = Math.floor(Math.random() * 100000)
  return `temp-${randomNum}`
}

export function generateUsername(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15)
  const randomNum = Math.floor(Math.random() * 1000)
  return `${base}${randomNum}`
}

export function isUsernameAvailable(username: string): boolean {
  // This will be implemented in the API route
  return true
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  } catch {
    return dateString
  }
}
