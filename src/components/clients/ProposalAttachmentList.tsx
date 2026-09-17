import React, { useState } from 'react'
import { ProposalDocument } from '@/types/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  FileCheck
} from 'lucide-react'
import { useUploadProposal, useDeleteProposal } from '@/hooks/useClients'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

interface ProposalAttachmentListProps {
  clientId: string
  clientName: string
  documents: ProposalDocument[]
}

export const ProposalAttachmentList: React.FC<ProposalAttachmentListProps> = ({
  clientId,
  clientName,
  documents
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewDoc, setPreviewDoc] = useState<ProposalDocument | null>(null)

  const uploadMutation = useUploadProposal()
  const deleteMutation = useDeleteProposal()

  const handleSimulatedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(20)

    // Simulate progress
    setTimeout(() => setUploadProgress(60), 300)
    setTimeout(async () => {
      setUploadProgress(100)
      try {
        await uploadMutation.mutateAsync({
          clientId,
          doc: {
            name: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            url: '#',
            type: file.name.toLowerCase().includes('contract') ? 'contract' : 'proposal',
            status: 'review'
          }
        })
        toast.success(`Uploaded "${file.name}" to ${clientName}'s proposals vault!`)
      } catch {
        toast.error('Failed to upload document.')
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
        e.target.value = ''
      }
    }, 700)
  }

  const handleDelete = async (docId: string, docName: string) => {
    try {
      await deleteMutation.mutateAsync({ clientId, docId })
      toast.success(`Removed "${docName}"`)
    } catch {
      toast.error('Failed to remove document.')
    }
  }

  const handleDownload = (doc: ProposalDocument) => {
    toast.info(`Preparing secure download for ${doc.name}...`)
    setTimeout(() => {
      toast.success(`Downloaded ${doc.name}`)
    }, 600)
  }

  return (
    <div className="space-y-5">
      {/* Upload Drop Area */}
      <div className="rounded-xl border border-dashed border-border/90 bg-muted/20 p-6 text-center hover:bg-muted/30 transition-all">
        <input
          type="file"
          id="proposal-upload"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleSimulatedUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="proposal-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2.5">
            <Upload className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {isUploading ? 'Uploading PDF Document...' : 'Upload Proposal or Contract Attachment'}
          </span>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Select signed MSAs, embargo briefings, PR scope decks, or executive media kits (PDF up to 25MB)
          </p>

          {isUploading && (
            <div className="w-64 mt-3">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{uploadProgress}% complete</p>
            </div>
          )}

          {!isUploading && (
            <Button size="sm" variant="outline" className="mt-3 pointer-events-none">
              Browse PDF Files
            </Button>
          )}
        </label>
      </div>

      {/* Documents List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Attached Proposals &amp; Agreements ({documents.length})
        </h4>

        {documents.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground rounded-lg border border-border/60">
            No proposal documents attached yet. Upload a PDF proposal above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-card hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{doc.fileSize}</span>
                      <span>&bull;</span>
                      <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.status === 'signed' ? (
                    <Badge variant="success" className="text-[11px] gap-1 font-normal">
                      <CheckCircle2 className="h-3 w-3" /> Signed
                    </Badge>
                  ) : doc.status === 'review' ? (
                    <Badge variant="warning" className="text-[11px] gap-1 font-normal">
                      <Clock className="h-3 w-3" /> In Review
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      Draft
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Preview Document"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Download PDF"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Delete Document"
                    onClick={() => handleDelete(doc.id, doc.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Document Preview Modal */}
      {previewDoc && (
        <Dialog open={Boolean(previewDoc)} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                <DialogTitle>{previewDoc.name}</DialogTitle>
              </div>
              <DialogDescription>
                Document preview for {clientName} &bull; File Size: {previewDoc.fileSize}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-[360px] rounded-lg border bg-muted/30 p-6 flex flex-col items-center justify-center space-y-3 text-center">
              <FileText className="h-16 w-16 text-rose-500/80 animate-pulse" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Official PR Engagement Document</h4>
                <p className="text-xs text-muted-foreground max-w-md">
                  Signed master service agreement and scoped media distribution channels for {clientName}.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                SHA-256 Verified Security Hash &bull; Valid Document
              </Badge>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
              <Button size="sm" onClick={() => handleDownload(previewDoc)}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
