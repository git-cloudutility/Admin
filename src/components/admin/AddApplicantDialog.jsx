import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = "https://backend-xeg0.onrender.com";

export function AddApplicantDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    internshipMode: '',
    college: '',
    specialization: '',
    passoutYear: '',
    qualification: '',
    programmingLanguages: '',
    preferredDomain: '',
    experience: '',
    duration: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.branch) {
      toast.error('Please fill in all required fields (Name, Email, Phone, Branch)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/internship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Applicant added successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          branch: '',
          internshipMode: '',
          college: '',
          specialization: '',
          passoutYear: '',
          qualification: '',
          programmingLanguages: '',
          preferredDomain: '',
          experience: '',
          duration: '',
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(data.error || 'Failed to add applicant');
      }
    } catch (error) {
      console.error('Add applicant error:', error);
      toast.error('Failed to add applicant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent
  className="max-w-2xl overflow-y-auto"
  style={{ maxHeight: "90vh" }}
>

        <DialogHeader>
          <DialogTitle>Add New Applicant</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new internship applicant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <Input
                id="branch"
                placeholder="e.g., Computer Science"
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                required
              />
            </div>

            {/* College */}
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                placeholder="Enter college name"
                value={formData.college}
                onChange={(e) => handleChange('college', e.target.value)}
              />
            </div>

            {/* Qualification */}
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Select
                value={formData.qualification}
                onValueChange={(value) => handleChange('qualification', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btech">B.Tech</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                  <SelectItem value="bca">BCA</SelectItem>
                  <SelectItem value="mca">MCA</SelectItem>
                  <SelectItem value="bsc">B.Sc</SelectItem>
                  <SelectItem value="msc">M.Sc</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Passout Year */}
            <div className="space-y-2">
              <Label htmlFor="passoutYear">Passout Year</Label>
              <Select
                value={formData.passoutYear}
                onValueChange={(value) => handleChange('passoutYear', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode of Internship */}
            <div className="space-y-2">
              <Label htmlFor="internshipMode">Mode of Internship</Label>
              <Select
                value={formData.internshipMode}
                onValueChange={(value) => handleChange('internshipMode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => handleChange('experience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="3years">3+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleChange('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="2months">2 Months</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialization */}
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g., Salesforce, Data Science"
                value={formData.specialization}
                onChange={(e) => handleChange('specialization', e.target.value)}
              />
            </div>

            {/* Preferred Domain */}
            <div className="space-y-2">
              <Label htmlFor="preferredDomain">Preferred Domain</Label>
              <Input
                id="preferredDomain"
                placeholder="e.g., Web Development"
                value={formData.preferredDomain}
                onChange={(e) => handleChange('preferredDomain', e.target.value)}
              />
            </div>

            {/* Programming Languages */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="programmingLanguages">Programming Languages</Label>
              <Input
                id="programmingLanguages"
                placeholder="e.g., Python, JavaScript, Java"
                value={formData.programmingLanguages}
                onChange={(e) => handleChange('programmingLanguages', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Applicant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
