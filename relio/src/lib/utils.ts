import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uniqueNamesGenerator, adjectives, colors, animals, NumberDictionary } from 'unique-names-generator'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 })

export function generateUsername(name?: string): string {
  // If a name is provided, use it as base with unique-names-generator
  if (name) {
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim()
      .substring(0, 12) // Limit length to leave room for unique suffix
    
    if (cleanName.length >= 3) {
      // If we have a good name, add a unique adjective or number
      const suffix = uniqueNamesGenerator({
        dictionaries: [adjectives],
        length: 1,
        style: 'lowerCase'
      })
      return `${cleanName}${suffix}`
    }
  }
  
  // Generate a fun, memorable unique username
  // Examples: "swiftbluewhale", "happygoldenpanda", "quicksilverfalcon"
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 3,
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
