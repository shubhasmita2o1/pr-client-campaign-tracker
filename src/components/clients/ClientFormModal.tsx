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
import { agencyOwners } from '@/data/mockClients'
import { useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

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
  retainerMonthly: z.coerce.number().min(1000, 'Monthly retainer must be at least $1,000'),
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
  const createClientMutation = useCreateClient()
  const updateClientMutation = useUpdateClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormSchemaType>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      company: '',
      status: 'active',
      industry: 'Enterprise AI & Tech',
      tier: 'Growth',
      ownerId: agencyOwners[0].id,
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
        ownerId: clientToEdit.owner.id,
        primaryContactName: clientToEdit.primaryContact.name,
        primaryContactEmail: clientToEdit.primaryContact.email,
        primaryContactTitle: clientToEdit.primaryContact.title,
        retainerMonthly: clientToEdit.retainerMonthly,
        website: clientToEdit.website,
        tagsString: clientToEdit.tags.join(', '),
        notes: clientToEdit.notes || ''
      })
    } else {
      reset({
        name: '',
        company: '',
        status: 'active',
        industry: 'Enterprise AI & Tech',
        tier: 'Growth',
        ownerId: agencyOwners[0].id,
        primaryContactName: '',
        primaryContactEmail: '',
        primaryContactTitle: 'VP of Communications',
        retainerMonthly: 20000,
        website: 'https://',
        tagsString: 'Tech, B2B, Launch',
        notes: ''
      })
    }
  }, [clientToEdit, reset, open])

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
        const owner = agencyOwners.find(o => o.id === values.ownerId) || agencyOwners[0]
        await updateClientMutation.mutateAsync({
          id: clientToEdit.id,
          data: {
            ...payload,
            owner,
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
        toast.success(`New client "${values.name}" onboarded!`)
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        })
      }

      onOpenChange(false)
    } catch {
      toast.error('Failed to save client details. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{clientToEdit ? 'Edit Client Profile' : 'Onboard New PR Client'}</DialogTitle>
          <DialogDescription>
            {clientToEdit
              ? 'Update client information, retainer level, and communication ownership.'
              : 'Add a new client to the PR agency tracker and configure their service agreement.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Brand Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Client Brand Name *</label>
              <Input
                placeholder="e.g. NovaAI Systems"
                {...register('name')}
              />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
            </div>

            {/* Legal Entity */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Company Legal Name *</label>
              <Input
                placeholder="e.g. NovaAI Systems Inc."
                {...register('company')}
              />
              {errors.company && <p className="text-[11px] text-destructive">{errors.company.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Status *</label>
              <Select
                value={watch('status')}
                onValueChange={(val: 'active' | 'prospect' | 'churned') => setValue('status', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Retainer</SelectItem>
                  <SelectItem value="prospect">Pipeline Prospect</SelectItem>
                  <SelectItem value="churned">Churned / Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Account Tier *</label>
              <Select
                value={watch('tier')}
                onValueChange={(val: 'Enterprise' | 'Growth' | 'Boutique') => setValue('tier', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Boutique">Boutique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Retainer */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Monthly Retainer ($) *</label>
              <Input
                type="number"
                placeholder="20000"
                {...register('retainerMonthly')}
              />
              {errors.retainerMonthly && (
                <p className="text-[11px] text-destructive">{errors.retainerMonthly.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Industry */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Industry / Practice Area *</label>
              <Input
                placeholder="e.g. Enterprise AI, CleanTech, BioTech"
                {...register('industry')}
              />
              {errors.industry && <p className="text-[11px] text-destructive">{errors.industry.message}</p>}
            </div>

            {/* Agency Owner */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Agency PR Lead *</label>
              <Select
                value={watch('ownerId')}
                onValueChange={(val: string) => setValue('ownerId', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead" />
                </SelectTrigger>
                <SelectContent>
                  {agencyOwners.map(o => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name} ({o.role})
                    </SelectItem>
                  ))}
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
                <Input placeholder="Dr. Sarah Lin" {...register('primaryContactName')} />
                {errors.primaryContactName && (
                  <p className="text-[11px] text-destructive">{errors.primaryContactName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Email *</label>
                <Input placeholder="slin@novaai.tech" {...register('primaryContactEmail')} />
                {errors.primaryContactEmail && (
                  <p className="text-[11px] text-destructive">{errors.primaryContactEmail.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Title *</label>
                <Input placeholder="Chief Marketing Officer" {...register('primaryContactTitle')} />
                {errors.primaryContactTitle && (
                  <p className="text-[11px] text-destructive">{errors.primaryContactTitle.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Website URL *</label>
              <Input placeholder="https://novaai.tech" {...register('website')} />
              {errors.website && <p className="text-[11px] text-destructive">{errors.website.message}</p>}
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Tags (comma separated)</label>
              <Input placeholder="GenAI, Series B, Tier-1 Media" {...register('tagsString')} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Strategic PR Goals &amp; Internal Notes</label>
            <Textarea
              placeholder="Key upcoming embargo dates, target reporters, target publications..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : clientToEdit ? 'Update Client' : 'Onboard Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
