import React from 'react'
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
import { MeetingType } from '@/types/meeting'
import { useClients } from '@/hooks/useClients'
import { useCreateMeeting } from '@/hooks/useMeetings'
import { toast } from 'sonner'

const meetingSchema = z.object({
  clientId: z.string().min(1, 'Please select a client'),
  title: z.string().min(3, 'Meeting title is required'),
  date: z.string().min(1, 'Date & time is required'),
  durationMinutes: z.coerce.number().min(15, 'Minimum 15 mins').max(240),
  type: z.enum([
    'Weekly Sync',
    'Strategy & Launch',
    'Media Training',
    'Crisis Advisory',
    'Executive Onboarding',
    'Quarterly Review'
  ]),
  location: z.string().min(2, 'Platform/location is required'),
  notes: z.string().optional(),
  agendaString: z.string().optional()
})

type MeetingFormSchemaType = z.infer<typeof meetingSchema>

interface MeetingFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultClientId?: string
}

export const MeetingFormModal: React.FC<MeetingFormModalProps> = ({
  open,
  onOpenChange,
  defaultClientId
}) => {
  const { data: clients = [] } = useClients()
  const createMeetingMutation = useCreateMeeting()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<MeetingFormSchemaType>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      clientId: defaultClientId || '',
      title: '',
      date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      durationMinutes: 45,
      type: 'Strategy & Launch',
      location: 'Google Meet',
      notes: '',
      agendaString: 'Embargo strategy, Media pitch angles, Q&A'
    }
  })

  React.useEffect(() => {
    if (defaultClientId) {
      setValue('clientId', defaultClientId)
    }
  }, [defaultClientId, setValue])

  const onSubmit = async (values: MeetingFormSchemaType) => {
    try {
      const selectedClient = clients.find(c => c.id === values.clientId)
      const clientName = selectedClient ? selectedClient.name : 'Client'

      const agenda = values.agendaString
        ? values.agendaString.split(',').map(a => a.trim()).filter(Boolean)
        : []

      await createMeetingMutation.mutateAsync({
        clientId: values.clientId,
        clientName,
        title: values.title,
        date: new Date(values.date).toISOString(),
        durationMinutes: values.durationMinutes,
        type: values.type as MeetingType,
        location: values.location,
        notes: values.notes || '',
        agenda,
        transcriptStatus: 'none',
        attendees: [
          {
            id: 'att-user',
            name: 'Elena Rostova',
            email: 'elena@prestige-pr.com',
            role: 'Lead PR Partner'
          },
          ...(selectedClient
            ? [
                {
                  id: `att-client-${selectedClient.id}`,
                  name: selectedClient.primaryContact.name,
                  email: selectedClient.primaryContact.email,
                  role: selectedClient.primaryContact.title,
                  isClient: true
                }
              ]
            : [])
        ]
      })

      toast.success(`Meeting "${values.title}" scheduled for ${clientName}!`)
      reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to schedule meeting.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Client Meeting</DialogTitle>
          <DialogDescription>
            Schedule a strategy sync, media training, or crisis session and link it to the client dossier.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 py-2">
          {/* Client Select */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Client *</label>
            <Select
              value={watch('clientId')}
              onValueChange={val => setValue('clientId', val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.industry})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-[11px] text-destructive">{errors.clientId.message}</p>
            )}
          </div>

          {/* Meeting Title */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Meeting Title *</label>
            <Input placeholder="e.g. Q4 Media Tour Pitch Prep" {...register('title')} />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Date Time */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Date &amp; Time *</label>
              <Input type="datetime-local" {...register('date')} className="text-xs" />
              {errors.date && (
                <p className="text-[11px] text-destructive">{errors.date.message}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Duration (minutes) *</label>
              <Input type="number" {...register('durationMinutes')} />
              {errors.durationMinutes && (
                <p className="text-[11px] text-destructive">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Meeting Type *</label>
              <Select
                value={watch('type')}
                onValueChange={(val: MeetingType) => setValue('type', val)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly Sync">Weekly Sync</SelectItem>
                  <SelectItem value="Strategy & Launch">Strategy &amp; Launch</SelectItem>
                  <SelectItem value="Media Training">Media Training</SelectItem>
                  <SelectItem value="Crisis Advisory">Crisis Advisory</SelectItem>
                  <SelectItem value="Executive Onboarding">Executive Onboarding</SelectItem>
                  <SelectItem value="Quarterly Review">Quarterly Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Location / Platform *</label>
              <Input placeholder="Google Meet, Zoom, NYC" {...register('location')} />
              {errors.location && (
                <p className="text-[11px] text-destructive">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Agenda */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Agenda Topics (comma separated)</label>
            <Input
              placeholder="Exclusive angles, Spokesperson prep, Timeline review"
              {...register('agendaString')}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Preparation Notes</label>
            <Textarea
              placeholder="Background briefing, reporter questions to anticipate..."
              rows={2}
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
              {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
