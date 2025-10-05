'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRight, Sparkles, FileText, Wand2, Globe, CheckCircle, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PixelBlast from '@/components/PixelBlast'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-black" style={{ minHeight: '100vh', height: '100vh' }}>
        {/* PixelBlast Background */}
        <div className="absolute inset-0 w-full h-full">
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#B19EEF"
            patternScale={3}
            patternDensity={1.2}
            enableRipples
            rippleSpeed={0.4}
            // liquid={true}
            // liquidStrength={0.15}
            edgeFade={0.3}
            speed={0.5}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Header */}
        <div className="absolute top-8 left-0 w-full h-[60px] z-10 pointer-events-none">
          <div className="mx-auto w-[90%] md:w-[60%] h-full rounded-[50px] py-4 px-6 flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] pointer-events-auto"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <Link href="/" className="flex items-center cursor-pointer">
              <h2 className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-array)' }}>RELIO</h2>
            </Link>

            <a 
              href="https://github.com/xkaper001/relio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">GitHub</span>
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-4xl">
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2 px-6 h-[34px] rounded-full bg-white/5 border border-white/20 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Transform Your Career Story
              </span>
            </div>

            {/* Main Heading */}
            <h1 
              className="text-white font-bold text-center leading-[1.2] tracking-[-0.02em] max-w-[20ch]"
              style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                textShadow: '0 0 16px rgba(0, 0, 0, 0.5)'
              }}
            >
              Turn Your Resume Into a Stunning Portfolio in Seconds
            </h1>

            {/* CTA Buttons */}
            <div className="flex gap-4 items-center mt-8">
              <Link href={session ? '/dashboard' : '/auth/signin'} className="cursor-pointer">
                <Button variant="default" size="lg" className="cursor-pointer">
                  {session ? 'Go to Dashboard' : 'Get Started Free'}
                </Button>
              </Link>
              
              <Link href={session ? '/dashboard' : '/try'} className="cursor-pointer">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  {session ? 'Upload Resume' : 'Try Without Signup'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your resume into a portfolio in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">1. Upload Resume</h3>
              <p className="text-gray-400">
                Upload your PDF or DOCX resume. We support all standard formats.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">2. AI Processing</h3>
              <p className="text-gray-400">
                Our AI extracts and structures your information intelligently.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                <Globe className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">3. Get Your Portfolio</h3>
              <p className="text-gray-400">
                Instantly receive a beautiful, shareable portfolio website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Why Choose Relio?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to showcase your professional story
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-lg bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to Stand Out?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of professionals who are already using Relio to showcase their work
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={session ? '/dashboard' : '/auth/signin'} className="cursor-pointer">
              <Button size="lg" className="text-lg cursor-pointer">
                {session ? 'Go to Dashboard' : 'Create Your Portfolio'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: 'AI-Powered Parsing',
    description: 'Advanced AI technology extracts and structures your resume data with precision',
  },
  {
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates that make your work shine',
  },
  {
    title: 'Instant Publishing',
    description: 'Your portfolio goes live immediately with a custom URL',
  },
  {
    title: 'Easy Editing',
    description: 'Update and customize your portfolio anytime with our intuitive editor',
  },
  {
    title: 'No Coding Required',
    description: 'Create a professional portfolio without any technical knowledge',
  },
  {
    title: 'Mobile Responsive',
    description: 'Your portfolio looks perfect on every device and screen size',
  },
]
