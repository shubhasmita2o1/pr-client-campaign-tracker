import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const LoginPage: React.FC = () => {
  const { login, signUp, isLoading } = useAuth()
  const navigate = useNavigate()

  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('elena@prestige-pr.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please provide your work email address.')
      return
    }

    if (!password) {
      setError('Please provide your password.')
      return
    }

    setSubmitting(true)
    try {
      if (isSignUp) {
        const result = await signUp(email, password, fullName)
        if (result.success) {
          toast.success('Account created successfully! Welcome to PR Agency Tracker.')
          navigate('/')
        } else {
          setError(result.error || 'Failed to create account')
          toast.error(result.error || 'Failed to create account')
        }
      } else {
        const result = await login(email, password)
        if (result.success) {
          toast.success('Welcome back to PR Agency Tracker')
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

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail)
    setPassword('password123')
    setSubmitting(true)
    setError(null)
    const result = await login(userEmail, 'password123')
    setSubmitting(false)
    if (result.success) {
      toast.success(`Logged in as ${userEmail}`)
      navigate('/')
    } else {
      setError(result.error || 'Authentication failed')
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
          <h1 className="font-semibold text-lg text-slate-900 dark:text-white">PR Client &amp; Campaign Tracker</h1>
          <p className="text-xs text-slate-500">Agency Client, Meeting &amp; Outbound Campaign System</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isSignUp ? 'Create Agency Account' : 'Team Member Sign In'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSignUp
            ? 'Register your PR team account to access live Supabase database and tracking tools.'
            : 'Enter your agency credentials to access client records, meeting transcripts, and campaign metrics.'}
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
                placeholder="Elena Rostova"
                className="pl-9 h-10 text-sm"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Work Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@prestige-pr.com"
              className="pl-9 h-10 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            {!isSignUp && (
              <span className="text-xs text-slate-400">
                Default: password123
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-9 pr-9 h-10 text-sm"
              required
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

        <Button
          type="submit"
          className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-sm shadow-sky-500/25"
          disabled={submitting || isLoading}
        >
          {submitting || isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Authenticating...</span>
            </span>
          ) : (
            <>
              <span>{isSignUp ? 'Create Account' : 'Sign In to Workspace'}</span>
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
            setError(null)
          }}
          className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium inline-flex items-center gap-1.5"
        >
          {isSignUp ? (
            <>Already have a team account? Sign in here</>
          ) : (
            <>
              <UserPlus className="h-3.5 w-3.5" />
              Need to create a new team account? Register here
            </>
          )}
        </button>
      </div>

      {/* Quick Access Team Profiles for easy testing */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
            1-Click Demo Accounts:
          </span>
          <span className="text-[11px] text-slate-400">Team Pre-sets</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('elena@prestige-pr.com')}
            className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
              ER
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Elena Rostova</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Admin</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('priya@prestige-pr.com')}
            className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-bold text-xs flex items-center justify-center shrink-0">
              PS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Priya Sharma</p>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">PR Lead</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
