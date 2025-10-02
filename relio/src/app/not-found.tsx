import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-3xl font-semibold text-foreground">Portfolio Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          This portfolio doesn't exist or may have expired. Create your own portfolio today!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/">
            <Button size="lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline">
              Create Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
