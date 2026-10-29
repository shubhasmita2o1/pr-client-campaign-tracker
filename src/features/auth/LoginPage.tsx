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
          navigate('/dashboard')
        } else {
          setError(result.error || 'Failed to create account')
          toast.error(result.error || 'Failed to create account')
        }
      } else {
        const result = await login(email, password)
        if (result.success) {
          toast.success('Welcome back!')
          navigate('/dashboard')
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
        <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-semibold text-lg text-slate-900 dark:text-white">
            PR Client & Campaign Tracker
          </h1>
          <p className="text-xs text-slate-500">Agency Client & Campaign Management</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSignUp
            ? 'Start managing clients, meetings, and campaigns in one place.'
            : 'Enter your credentials to access your workspace.'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="pl-9 h-10 text-sm"
                required
                autoComplete="name"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              className="pl-9 h-10 text-sm"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? 'Minimum 8 characters' : 'Enter your password'}
              className="pl-9 pr-9 h-10 text-sm"
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pl-9 h-10 text-sm"
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
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-sm shadow-sky-500/25"
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
          className="text-sm text-sky-600 dark:text-sky-400 hover:underline font-medium inline-flex items-center gap-1.5"
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