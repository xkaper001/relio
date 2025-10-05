'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { PortfolioConfig } from '@/types'
import * as THREE from 'three'

// Helper function to ensure URLs have proper protocol
const ensureHttps = (url: string): string => {
  if (!url) return url
  const trimmedUrl = url.trim()
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  return `https://${trimmedUrl}`
}

interface PortfolioViewAnimatedProps {
  config: PortfolioConfig
  username?: string
  userImage?: string | null
  isTemporary?: boolean
  expiresAt?: Date | null
  avatar?: string | null
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

// Aurora Background Component
const AuroraBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!mountRef.current) return
    const currentMount = mountRef.current
    
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer()
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.zIndex = '0'
    renderer.domElement.style.display = 'block'
    
    currentMount.appendChild(renderer.domElement)
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        #define NUM_OCTAVES 3
        
        float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
        
        float noise(vec2 p){
          vec2 ip=floor(p);
          vec2 u=fract(p);
          u=u*u*(3.0-2.0*u);
          float res=mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),
            u.y
          );
          return res*res;
        }
        
        float fbm(vec2 x) {
          float v=0.0;
          float a=0.3;
          vec2 shift=vec2(100);
          mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));
          for(int i=0;i<NUM_OCTAVES;++i){
            v+=a*noise(x);
            x=rot*x*2.0+shift;
            a*=0.4;
          }
          return v;
        }
        
        void main() {
          vec2 p=((gl_FragCoord.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);
          vec4 o=vec4(0.);
          float f=2.+fbm(p+vec2(iTime*5.,0.))*.5;
          
          for(float i=0.;i++<35.;){
            vec2 v=p+cos(i*i+(iTime+p.x*.08)*.025+i*vec2(13.,11.))*3.5;
            float tailNoise=fbm(v+vec2(iTime*.5,i))*.3*(1.-(i/35.));
            vec4 auroraColors=vec4(
              .1+.3*sin(i*.2+iTime*.4),
              .3+.5*cos(i*.3+iTime*.5),
              .7+.3*sin(i*.4+iTime*.3),
              1.
            );
            vec4 currentContribution=auroraColors*exp(sin(i*i+iTime*.8))/length(max(v,vec2(v.x*f*.015,v.y*1.5)));
            float thinnessFactor=smoothstep(0.,1.,i/35.)*.6;
            o+=currentContribution*(1.+tailNoise*.8)*thinnessFactor;
          }
          
          o=tanh(pow(o/100.,vec4(1.6)));
          gl_FragColor=o*1.5;
        }
      `
    })
    
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      material.uniforms.iTime.value += 0.016
      renderer.render(scene, camera)
    }
    
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    animate()
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
      material.dispose()
      geometry.dispose()
    }
  }, [])
  
  return <div ref={mountRef} />
}

export default function PortfolioViewAnimated({
  config,
  username,
  userImage,
  isTemporary,
  expiresAt,
  avatar,
}: PortfolioViewAnimatedProps) {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    if (isTemporary && expiresAt) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const expiry = new Date(expiresAt).getTime()
        const distance = expiry - now

        if (distance < 0) {
          setTimeLeft('Expired')
          return
        }

        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m remaining`)
      }

      updateTimer()
      const interval = setInterval(updateTimer, 60000)
      return () => clearInterval(interval)
    }
  }, [isTemporary, expiresAt])

  const handleSavePortfolio = async () => {
    // If user is not authenticated, redirect to signup with callbackUrl
    if (!session) {
      const currentPath = pathname || '/'
      await signIn(undefined, { callbackUrl: currentPath })
      return
    }

    // If user is authenticated, claim the portfolio
    setSaving(true)
    try {
      const slug = pathname?.split('/').pop()
      const response = await fetch('/api/claim-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      })

      const data = await response.json()

      if (response.ok) {
        // Portfolio claimed successfully, redirect to dashboard
        router.push('/dashboard')
      } else {
        alert(data.error || 'Failed to save portfolio')
        setSaving(false)
      }
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('An error occurred while saving the portfolio')
      setSaving(false)
    }
  }

  // Default section order and get custom order
  const DEFAULT_SECTION_ORDER = ['skills', 'experience', 'education', 'projects']
  const sectionOrder = config.sectionOrder || DEFAULT_SECTION_ORDER
  const allSections = ['hero', 'about', ...sectionOrder]

  // Get section display name
  const getSectionDisplayName = (sectionKey: string): string => {
    const names: { [key: string]: string } = {
      'skills': 'Skills',
      'experience': 'Experience',
      'education': 'Education',
      'projects': 'Projects',
      'about': 'About'
    }
    return names[sectionKey] || sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  }

  // Render individual sections based on key
  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'experience':
        if (!config.experience || config.experience.length === 0) return null
        return (
          <section key={sectionKey} id="experience" className="py-24 px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="container mx-auto max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-muted px-4 py-2 text-sm mb-8"
              >
                Experience
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="space-y-6"
              >
                {config.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    className="group relative overflow-hidden rounded-3xl border p-8 shadow-sm transition-all hover:shadow-md bg-card"
                  >
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300" />
                    
                    <div className="relative">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{exp.position}</h3>
                          <p className="text-lg text-primary">{exp.company}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{exp.description}</p>
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <svg className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        )

      case 'skills':
        if (!config.skills || config.skills.length === 0) return null
        return (
          <section key={sectionKey} id="skills" className="py-24 px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="container mx-auto max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-muted px-4 py-2 text-sm mb-8"
              >
                Skills & Technologies
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="flex flex-wrap gap-3"
              >
                {config.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeIn}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        )

      case 'projects':
        if (!config.projects || config.projects.length === 0) return null
        return (
          <section key={sectionKey} id="projects" className="py-24 px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="container mx-auto max-w-6xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-muted px-4 py-2 text-sm mb-8"
              >
                Projects
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid gap-6 md:grid-cols-2"
              >
                {config.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    className="group relative overflow-hidden rounded-3xl border p-8 shadow-sm transition-all hover:shadow-md bg-card"
                  >
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300" />
                    
                    <div className="relative">
                      <h3 className="text-xl font-bold mb-3">{project.name}</h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-3">
                        {project.link && (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={ensureHttps(project.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </motion.a>
                        )}
                        {project.github && (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={ensureHttps(project.github)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            Source Code
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        )

      case 'education':
        if (!config.education || config.education.length === 0) return null
        return (
          <section key={sectionKey} id="education" className="py-24 px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="container mx-auto max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-muted px-4 py-2 text-sm mb-8"
              >
                Education
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="space-y-6"
              >
                {config.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    className="group relative overflow-hidden rounded-3xl border p-8 shadow-sm transition-all hover:shadow-md bg-card"
                  >
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300" />
                    
                    <div className="relative">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{edu.degree}</h3>
                          <p className="text-lg text-primary">{edu.institution}</p>
                          {edu.gpa && (
                            <p className="text-sm text-muted-foreground mt-1">GPA: {edu.gpa}</p>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{edu.field}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        )

      default:
        return null
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      // Update active section based on scroll position
      const sections = allSections
      const scrollPosition = window.scrollY + 200
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AuroraBackground />
      
      {/* Temporary Portfolio Banner */}
      {isTemporary && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-primary/10 border-b border-primary/20 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  ⚠️ This portfolio will be deleted in {timeLeft}. Sign up to save permanently.
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleSavePortfolio}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save My Portfolio'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Fixed Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed ${isTemporary ? 'top-[52px]' : 'top-0'} z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          scrollY > 50 ? 'shadow-md' : ''
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={config.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : userImage ? (
                <Image
                  src={userImage}
                  alt={config.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">
                    {config.name.charAt(0)}
                  </span>
                </div>
              )}
            </motion.div>
            <span className="font-bold text-xl">{config.name}</span>
          </div>
          
          <nav className="hidden md:flex gap-6">
            {['about', ...sectionOrder].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === item ? 'text-primary' : ''
                }`}
              >
                {getSectionDisplayName(item)}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            {config.github && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={ensureHttps(config.github)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </motion.a>
            )}
            {config.linkedin && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={ensureHttps(config.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
            )}
          </div>
        </div>
      </motion.nav>

      <main className="relative pt-16">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={config.name}
                  width={150}
                  height={150}
                  className="mx-auto rounded-full border-4 border-primary/20"
                />
              ) : userImage ? (
                <Image
                  src={userImage}
                  alt={config.name}
                  width={150}
                  height={150}
                  className="mx-auto rounded-full border-4 border-primary/20"
                />
              ) : (
                <div className="mx-auto h-32 w-32 rounded-full bg-primary flex items-center justify-center border-4 border-primary/20">
                  <span className="text-primary-foreground font-bold text-4xl">
                    {config.name.charAt(0)}
                  </span>
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-4"
            >
              {config.name}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-2xl md:text-3xl font-semibold mb-6"
            >
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                {config.title}
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {config.email && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`mailto:${config.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Me
                </motion.a>
              )}
              {config.website && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={ensureHttps(config.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-input bg-background hover:bg-accent"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Visit Website
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto max-w-4xl"
          >
            <div className="rounded-3xl border bg-card p-8 md:p-12 shadow-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-muted px-4 py-2 text-sm mb-6"
              >
                About Me
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {config.about}
              </motion.p>
              
              {(config.location || config.phone) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 flex flex-wrap gap-6"
                >
                  {config.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {config.location}
                    </div>
                  )}
                  {config.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {config.phone}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Dynamic Sections in Custom Order */}
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}

        {/* Footer */}
        <footer className="border-t py-12 px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto max-w-4xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} {config.name}. All rights reserved.
                </p>
                {isTemporary && expiresAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    This portfolio will expire on {new Date(expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="flex gap-4">
                {config.github && (
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={ensureHttps(config.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </motion.a>
                )}
                {config.linkedin && (
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={ensureHttps(config.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </motion.a>
                )}
                {config.email && (
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={`mailto:${config.email}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </footer>
      </main>
    </div>
  )
}
