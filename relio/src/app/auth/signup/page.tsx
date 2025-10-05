'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github, Mail, Loader2 } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import PrismaticBurst from '@/components/PrismaticBurst'
import ShinyText from '@/components/ShinyText'

export default function SignUp() {
  const router = useRouter()
  const { status } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Show loading screen while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <ShinyText
          text="RELIO"
          disabled={false}
          speed={3}
          className="text-6xl font-bold"
          style={{ fontFamily: 'var(--font-array)' }}
        />
      </div>
    )
  }

  // Don't render if already authenticated
  if (status === 'authenticated') {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Signup failed')
        setLoading(false)
        return
      }

      // Auto sign in after signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      console.log('Auto sign in result:', result)

      if (result?.error) {
        setError('Account created but sign in failed. Redirecting to sign in page...')
        setTimeout(() => {
          window.location.href = '/auth/signin'
        }, 2000)
      } else if (result?.ok) {
        // Successfully signed in, redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        setError('An unexpected error occurred. Please try signing in manually.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    setError('')
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (err) {
      console.error('OAuth sign in error:', err)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* PrismaticBurst Background */}
      <div className="absolute inset-0 w-full h-full">
        <PrismaticBurst
          animationType="rotate3d"
          intensity={2}
          speed={0.5}
          distort={1.0}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.25}
          rayCount={24}
          mixBlendMode="lighten"
          colors={['#B19EEF', '#8B5CF6', '#C084FC']}
        />
      </div>
      
      {/* Content */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Create Your Account</h2>
          <p className="mt-2 text-white/60">Start building your portfolio today</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl space-y-6"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          {/* OAuth Providers */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading || oauthLoading !== null}
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Mail className="w-5 h-5 mr-2" />
              )}
              {oauthLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading || oauthLoading !== null}
            >
              {oauthLoading === 'github' ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Github className="w-5 h-5 mr-2" />
              )}
              {oauthLoading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/50 text-white/60">Or sign up with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-full text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || oauthLoading !== null}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-white/60">Already have an account? </span>
            <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
