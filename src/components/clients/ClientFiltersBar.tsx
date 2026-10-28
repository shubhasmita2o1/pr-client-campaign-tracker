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
import { useSettings } from '@/hooks/useSettings'
import { Search, RotateCcw, Download } from 'lucide-react'

interface ClientFiltersBarProps {
  filters: ClientFilters
  setFilters: React.Dispatch<React.SetStateAction<ClientFilters>>
  totalCount: number
  filteredCount: number
  onExportCSV?: () => void
}

export const ClientFiltersBar: React.FC<ClientFiltersBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onExportCSV
}) => {
  const { teamMembers } = useSettings()

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs mb-5">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search by client, legal entity, or tags..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Status Filter */}
        <div className="w-[140px]">
          <Select
            value={filters.status || 'all'}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, status: val as ClientFilters['status'] }))
            }
          >
            <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
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
            onValueChange={(val) => setFilters((prev) => ({ ...prev, ownerId: val }))}
          >
            <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="All PR Leads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All PR Leads</SelectItem>
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.fullName}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="lead-1">Elena Rostova</SelectItem>
                  <SelectItem value="lead-2">Priya Sharma</SelectItem>
                  <SelectItem value="lead-3">Marcus Vance</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Month Filter */}
        <div className="w-[130px]">
          <Select
            value={filters.month || 'all'}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, month: val }))}
          >
            <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
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
            className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Right counts & Export Action */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filteredCount}</strong> of{' '}
          {totalCount} clients
        </span>

        {onExportCSV && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            className="h-8 text-xs gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Export CSV</span>
          </Button>
        )}
      </div>
    </div>
  )
}
