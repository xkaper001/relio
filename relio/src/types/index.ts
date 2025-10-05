export interface PortfolioConfig {
  name: string
  title: string
  about: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  sectionOrder?: string[]
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link?: string
  github?: string
}

export interface User {
  id: string
  name?: string | null
  email?: string | null
  username: string
  isTemporary: boolean
  expiresAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Portfolio {
  id: string
  userId: string
  config: PortfolioConfig
  createdAt: Date
  updatedAt: Date
}
