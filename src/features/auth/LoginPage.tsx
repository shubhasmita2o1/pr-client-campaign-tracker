import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight, User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const LoginPage: React.FC = () => {
  const { login, signUp, isLoading } = useAuth()
  const navigate = useNavigate()

  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your work email address.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setSubmitting(true)
    try {
      if (isSignUp) {
        const result = await signUp(email, password, fullName)
        if (result.success) {
          toast.success('Account created successfully! Welcome aboard.')
          navigate('/')
        } else {
          setError(result.error || 'Failed to create account')
          toast.error(result.error || 'Failed to create account')
        }
      } else {
        const result = await login(email, password)
        if (result.success) {
          toast.success('Welcome back!')
          navigate('/')
        } else {
          setError(result.error || 'Invalid email or password')
          toast.error(result.error || 'Invalid credentials')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mobile Brand Header */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-subtle">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">
            Prestige PR CRM
          </h1>
          <p className="text-xs text-muted-foreground">Agency Client &amp; Campaign Tracker</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          {isSignUp ? 'Create agency account' : 'Sign in to PR Operations'}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isSignUp
            ? 'Start managing client retainers, briefs, and campaigns in one place.'
            : 'Enter your agency credentials to access your executive workspace.'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Rostova"
                className="pl-9 h-10 text-sm rounded-xl border-border/80"
                required
                autoComplete="name"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@prestige-pr.com"
              className="pl-9 h-10 text-sm rounded-xl border-border/80"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? 'Minimum 8 characters' : 'Enter your password'}
              className="pl-9 pr-9 h-10 text-sm rounded-xl border-border/80"
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pl-9 h-10 text-sm rounded-xl border-border/80"
                required
                autoComplete="new-password"
              />
            </div>
          </div>
        )}

        {!isSignUp && (
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-10.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2 shadow-subtle rounded-xl"
          disabled={submitting || isLoading}
        >
          {submitting || isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
            </span>
          ) : (
            <>
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Switch between Sign In and Sign Up */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            resetForm()
          }}
          className="text-xs sm:text-sm text-primary hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          {isSignUp ? (
            <>Already have an account? Sign in</>
          ) : (
            <>
              <UserPlus className="h-3.5 w-3.5" />
              Don’t have an account? Create one
            </>
          )}
        </button>
      </div>
    </div>
  )
}
