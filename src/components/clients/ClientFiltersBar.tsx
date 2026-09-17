import React from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ClientFilters } from '@/types/client'
import { agencyOwners } from '@/data/mockClients'
import { Search, RotateCcw } from 'lucide-react'

interface ClientFiltersBarProps {
  filters: ClientFilters
  setFilters: React.Dispatch<React.SetStateAction<ClientFilters>>
  totalCount: number
  filteredCount: number
}

export const ClientFiltersBar: React.FC<ClientFiltersBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount
}) => {
  const isFiltered =
    Boolean(filters.search) ||
    filters.status !== 'all' ||
    filters.ownerId !== 'all' ||
    filters.month !== 'all'

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      ownerId: 'all',
      month: 'all'
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-xl border border-border/80 shadow-2xs mb-5">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by client, legal entity, or tags..."
            value={filters.search || ''}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-8 h-8 text-xs bg-background"
          />
        </div>

        {/* Status Filter */}
        <div className="w-[140px]">
          <Select
            value={filters.status || 'all'}
            onValueChange={val =>
              setFilters(prev => ({ ...prev, status: val as ClientFilters['status'] }))
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active Retainer</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Owner Filter */}
        <div className="w-[150px]">
          <Select
            value={filters.ownerId || 'all'}
            onValueChange={val => setFilters(prev => ({ ...prev, ownerId: val }))}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All PR Leads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All PR Leads</SelectItem>
              {agencyOwners.map(o => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Filter */}
        <div className="w-[130px]">
          <Select
            value={filters.month || 'all'}
            onValueChange={val => setFilters(prev => ({ ...prev, month: val }))}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Joined Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="2026-09">Sep 2026</SelectItem>
              <SelectItem value="2026-08">Aug 2026</SelectItem>
              <SelectItem value="2026-07">Jul 2026</SelectItem>
              <SelectItem value="2026-03">Mar 2026</SelectItem>
              <SelectItem value="2026-02">Feb 2026</SelectItem>
              <SelectItem value="2025">2025 Cohort</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground self-end sm:self-auto shrink-0 font-mono">
        Showing {filteredCount} of {totalCount} clients
      </div>
    </div>
  )
}
