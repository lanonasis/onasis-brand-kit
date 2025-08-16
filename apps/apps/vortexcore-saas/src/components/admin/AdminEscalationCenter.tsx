/**
 * Admin Escalation Center - Issue tracking and resolution
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Clock, 
  User, 
  MessageSquare,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService, EscalationTicket } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

export const AdminEscalationCenter = () => {
  const [tickets, setTickets] = useState<EscalationTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const escalations = await adminService.getEscalationTickets();
      setTickets(escalations);
    } catch (error) {
      console.error('Failed to load escalation tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load escalation tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "from-blue-600 to-cyan-600",
      medium: "from-yellow-600 to-orange-600", 
      high: "from-orange-600 to-red-600",
      critical: "from-red-600 to-pink-600"
    };
    return colors[severity as keyof typeof colors] || "from-gray-600 to-gray-700";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-100';
      case 'investigating': return 'bg-yellow-500/20 text-yellow-100';
      case 'resolved': return 'bg-green-500/20 text-green-100';
      case 'escalated': return 'bg-purple-500/20 text-purple-100';
      default: return 'bg-gray-500/20 text-gray-100';
    }
  };

  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filter);

  const getTicketStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const investigating = tickets.filter(t => t.status === 'investigating').length;
    const critical = tickets.filter(t => t.severity === 'critical').length;
    
    return { total, open, investigating, critical };
  };

  const stats = getTicketStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">Escalation Center</h3>
        <p className="text-muted-foreground">
          Monitor and manage payment gateway issues and escalations
        </p>
      </div>

      {/* Stats Overview */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Escalation Overview</h3>
                <p className="text-sm text-muted-foreground">Current issue status and metrics</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Escalation
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Issues</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Investigating</p>
                <p className="text-2xl font-bold">{stats.investigating}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Critical</p>
                <p className="text-2xl font-bold">{stats.critical}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Filter:</span>
        {['all', 'open', 'investigating', 'resolved'].map(status => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status as any)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Critical Alerts */}
      {tickets.some(t => t.severity === 'critical' && t.status !== 'resolved') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Issues Detected</AlertTitle>
          <AlertDescription>
            {tickets.filter(t => t.severity === 'critical' && t.status !== 'resolved').length} critical issues require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-8 text-center">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No Issues Found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all' ? 'No escalation tickets exist yet' : `No ${filter} tickets found`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              <Card 
                key={ticket.id}
                className={cn(
                  "group relative overflow-hidden border-0 bg-gradient-to-br hover:shadow-xl transition-all duration-500 hover:scale-[1.01]",
                  getSeverityColor(ticket.severity)
                )}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10 dark:bg-white/5" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-lg" />
                
                <CardContent className="relative p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        {getSeverityIcon(ticket.severity)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white/90">{ticket.issue}</h3>
                        <p className="text-xs text-white/60">
                          {ticket.gateway.toUpperCase()} • {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-white border-0 backdrop-blur-sm capitalize",
                          getStatusColor(ticket.status)
                        )}
                      >
                        {ticket.status}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="bg-white/20 text-white border-0 backdrop-blur-sm uppercase"
                      >
                        {ticket.severity}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <User className="h-4 w-4 text-white/80" />
                      <div>
                        <p className="text-xs text-white/60">Assigned To</p>
                        <p className="text-sm font-medium">{ticket.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Clock className="h-4 w-4 text-white/80" />
                      <div>
                        <p className="text-xs text-white/60">Age</p>
                        <p className="text-sm font-medium">
                          {Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60))}h
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <MessageSquare className="h-4 w-4 text-white/80" />
                      <div>
                        <p className="text-xs text-white/60">Notes</p>
                        <p className="text-sm font-medium">{ticket.notes.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Latest Note Preview */}
                  {ticket.notes.length > 0 && (
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm mb-4">
                      <p className="text-xs text-white/60 mb-1">Latest Note:</p>
                      <p className="text-sm text-white/90">{ticket.notes[ticket.notes.length - 1]}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Add Note
                    </Button>
                    {ticket.status !== 'resolved' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-green-500/30 hover:bg-green-500/40 text-white border-0 backdrop-blur-sm"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>

                  {/* Severity Indicator */}
                  <div className="absolute top-4 left-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      ticket.severity === 'critical' ? 'bg-red-400' :
                      ticket.severity === 'high' ? 'bg-orange-400' :
                      ticket.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                    )} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950/20 dark:via-slate-950/20 dark:to-zinc-950/20">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2 justify-start">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Create Critical Issue
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Clock className="h-4 w-4 text-yellow-500" />
              Escalate to Support
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Bulk Update Notes
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Resolve Multiple
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};