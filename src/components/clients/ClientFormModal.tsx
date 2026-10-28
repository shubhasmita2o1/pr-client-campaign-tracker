import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Client, ClientFormData } from '@/types/client'
import { useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { useSettings } from '@/hooks/useSettings'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

const DEFAULT_OWNER_ID = '00000000-0000-0000-0000-000000000001'

const clientSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  company: z.string().min(2, 'Company legal name is required'),
  status: z.enum(['active', 'prospect', 'churned']),
  industry: z.string().min(2, 'Industry is required'),
  tier: z.enum(['Enterprise', 'Growth', 'Boutique']),
  ownerId: z.string().min(1, 'Please select a PR lead'),
  primaryContactName: z.string().min(2, 'Contact name is required'),
  primaryContactEmail: z.string().email('Valid email address is required'),
  primaryContactTitle: z.string().min(2, 'Contact title is required'),
  retainerMonthly: z.coerce.number().min(0, 'Monthly retainer must be positive'),
  website: z.string().url('Must be a valid URL with https://'),
  tagsString: z.string().optional(),
  notes: z.string().optional()
})

type ClientFormSchemaType = z.infer<typeof clientSchema>

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientToEdit?: Client | null
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  open,
  onOpenChange,
  clientToEdit
}) => {
  const { teamMembers } = useSettings()
  const createClientMutation = useCreateClient()
  const updateClientMutation = useUpdateClient()

  const defaultOwner = teamMembers[0]?.id || DEFAULT_OWNER_ID

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(clientSchema) as any,
    defaultValues: {
      name: '',
      company: '',
      status: 'active',
      industry: 'Enterprise AI & Tech',
      tier: 'Growth',
      ownerId: defaultOwner,
      primaryContactName: '',
      primaryContactEmail: '',
      primaryContactTitle: 'VP of Communications',
      retainerMonthly: 20000,
      website: 'https://',
      tagsString: 'Tech, B2B, Launch',
      notes: ''
    }
  })

  useEffect(() => {
    if (clientToEdit) {
      reset({
        name: clientToEdit.name,
        company: clientToEdit.company,
        status: clientToEdit.status,
        industry: clientToEdit.industry,
        tier: clientToEdit.tier,
        ownerId: clientToEdit.owner?.id || defaultOwner,
        primaryContactName: clientToEdit.primaryContact?.name || '',
        primaryContactEmail: clientToEdit.primaryContact?.email || '',
        primaryContactTitle: clientToEdit.primaryContact?.title || '',
        retainerMonthly: clientToEdit.retainerMonthly || 0,
        website: clientToEdit.website || 'https://',
        tagsString: (clientToEdit.tags || []).join(', '),
        notes: clientToEdit.notes || ''
      })
    } else {
      reset({
        name: '',
        company: '',
        status: 'active',
        industry: 'Enterprise AI & Tech',
        tier: 'Growth',
        ownerId: defaultOwner,
        primaryContactName: '',
        primaryContactEmail: '',
        primaryContactTitle: 'VP of Communications',
        retainerMonthly: 20000,
        website: 'https://',
        tagsString: 'Tech, B2B, Launch',
        notes: ''
      })
    }
  }, [clientToEdit, reset, open, defaultOwner])

  const onSubmit = async (values: ClientFormSchemaType) => {
    try {
      const tags = values.tagsString
        ? values.tagsString.split(',').map(t => t.trim()).filter(Boolean)
        : ['PR']

      const payload: ClientFormData = {
        name: values.name,
        company: values.company,
        status: values.status,
        industry: values.industry,
        tier: values.tier,
        ownerId: values.ownerId,
        primaryContactName: values.primaryContactName,
        primaryContactEmail: values.primaryContactEmail,
        primaryContactTitle: values.primaryContactTitle,
        retainerMonthly: values.retainerMonthly,
        website: values.website,
        tags,
        notes: values.notes
      }

      if (clientToEdit) {
        const ownerObj = teamMembers.find(o => o.id === values.ownerId)
        await updateClientMutation.mutateAsync({
          id: clientToEdit.id,
          data: {
            ...payload,
            owner: ownerObj
              ? {
                  id: ownerObj.id,
                  name: ownerObj.fullName,
                  email: ownerObj.email,
                  avatar: ownerObj.avatarUrl,
                  role: ownerObj.role === 'admin' ? 'Agency Lead' : 'PR Specialist'
                }
              : clientToEdit.owner,
            primaryContact: {
              name: payload.primaryContactName,
              email: payload.primaryContactEmail,
              title: payload.primaryContactTitle
            }
          }
        })
        toast.success(`Client "${values.name}" updated successfully`)
      } else {
        await createClientMutation.mutateAsync(payload)
        toast.success(`New client "${values.name}" onboarded to agency database!`)
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } })
        } catch {
          // Ignore
        }
      }

      onOpenChange(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save client details.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{clientToEdit ? 'Edit Client Record' : 'Onboard New Agency Client'}</DialogTitle>
          <DialogDescription>
            {clientToEdit
              ? 'Update account metrics, assigned PR lead, and communication details.'
              : 'Add an enterprise or growth tier client to start tracking meetings, press campaigns, and media ROI.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Row 1: Name and Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Brand / Display Name *</label>
              <Input placeholder="e.g. Acme Tech" {...register('name')} />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Legal Entity / Company Name *</label>
              <Input placeholder="e.g. Acme Technologies Inc." {...register('company')} />
              {errors.company && (
                <p className="text-[11px] text-destructive">{errors.company.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Status, Tier, and Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Account Status *</label>
              <Select
                value={watch('status')}
                onValueChange={(val: 'active' | 'prospect' | 'churned') => setValue('status', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Retainer</SelectItem>
                  <SelectItem value="prospect">Prospect / In Talks</SelectItem>
                  <SelectItem value="churned">Churned / Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Account Tier *</label>
              <Select
                value={watch('tier')}
                onValueChange={(val: 'Enterprise' | 'Growth' | 'Boutique') => setValue('tier', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enterprise">Enterprise ($40k+/mo)</SelectItem>
                  <SelectItem value="Growth">Growth ($15k-$40k/mo)</SelectItem>
                  <SelectItem value="Boutique">Boutique (&lt;$15k/mo)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Industry Vertical *</label>
              <Input placeholder="e.g. Fintech, AI SaaS" {...register('industry')} />
              {errors.industry && (
                <p className="text-[11px] text-destructive">{errors.industry.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Retainer, Website, Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Monthly Retainer (USD) *</label>
              <Input
                type="number"
                placeholder="25000"
                {...register('retainerMonthly')}
              />
              {errors.retainerMonthly && (
                <p className="text-[11px] text-destructive">{errors.retainerMonthly.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Website URL *</label>
              <Input placeholder="https://acme.com" {...register('website')} />
              {errors.website && (
                <p className="text-[11px] text-destructive">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Agency PR Lead *</label>
              <Select
                value={watch('ownerId')}
                onValueChange={(val: string) => setValue('ownerId', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers && teamMembers.length > 0 ? (
                    teamMembers.map(o => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.fullName} ({o.role})
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value={DEFAULT_OWNER_ID}>Elena Rostova (Admin)</SelectItem>
                      <SelectItem value="00000000-0000-0000-0000-000000000002">Priya Sharma (PR Lead)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Primary Contact Section */}
          <div className="rounded-lg border border-border/80 p-3.5 bg-muted/20 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Primary Client Spokesperson / Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Full Name *</label>
                <Input placeholder="Jane Doe" {...register('primaryContactName')} />
                {errors.primaryContactName && (
                  <p className="text-[11px] text-destructive">
                    {errors.primaryContactName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Work Email *</label>
                <Input
                  type="email"
                  placeholder="jane@acme.com"
                  {...register('primaryContactEmail')}
                />
                {errors.primaryContactEmail && (
                  <p className="text-[11px] text-destructive">
                    {errors.primaryContactEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Title / Role *</label>
                <Input placeholder="CMO / VP Comms" {...register('primaryContactTitle')} />
                {errors.primaryContactTitle && (
                  <p className="text-[11px] text-destructive">
                    {errors.primaryContactTitle.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Industry Tags (comma separated)
            </label>
            <Input placeholder="AI, Enterprise, Series B, IPO Track" {...register('tagsString')} />
          </div>

          {/* Strategic Notes */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Strategic PR Account Notes</label>
            <Textarea
              rows={3}
              placeholder="Key spokesperson preferences, embargo rules, approved soundbites, competitor guardrails..."
              {...register('notes')}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : clientToEdit
                ? 'Save Changes'
                : 'Create Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
