import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { mockProfiles } from '../../mock/mockProfiles'
import { Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, User } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { toast } from 'sonner'

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('elena@prestige-pr.com')
  const [password, setPassword] = useState('••••••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Please provide your agency email.')
      return
    }

    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back to PR Agency Tracker')
      navigate('/')
    } else {
      setError(result.error || 'Authentication failed')
      toast.error(result.error || 'Authentication failed')
    }
  }

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail)
    const result = await login(userEmail)
    if (result.success) {
      toast.success(`Logged in as ${userEmail}`)
      navigate('/')
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
          <h1 className="font-semibold text-lg text-slate-900 dark:text-white">PR Client & Campaign Tracker</h1>
          <p className="text-xs text-slate-500">Agency Client, Meeting & Outbound Campaign System</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team Member Sign In
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your agency credentials to access client records, meeting transcripts, and campaign metrics.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="button"
              className="text-xs text-sky-600 hover:text-sky-500 dark:text-sky-400 font-medium"
              onClick={() => toast.info('Demo Mode: Any password is accepted')}
            >
              Forgot password?
            </button>
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
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In to Workspace
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Quick Demo Logins Bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Demo Accounts
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-sky-500" /> Instant Role Testing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mockProfiles.slice(0, 2).map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleQuickLogin(profile.email)}
              className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all text-left group"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-sky-500"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1">
                  {profile.fullName}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal uppercase ${
                    profile.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {profile.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {profile.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400">
          Supabase Auth integrated • Service role policies active
        </p>
      </div>
    </div>
  )
}
