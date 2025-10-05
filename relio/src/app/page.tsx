'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRight, Sparkles, FileText, Wand2, Globe, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { motion } from 'framer-motion'

const PixelBlast = dynamic(() => import('@/components/PixelBlast'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
})

const HandWrittenTitle = dynamic(() => 
  import('@/components/ui/hand-writing-text').then(mod => ({ default: mod.HandWrittenTitle })),
  { ssr: false }
)

const Features = dynamic(() => 
  import('@/components/ui/features-8').then(mod => ({ default: mod.Features })),
  { ssr: false }
)

export default function Home() {
  const { status } = useSession()

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-black min-h-screen md:h-screen" style={{ contain: 'layout style paint' }}>
        {/* PixelBlast Background */}
        <div className="absolute inset-0 w-full h-full" style={{ isolation: 'isolate' }}>
          <Suspense fallback={<div className="w-full h-full bg-black" />}>
            <PixelBlast
              variant="circle"
              pixelSize={6}
              color="#B19EEF"
              patternScale={3}
              patternDensity={1.2}
              enableRipples
              rippleSpeed={0.4}
              edgeFade={0.3}
              speed={0.5}
              autoPauseOffscreen={true}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        </div>

        {/* Header */}
        <div className="absolute top-4 md:top-8 left-0 w-full z-50 px-4">
          <div className="mx-auto w-full md:w-[60%] max-w-5xl rounded-[50px] py-3 md:py-4 px-4 md:px-6 flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <Link href="/" className="flex items-center cursor-pointer">
              <h2 className="text-white text-lg md:text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-array)' }}>RELIO</h2>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              <a 
                href="https://www.producthunt.com/products/relio-2?launch=relio-2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 md:gap-2 text-white hover:text-white/80 transition-colors cursor-pointer"
                aria-label="Product Hunt"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0C8.95 0 0 8.95 0 20C0 31.05 8.95 40 20 40C31.05 40 40 31.05 40 20C40 8.95 31.05 0 20 0ZM23 23H17V28H13V12H23C25.7614 12 28 14.2386 28 17C28 19.7614 25.7614 22 23 22V23ZM23 18C23.5523 18 24 17.5523 24 17C24 16.4477 23.5523 16 23 16H17V18H23Z" fill="currentColor"/>
                </svg>
                <span className="hidden sm:inline text-sm font-medium">Product Hunt</span>
              </a>

              <a 
                href="https://github.com/xkaper001/relio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 md:gap-2 text-white hover:text-white/80 transition-colors cursor-pointer"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline text-sm font-medium">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen md:h-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-0 md:pb-0">
          <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 max-w-4xl">
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-6 h-[30px] md:h-[34px] rounded-full bg-white/5 border border-white/20 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              <span className="text-xs md:text-sm font-medium text-white">
                Transform Your Career Story
              </span>
            </div>

            {/* Main Heading */}
            <h1 
              className="text-white font-bold text-center leading-[1.15] md:leading-[1.2] tracking-[-0.02em] px-2"
              style={{ 
                fontSize: 'clamp(1.75rem, 8vw, 3.5rem)',
                textShadow: '0 0 16px rgba(0, 0, 0, 0.5)'
              }}
            >
              Turn Your Resume Into a Stunning Portfolio in Seconds
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center mt-6 md:mt-8 w-full sm:w-auto px-4 sm:px-0">
              <Link href={status === 'authenticated' ? '/dashboard' : '/auth/signin'} className="cursor-pointer w-full sm:w-auto">
                <Button variant="default" size="lg" className="cursor-pointer w-full sm:w-auto text-sm md:text-base">
                  {status === 'authenticated' ? 'Go to Dashboard' : 'Get Started Free'}
                </Button>
              </Link>
              
              <Link href={status === 'authenticated' ? '/dashboard' : '/try'} className="cursor-pointer w-full sm:w-auto">
                <Button variant="outline" size="lg" className="cursor-pointer w-full sm:w-auto text-sm md:text-base">
                  {status === 'authenticated' ? 'Upload Resume' : 'Try Without Signup'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-8 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Transform your resume into a portfolio in three simple steps
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 md:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Step 1 */}
            <motion.div 
              className="flex flex-col items-center text-center space-y-4"
              variants={fadeInUp}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FileText className="w-8 h-8 text-purple-400" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">1. Upload Resume</h3>
              <p className="text-sm md:text-base text-gray-400">
                Upload your PDF or DOCX resume. We support all standard formats.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="flex flex-col items-center text-center space-y-4"
              variants={fadeInUp}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Wand2 className="w-8 h-8 text-blue-400" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">2. AI Processing</h3>
              <p className="text-sm md:text-base text-gray-400">
                Our AI extracts and structures your information intelligently.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="flex flex-col items-center text-center space-y-4"
              variants={fadeInUp}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Globe className="w-8 h-8 text-pink-400" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">3. Get Your Portfolio</h3>
              <p className="text-sm md:text-base text-gray-400">
                Instantly receive a beautiful, shareable portfolio website.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.div 
        className="bg-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <motion.div 
          className="text-center pt-12 md:pt-16 pb-6 md:pb-8 px-4"
          variants={fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            Why Choose Relio?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Everything you need to showcase your professional story
          </p>
        </motion.div>
        <Suspense fallback={<div className="py-16 bg-black" />}>
          <Features />
        </Suspense>
      </motion.div>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-black border-t border-gray-800">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            variants={fadeInUp}
          >
            Ready to Stand Out?
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4"
            variants={fadeInUp}
          >
            Join professionals who are already using Relio to showcase their work
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={scaleIn}
          >
            <Link href={status === 'authenticated' ? '/dashboard' : '/auth/signin'} className="cursor-pointer w-full sm:w-auto">
              <Button size="lg" className="text-base md:text-lg cursor-pointer w-full sm:w-auto">
                {status === 'authenticated' ? 'Go to Dashboard' : 'Create Your Portfolio'}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Hand Written Section */}
      <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 bg-black">
        <Suspense fallback={<div className="py-24" />}>
          <HandWrittenTitle 
            title="RELIO" 
            subtitle="Transform Your Career Story"
          />
        </Suspense>
      </section>
    </div>
  )
}
