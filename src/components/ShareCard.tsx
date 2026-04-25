import { Share2, QrCode, Smartphone, Apple } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ShareCardProps {
  onClose: () => void;
}

export function ShareCard({ onClose }: ShareCardProps) {
  const appUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'goPay - Tanzania Super App',
          text: 'Check out goPay - All-in-one payments, shopping, and services!',
          url: appUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(appUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">gP</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Share goPay</h2>
          <p className="text-gray-600">
            Invite friends to try Tanzania's best super app!
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-500 mb-2">App URL</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm bg-white p-3 rounded-xl border border-gray-200 overflow-x-auto">
              {appUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(appUrl);
                toast.success('Copied!');
              }}
              className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex-shrink-0"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white h-14 rounded-2xl"
          >
            <Share2 className="size-5 mr-2" />
            Share Link
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all">
              <QrCode className="size-6 mx-auto mb-2 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">QR Code</span>
            </button>
            <button className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all">
              <Smartphone className="size-6 mx-auto mb-2 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">SMS</span>
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Apple className="size-5" />
            Install Instructions
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>iPhone:</strong> Safari → Share → Add to Home Screen</p>
            <p><strong>Android:</strong> Chrome → Menu → Install App</p>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 h-12 rounded-2xl hover:bg-gray-300"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
