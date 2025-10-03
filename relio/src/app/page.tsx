import Link from 'next/link'
import { ArrowRight, Sparkles, FileText, Wand2, Globe, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900/20">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-200">
                Transform Your Career Story
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Turn Your{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Resume
              </span>
              <br />
              Into a Stunning{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Instantly convert your traditional resume into a beautiful, interactive portfolio website. 
              Stand out from the crowd and showcase your skills in a way that truly reflects your potential.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/signin">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Link href="/try">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="group border-2 border-gray-700 hover:border-purple-500 bg-gray-900/50 backdrop-blur-sm text-white hover:text-white px-8 py-6 text-lg font-semibold rounded-full hover:bg-purple-500/10 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Try Without Signup
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex flex-col items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Join <span className="font-semibold text-white">10,000+</span> professionals who transformed their careers
              </p>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
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
            <Link href="/auth/signin">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-purple-500/50">
                Create Your Portfolio
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
