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
import { MoreHorizontal, ExternalLink, Edit3, Trash2, ArrowUpDown } from 'lucide-react'

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
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[280px]">Client / Account</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Retainer (MRR)</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>PR Lead</TableHead>
            <TableHead>Spokesperson Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map(client => (
            <TableRow
              key={client.id}
              className="cursor-pointer group hover:bg-muted/40 transition-colors"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              {/* Client Info */}
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted/60 flex items-center justify-center">
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-xs">
                        {client.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {client.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
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
                <div className="font-semibold text-sm">
                  {formatCurrency(client.retainerMonthly)}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </div>
              </TableCell>

              {/* Tier */}
              <TableCell>
                <Badge variant="outline" className="text-xs font-medium">
                  {client.tier}
                </Badge>
              </TableCell>

              {/* Owner */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={client.owner.avatar} />
                    <AvatarFallback className="text-[10px]">
                      {client.owner.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-foreground font-medium">
                    {client.owner.name}
                  </span>
                </div>
              </TableCell>

              {/* Primary Contact */}
              <TableCell>
                <div className="flex flex-col text-xs">
                  <span className="font-medium text-foreground">
                    {client.primaryContact.name}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
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
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Client Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                      <ExternalLink className="mr-2 h-3.5 w-3.5" /> View Full Dossier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditClient(client)}>
                      <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit Profile &amp; Scope
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteClient(client)}
                      className="text-destructive focus:text-destructive"
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
