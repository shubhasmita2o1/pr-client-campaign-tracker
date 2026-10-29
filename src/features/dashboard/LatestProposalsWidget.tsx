import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
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
    <Card className="border-border/80 shadow-subtle overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60 bg-card/60">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Active Client Proposals &amp; Retainer Agreements
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Encrypted PDF documents stored in Supabase &ldquo;proposals&rdquo; vault
          </p>
        </div>
        <Button
          variant="ghost"
          size="xs"
          asChild
          className="text-xs gap-1 text-primary hover:text-primary/80 font-medium"
        >
          <Link to="/clients">
            <span>All Retainers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2.5 p-4 sm:p-5 pt-4">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Loading proposals...
          </div>
        ) : allProposals.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border/70 rounded-xl">
            No proposal documents found. Attach a PDF to any client record.
          </div>
        ) : (
          allProposals.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:border-primary/40 bg-card hover:bg-secondary/40 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {doc.name}
                    </span>
                    <Badge
                      variant={doc.status === 'signed' ? 'sage' : doc.status === 'review' ? 'sand' : 'secondary'}
                      className="text-[10px] px-1.5 py-0 h-4 capitalize"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Client: {doc.clientName} &bull; {doc.fileSize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handleDownload(e, doc.filePath, doc.name)}
                  className="h-7 text-[11px] gap-1 rounded-lg border-border/70 hover:bg-secondary"
                  title="Download / View PDF"
                >
                  <Download className="h-3 w-3 text-muted-foreground" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
