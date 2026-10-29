import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ClientStatusBadge } from '@/components/shared/StatusBadge'
import { Client } from '@/types/client'
import { formatCurrency } from '@/lib/utils'
import { MoreHorizontal, ExternalLink, Edit3, Trash2 } from 'lucide-react'

interface ClientTableProps {
  clients: Client[]
  onEditClient: (client: Client) => void
  onDeleteClient: (client: Client) => void
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onEditClient,
  onDeleteClient
}) => {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-subtle">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow className="hover:bg-transparent border-b border-border/70">
            <TableHead className="w-[280px] font-bold text-foreground text-xs">Client / Legal Account</TableHead>
            <TableHead className="font-bold text-foreground text-xs">Status</TableHead>
            <TableHead className="font-bold text-foreground text-xs">Retainer (MRR)</TableHead>
            <TableHead className="font-bold text-foreground text-xs">Tier</TableHead>
            <TableHead className="font-bold text-foreground text-xs">PR Lead</TableHead>
            <TableHead className="font-bold text-foreground text-xs">Spokesperson Contact</TableHead>
            <TableHead className="text-right font-bold text-foreground text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map(client => (
            <TableRow
              key={client.id}
              className="cursor-pointer group hover:bg-secondary/40 transition-colors border-b border-border/50"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              {/* Client Info */}
              <TableCell className="font-medium py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl overflow-hidden shrink-0 border border-border/80 bg-secondary/80 flex items-center justify-center font-bold text-xs text-primary shadow-2xs">
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{client.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {client.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {client.industry}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <ClientStatusBadge status={client.status} />
              </TableCell>

              {/* Retainer */}
              <TableCell>
                <div className="font-extrabold text-xs sm:text-sm tabular-nums text-foreground">
                  {formatCurrency(client.retainerMonthly)}
                  <span className="text-[11px] font-normal text-muted-foreground"> /mo</span>
                </div>
              </TableCell>

              {/* Tier */}
              <TableCell>
                <Badge
                  variant={client.tier === 'Enterprise' ? 'sage' : 'secondary'}
                  className="text-[11px] font-semibold"
                >
                  {client.tier}
                </Badge>
              </TableCell>

              {/* Owner */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6.5 w-6.5 ring-1 ring-border shrink-0">
                    <AvatarImage src={client.owner.avatar} />
                    <AvatarFallback className="text-[10px]">
                      {client.owner.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-foreground font-medium truncate">
                    {client.owner.name}
                  </span>
                </div>
              </TableCell>

              {/* Primary Contact */}
              <TableCell>
                <div className="flex flex-col text-xs truncate">
                  <span className="font-semibold text-foreground truncate">
                    {client.primaryContact.name}
                  </span>
                  <span className="text-muted-foreground text-[11px] truncate">
                    {client.primaryContact.title}
                  </span>
                </div>
              </TableCell>

              {/* Row Actions */}
              <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-premium border-border/80">
                    <DropdownMenuLabel className="text-xs font-semibold text-foreground">Client Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)} className="text-xs cursor-pointer">
                      <ExternalLink className="mr-2 h-3.5 w-3.5 text-primary" /> View Full Dossier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditClient(client)} className="text-xs cursor-pointer">
                      <Edit3 className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> Edit Profile &amp; Scope
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteClient(client)}
                      className="text-xs text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Archive Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
