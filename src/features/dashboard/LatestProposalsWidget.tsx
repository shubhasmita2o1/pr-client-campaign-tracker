import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, ArrowRight } from 'lucide-react'
import { useClients } from '@/hooks/useClients'
import { clientService } from '@/services/clientService'
import { toast } from 'sonner'

export const LatestProposalsWidget: React.FC = () => {
  const { data: clients, isLoading } = useClients()

  // Aggregate proposals from live clients
  const allProposals = (clients || [])
    .flatMap((c) =>
      (c.proposalDocs || []).map((doc) => ({
        ...doc,
        clientId: c.id,
        clientName: c.name,
        company: c.company
      }))
    )
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5)

  const handleDownload = async (e: React.MouseEvent, filePath?: string, docName?: string) => {
    e.stopPropagation()
    if (!filePath) {
      toast.info(`Proposal: ${docName || 'Document'}`)
      return
    }

    try {
      toast.info(`Preparing secure link for ${docName || 'proposal'}...`)
      const url = await clientService.getProposalSignedUrl(filePath)
      if (url && url !== '#') {
        window.open(url, '_blank')
      } else {
        toast.info(`Document path: ${filePath}`)
      }
    } catch {
      toast.error('Could not download proposal.')
    }
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <FileText className="h-4 w-4 text-sky-500" />
            Latest Proposals &amp; Contracts
          </CardTitle>
          <p className="text-xs text-slate-500">
            PDF documents stored in Supabase &ldquo;proposals&rdquo; bucket
          </p>
        </div>
        <Button
          variant="ghost"
          size="xs"
          asChild
          className="text-xs gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400"
        >
          <Link to="/clients">
            <span>All Clients</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Loading proposals...
          </div>
        ) : allProposals.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 border border-dashed rounded-lg">
            No proposal documents found. Attach a PDF to any client record.
          </div>
        ) : (
          allProposals.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-sky-300 dark:hover:border-sky-800 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {doc.clientName}
                    </span>
                    <span>&bull;</span>
                    <span>{doc.fileSize}</span>
                    <span>&bull;</span>
                    <span className="capitalize">{doc.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className={`text-[10px] capitalize px-2 py-0.5 ${
                    doc.status === 'signed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                      : doc.status === 'review'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {doc.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDownload(e, doc.filePath || doc.url, doc.name)}
                  className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Download PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
