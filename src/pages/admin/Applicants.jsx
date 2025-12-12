import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable } from '@/components/admin/DataTable';
import { AddApplicantDialog } from '@/components/admin/AddApplicantDialog';
import { apiService } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MoreHorizontal, Eye, CheckCircle, XCircle, Calendar, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  approved: 'bg-success/20 text-success border-success/30',
  rejected: 'bg-destructive/20 text-destructive border-destructive/30',
  interview: 'bg-primary/20 text-primary border-primary/30',
};

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const data = await apiService.getApplicants();
      setApplicants(data);
    } catch (error) {
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await apiService.updateApplicantStatus(id, status);
      setApplicants(applicants.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteApplicant(id);
      setApplicants(applicants.filter(a => a.id !== id));
      toast.success('Applicant deleted');
    } catch (error) {
      toast.error('Failed to delete applicant');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'specialization',
      header: 'Specialization',
      sortable: true,
    },
    {
      key: 'college',
      header: 'College',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium truncate max-w-[200px]">{item.college}</p>
          <p className="text-xs text-muted-foreground">{item.branch}</p>
        </div>
      ),
    },
    {
      key: 'qualification',
      header: 'Qualification',
      render: (item) => (
        <div>
          <p className="font-medium">{item.qualification}</p>
          <p className="text-xs text-muted-foreground">Passout: {item.passoutYear}</p>
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground">{new Date(item.submittedAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant="outline" className={statusColors[item.status]}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setSelectedApplicant(item); setViewDialogOpen(true); }}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'approved')}>
              <CheckCircle className="w-4 h-4 mr-2 text-success" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'interview')}>
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              Schedule Interview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'rejected')}>
              <XCircle className="w-4 h-4 mr-2 text-destructive" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Applicants" subtitle="Manage internship applications" />

      <div className="p-6">
        <DataTable
          data={applicants}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search applicants..."
          filterKey="status"
          filterOptions={[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'interview', label: 'Interview' },
          ]}
          actionButton={
            <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add Applicant
            </Button>
          }
        />
      </div>

      {/* Add Applicant Dialog */}
      <AddApplicantDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchApplicants}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>Full information about the applicant</DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                  {selectedApplicant.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedApplicant.name}</h3>
                  <p className="text-muted-foreground">{selectedApplicant.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedApplicant.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Specialization</p>
                  <p className="font-medium">{selectedApplicant.specialization}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">College</p>
                  <p className="font-medium">{selectedApplicant.college}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Branch</p>
                  <p className="font-medium">{selectedApplicant.branch}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Qualification</p>
                  <p className="font-medium">{selectedApplicant.qualification}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Passout Year</p>
                  <p className="font-medium">{selectedApplicant.passoutYear}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">{selectedApplicant.experience}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedApplicant.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mode of Internship</p>
                  <p className="font-medium">{selectedApplicant.modeOfInternship || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted On</p>
                  <p className="font-medium">{new Date(selectedApplicant.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Programming Languages</p>
                  <p className="font-medium">{selectedApplicant.programmingLanguages}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusColors[selectedApplicant.status]}>
                    {selectedApplicant.status}
                  </Badge>
                </div>
              </div>

              {(selectedApplicant.linkedIn || selectedApplicant.portfolio) && (
                <div className="pt-4 border-t border-border space-y-2">
                  {selectedApplicant.linkedIn && (
                    <a href={`https://${selectedApplicant.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
                      LinkedIn Profile
                    </a>
                  )}
                  {selectedApplicant.portfolio && (
                    <a href={`https://${selectedApplicant.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
                      Portfolio
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applicants;
