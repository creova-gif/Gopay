import { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, Eye, Download, 
  Building2, FileText, User as UserIcon, Camera, Clock,
  AlertCircle, Phone, Mail, MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { User } from '../App';
import { projectId } from '../utils/supabase/info';

interface AdminVerificationProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function AdminVerification({ user, accessToken, onBack }: AdminVerificationProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/admin/merchant-applications`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/admin/approve-merchant`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ applicationId }),
        }
      );

      if (response.ok) {
        alert('Merchant approved successfully!');
        setSelectedApplication(null);
        fetchApplications();
      }
    } catch (error) {
      console.error('Error approving merchant:', error);
      alert('Failed to approve merchant');
    }
  };

  const rejectApplication = async (applicationId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/admin/reject-merchant`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ applicationId, reason: rejectionReason }),
        }
      );

      if (response.ok) {
        alert('Merchant application rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedApplication(null);
        fetchApplications();
      }
    } catch (error) {
      console.error('Error rejecting merchant:', error);
      alert('Failed to reject merchant');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (selectedApplication) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedApplication(null)} className="p-2">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{selectedApplication.businessName}</h1>
              <p className="text-sm text-gray-500">Application Review</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 pb-32 space-y-6">
          {/* Business Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Building2 className="size-5" />
              Business Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Business Name</span>
                <span className="font-semibold">{selectedApplication.businessName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold capitalize">{selectedApplication.businessType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Category</span>
                <span className="font-semibold">{selectedApplication.businessCategory}</span>
              </div>
              <div className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Description</span>
                <span className="font-semibold text-right max-w-xs">{selectedApplication.description}</span>
              </div>
              <div className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <MapPin className="size-4" />
                  Address
                </span>
                <span className="font-semibold text-right max-w-xs">
                  {selectedApplication.address}, {selectedApplication.city}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <Mail className="size-4" />
                  Email
                </span>
                <span className="font-semibold">{selectedApplication.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 flex items-center gap-2">
                  <Phone className="size-4" />
                  Phone
                </span>
                <span className="font-semibold">{selectedApplication.phone}</span>
              </div>
            </div>
          </div>

          {/* Tax & Registration */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="size-5" />
              Tax & Registration
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">TIN Number</span>
                <span className="font-semibold font-mono">{selectedApplication.tinNumber}</span>
              </div>
              {selectedApplication.vrn && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">VRN</span>
                  <span className="font-semibold font-mono">{selectedApplication.vrn}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Owner Name</span>
                <span className="font-semibold">{selectedApplication.ownerName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Owner ID</span>
                <span className="font-semibold font-mono">{selectedApplication.ownerIdNumber}</span>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Uploaded Documents</h2>
            <div className="space-y-3">
              {selectedApplication.documents?.businessLicense && (
                <div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Business License</p>
                      <p className="text-sm text-gray-600">Required document</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selectedApplication.documents.businessLicense}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Eye className="size-5 text-blue-600" />
                    </a>
                    <a
                      href={selectedApplication.documents.businessLicense}
                      download
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Download className="size-5 text-blue-600" />
                    </a>
                  </div>
                </div>
              )}

              {selectedApplication.documents?.tinCertificate && (
                <div className="bg-purple-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FileText className="size-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold">TIN Certificate</p>
                      <p className="text-sm text-gray-600">Required document</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selectedApplication.documents.tinCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Eye className="size-5 text-purple-600" />
                    </a>
                    <a
                      href={selectedApplication.documents.tinCertificate}
                      download
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Download className="size-5 text-purple-600" />
                    </a>
                  </div>
                </div>
              )}

              {selectedApplication.documents?.ownerIdCard && (
                <div className="bg-orange-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <UserIcon className="size-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Owner ID Card</p>
                      <p className="text-sm text-gray-600">Required document</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selectedApplication.documents.ownerIdCard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Eye className="size-5 text-orange-600" />
                    </a>
                    <a
                      href={selectedApplication.documents.ownerIdCard}
                      download
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Download className="size-5 text-orange-600" />
                    </a>
                  </div>
                </div>
              )}

              {selectedApplication.documents?.businessPhoto && (
                <div className="bg-green-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Camera className="size-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Business Photo</p>
                      <p className="text-sm text-gray-600">Storefront image</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selectedApplication.documents.businessPhoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Eye className="size-5 text-green-600" />
                    </a>
                    <a
                      href={selectedApplication.documents.businessPhoto}
                      download
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Download className="size-5 text-green-600" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission Info */}
          <div className="bg-gray-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="size-4" />
              <span>Submitted on {new Date(selectedApplication.submittedAt).toLocaleDateString('en-TZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3 max-w-2xl mx-auto">
            <Button
              onClick={() => setShowRejectModal(true)}
              className="flex-1 bg-red-600 text-white h-14 rounded-full font-bold hover:bg-red-700"
            >
              <XCircle className="size-5 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => approveApplication(selectedApplication.id)}
              className="flex-1 bg-green-600 text-white h-14 rounded-full font-bold hover:bg-green-700"
            >
              <CheckCircle2 className="size-5 mr-2" />
              Approve
            </Button>
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Reject Application</h3>
              <p className="text-gray-600 mb-4">Please provide a reason for rejecting this merchant application:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none mb-4"
                placeholder="e.g., Incomplete documents, Invalid TIN number, etc."
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 h-12 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => rejectApplication(selectedApplication.id)}
                  className="flex-1 bg-red-600 text-white h-12 rounded-full"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Merchant Verification</h1>
            <p className="text-sm text-gray-500">{applications.length} pending applications</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending merchant applications to review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                className="w-full bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                    {app.businessName.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg mb-1">{app.businessName}</h3>
                    <p className="text-sm text-gray-600 mb-2 capitalize">{app.businessType} • {app.businessCategory}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>TIN: {app.tinNumber}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0">
                    Pending
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}