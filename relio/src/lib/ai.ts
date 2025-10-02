import Cerebras from '@cerebras/cerebras_cloud_sdk'

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY || '',
})

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
  experience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    link?: string
    github?: string
  }>
}

const portfolioSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    title: { type: 'string' },
    about: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    location: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    website: { type: 'string' },
    skills: {
      type: 'array',
      items: { type: 'string' },
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          position: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          description: { type: 'string' },
          achievements: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['company', 'position', 'startDate', 'endDate', 'description'],
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          institution: { type: 'string' },
          degree: { type: 'string' },
          field: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          gpa: { type: 'string' },
        },
        required: ['institution', 'degree', 'field', 'startDate', 'endDate'],
      },
    },
    projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          technologies: {
            type: 'array',
            items: { type: 'string' },
          },
          link: { type: 'string' },
          github: { type: 'string' },
        },
        required: ['name', 'description', 'technologies'],
      },
    },
  },
  required: ['name', 'title', 'about', 'skills', 'experience', 'education'],
}

export async function parseResumeToPortfolio(
  resumeText: string
): Promise<PortfolioConfig> {
  try {
    const response = await client.chat.completions.create({
      model: 'llama3.3-70b',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume parser. Extract structured information from resumes and convert them into a JSON format suitable for a portfolio website. 
          
          Guidelines:
          - Extract all personal information, skills, work experience, education, and projects
          - Format dates consistently (e.g., "Jan 2020" or "2020")
          - For the 'about' field, create a compelling professional summary if one doesn't exist
          - Include all relevant contact information found
          - Extract achievements as bullet points for each experience
          - Identify technologies and skills mentioned throughout the resume
          - Be thorough and accurate`,
        },
        {
          role: 'user',
          content: `Parse this resume and extract the information:\n\n${resumeText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      // max_tokens: 4000,
      stream: false,
    })

    const content = (response.choices as any)?.[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    const config = JSON.parse(content) as PortfolioConfig
    return config
  } catch (error) {
    console.error('Error parsing resume with Cerebras:', error)
    throw new Error('Failed to parse resume')
  }
}

export async function generateAboutMe(
  name: string,
  title: string,
  skills: string[],
  experience: PortfolioConfig['experience']
): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'llama3.1-8b',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional copywriter. Create a compelling "About Me" section for a portfolio website. Keep it concise (2-3 sentences), professional, and engaging.',
        },
        {
          role: 'user',
          content: `Create an "About Me" section for ${name}, a ${title}. 
          Skills: ${skills.join(', ')}
          Recent experience: ${experience[0]?.position} at ${experience[0]?.company}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return (response.choices as any)?.[0]?.message?.content || ''
  } catch (error) {
    console.error('Error generating About Me:', error)
    return `${name} is a ${title} with expertise in ${skills.slice(0, 3).join(', ')}.`
  }
}
