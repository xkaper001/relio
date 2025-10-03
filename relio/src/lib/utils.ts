import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUsername(name?: string): string {
  // If a name is provided, use it as base
  if (name) {
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim()
      .substring(0, 15) // Limit length
    
    const randomNum = Math.floor(Math.random() * 1000)
    return `${cleanName}${randomNum}`
  }
  
  // Otherwise, generate a fun unique username
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '',
    length: 2,
    style: 'lowerCase'
  })
}

export function getRandomAvatar(): string {
  // Generate random number between 1 and 100
  const avatarNumber = Math.floor(Math.random() * 100) + 1
  // Format as 3-digit string with leading zeros
  const avatarId = avatarNumber.toString().padStart(3, '0')
  // Return the avatar path
  return `/avatars/${avatarId}.svg`
}

export function generateTempUsername(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`
}
