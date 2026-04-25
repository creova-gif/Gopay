import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Upload, CheckCircle2, Building2, FileText, Camera, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MerchantOnboardingProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onComplete: () => void;
}

export function MerchantOnboarding({ user, accessToken, onBack, onComplete }: MerchantOnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessCategory: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dar es Salaam',
    description: '',
    tinNumber: '',
    vrn: '',
    ownerName: '',
    ownerIdNumber: '',
  });

  const [documents, setDocuments] = useState({
    businessLicense: null as File | null,
    tinCertificate: null as File | null,
    ownerIdCard: null as File | null,
    businessPhoto: null as File | null,
  });

  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const businessTypes = [
    { id: 'restaurant', label: 'Restaurant & Food Delivery', icon: '🍽️' },
    { id: 'grocery', label: 'Grocery Store', icon: '🛒' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
    { id: 'retail', label: 'Retail & Shopping', icon: '🏪' },
    { id: 'cafe', label: 'Cafe & Coffee Shop', icon: '☕' },
    { id: 'bakery', label: 'Bakery', icon: '🥖' },
  ];

  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const uploadFile = async (file: File, fileName: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/merchant/upload-document`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.fileUrl;
  };

  const handleSubmit = async () => {
    setUploading(true);

    try {
      // Upload all documents
      const documentUrls: Record<string, string> = {};

      if (documents.businessLicense) {
        documentUrls.businessLicense = await uploadFile(
          documents.businessLicense,
          `business_license_${user.id}_${Date.now()}`
        );
      }

      if (documents.tinCertificate) {
        documentUrls.tinCertificate = await uploadFile(
          documents.tinCertificate,
          `tin_certificate_${user.id}_${Date.now()}`
        );
      }

      if (documents.ownerIdCard) {
        documentUrls.ownerIdCard = await uploadFile(
          documents.ownerIdCard,
          `owner_id_${user.id}_${Date.now()}`
        );
      }

      if (documents.businessPhoto) {
        documentUrls.businessPhoto = await uploadFile(
          documents.businessPhoto,
          `business_photo_${user.id}_${Date.now()}`
        );
      }

      // Submit merchant application
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/merchant/register`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            documents: documentUrls,
            status: 'pending',
            submittedAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting merchant application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your merchant application has been submitted successfully. Our team will review your documents within 24-48 hours.
          </p>
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>What's Next?</strong><br />
              1. Document verification (1-2 days)<br />
              2. Business verification call<br />
              3. Account activation<br />
              4. Start accepting payments!
            </p>
          </div>
          <Button onClick={onBack} className="w-full bg-black text-white h-12 rounded-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Become a Merchant</h1>
              <p className="text-sm text-gray-500">Step 1 of 3: Business Details</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Business Type Selection */}
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Select Business Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {businessTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, businessType: type.id })}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    formData.businessType === type.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <p className="text-sm font-semibold text-center">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Business Information</h2>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g., Pizza Paradise"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Business Category</label>
              <input
                type="text"
                value={formData.businessCategory}
                onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g., Italian, Pizza, Fast Food"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="+255 xxx xxx xxx"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Business Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                placeholder="Tell customers about your business..."
              />
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!formData.businessName || !formData.businessType || !formData.email}
              className="w-full bg-black text-white h-12 rounded-full disabled:opacity-50"
            >
              Continue to Registration Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setStep(1)} className="p-2">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Become a Merchant</h1>
              <p className="text-sm text-gray-500">Step 2 of 3: Registration Details</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Tax & Registration</h2>
            
            <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                All businesses must be registered with TRA (Tanzania Revenue Authority) and have valid licenses to operate on goPay.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">TIN Number</label>
              <input
                type="text"
                value={formData.tinNumber}
                onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="xxx-xxx-xxx"
              />
              <p className="text-xs text-gray-500 mt-1">Taxpayer Identification Number</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">VRN (Optional)</label>
              <input
                type="text"
                value={formData.vrn}
                onChange={(e) => setFormData({ ...formData, vrn: e.target.value })}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="VAT Registration Number"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-bold mb-4">Owner Information</h3>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Owner Full Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Full legal name"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">ID/Passport Number</label>
                <input
                  type="text"
                  value={formData.ownerIdNumber}
                  onChange={(e) => setFormData({ ...formData, ownerIdNumber: e.target.value })}
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="National ID or Passport"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep(3)}
              disabled={!formData.tinNumber || !formData.ownerName || !formData.ownerIdNumber}
              className="w-full bg-black text-white h-12 rounded-full disabled:opacity-50"
            >
              Continue to Document Upload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Document Upload
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep(2)} className="p-2">
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Become a Merchant</h1>
            <p className="text-sm text-gray-500">Step 3 of 3: Upload Documents</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto pb-32">
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Required Documents</h2>
            <p className="text-sm text-gray-600">Upload clear photos or scans of the following documents</p>
          </div>

          {/* Business License */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Business License</h3>
                <p className="text-sm text-gray-600 mb-3">Valid business operating license from local authority</p>
                {documents.businessLicense ? (
                  <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span className="text-sm font-medium">{documents.businessLicense.name}</span>
                    </div>
                    <button
                      onClick={() => handleFileChange('businessLicense', null)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-200 transition-all">
                    <Upload className="size-5" />
                    <span className="text-sm font-medium">Upload File</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* TIN Certificate */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="size-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">TIN Certificate</h3>
                <p className="text-sm text-gray-600 mb-3">Tax Identification Number certificate from TRA</p>
                {documents.tinCertificate ? (
                  <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span className="text-sm font-medium">{documents.tinCertificate.name}</span>
                    </div>
                    <button
                      onClick={() => handleFileChange('tinCertificate', null)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-200 transition-all">
                    <Upload className="size-5" />
                    <span className="text-sm font-medium">Upload File</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange('tinCertificate', e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Owner ID */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="size-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Owner ID Card</h3>
                <p className="text-sm text-gray-600 mb-3">National ID or Passport of business owner</p>
                {documents.ownerIdCard ? (
                  <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span className="text-sm font-medium">{documents.ownerIdCard.name}</span>
                    </div>
                    <button
                      onClick={() => handleFileChange('ownerIdCard', null)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-200 transition-all">
                    <Upload className="size-5" />
                    <span className="text-sm font-medium">Upload File</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange('ownerIdCard', e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Business Photo */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Camera className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Business Photo</h3>
                <p className="text-sm text-gray-600 mb-3">Photo of your storefront or business premises</p>
                {documents.businessPhoto ? (
                  <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span className="text-sm font-medium">{documents.businessPhoto.name}</span>
                    </div>
                    <button
                      onClick={() => handleFileChange('businessPhoto', null)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-200 transition-all">
                    <Camera className="size-5" />
                    <span className="text-sm font-medium">Take Photo / Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileChange('businessPhoto', e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All documents must be valid and not expired</li>
                <li>Photos must be clear and readable</li>
                <li>Accepted formats: JPG, PNG, PDF (max 5MB each)</li>
                <li>Verification typically takes 24-48 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={
              !documents.businessLicense ||
              !documents.tinCertificate ||
              !documents.ownerIdCard ||
              uploading
            }
            className="w-full bg-green-600 text-white h-14 rounded-full disabled:opacity-50 font-bold"
          >
            {uploading ? 'Uploading Documents...' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}
