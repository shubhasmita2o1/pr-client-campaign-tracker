import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl p-8 border border-border/80 shadow-md text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center">
          <FileQuestion className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-500">
            404 Error
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The PR dashboard record, meeting transcript, or client file you are looking for does not exist or has been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs gap-1.5"
          >
            <Link to="/clients">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Browse Clients</span>
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="text-xs gap-1.5 bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Link to="/">
              <Home className="h-3.5 w-3.5" />
              <span>Agency Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
