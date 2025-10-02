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
          
          CRITICAL: You MUST follow this EXACT structure:
          
          {
            "name": "Full Name",
            "title": "Job Title/Role",
            "about": "Professional summary (2-3 sentences)",
            "email": "email@example.com",
            "phone": "+1234567890",
            "location": "City, Country",
            "linkedin": "linkedin.com/in/username",
            "github": "github.com/username",
            "website": "portfolio.com",
            "skills": ["Skill1", "Skill2", "Skill3"],
            "experience": [{
              "company": "Company Name",
              "position": "Job Title",
              "startDate": "Jan 2020",
              "endDate": "Dec 2022",
              "description": "Brief description",
              "achievements": ["Achievement 1", "Achievement 2"]
            }],
            "education": [{
              "institution": "University Name",
              "degree": "Bachelor's",
              "field": "Computer Science",
              "startDate": "2015",
              "endDate": "2019",
              "gpa": "3.8"
            }],
            "projects": [{
              "name": "Project Name",
              "description": "What it does",
              "technologies": ["Tech1", "Tech2"],
              "link": "https://project.com",
              "github": "github.com/user/repo"
            }]
          }
          
          IMPORTANT RULES:
          - "skills" MUST be a flat array of strings, NOT nested objects
          - Do NOT create subcategories like "programmingLanguages", "frameworks", etc.
          - Combine ALL skills into a single flat array
          - Extract ALL programming languages, frameworks, tools, and technologies into the skills array
          - Format dates as "MMM YYYY" (e.g., "Jan 2020") or just year
          - If a field is missing, omit it (except required fields)
          - For 'about', create a compelling 2-3 sentence summary if not in resume`,
        },
        {
          role: 'user',
          content: `Parse this resume and extract the information. Remember: skills MUST be a flat array of strings, not nested objects.\n\nResume:\n${resumeText}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'portfolio_config',
          strict: true,
          schema: portfolioSchema,
        },
      },
      temperature: 0.2,
      max_tokens: 4000,
    })

    const content = (response.choices as any)?.[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    const config = JSON.parse(content) as PortfolioConfig
    
    // Validate that skills is a flat array (fallback just in case)
    if (config.skills && typeof config.skills === 'object' && !Array.isArray(config.skills)) {
      // If it's an object with nested arrays, flatten it
      const flatSkills: string[] = []
      Object.values(config.skills).forEach((value: any) => {
        if (Array.isArray(value)) {
          flatSkills.push(...value)
        }
      })
      config.skills = [...new Set(flatSkills)] // Remove duplicates
    }
    
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
