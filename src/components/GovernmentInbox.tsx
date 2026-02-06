import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Inbox, 
  ChevronLeft,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Car,
  Landmark,
  GraduationCap,
  Shield,
  Cloud,
  AlertTriangle,
  Users,
  MapPin,
  Bell,
  Filter
} from 'lucide-react';

interface GovernmentInboxProps {
  onBack: () => void;
}

export function GovernmentInbox({ onBack }: GovernmentInboxProps) {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'payments' | 'alerts'>('all');

  const messages = [
    {
      id: 1,
      type: 'tax',
      category: 'payments',
      priority: 'urgent',
      icon: DollarSign,
      color: 'from-red-500 to-orange-500',
      title: 'TRA Tax Payment Due',
      description: 'Your income tax payment is due in 5 days',
      amount: 'TZS 250,000',
      deadline: '2025-12-16',
      status: 'pending',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'license',
      category: 'renewal',
      priority: 'normal',
      icon: Car,
      color: 'from-blue-500 to-cyan-500',
      title: 'Driving License Renewal',
      description: 'Your driving license expires in 30 days',
      deadline: '2026-01-10',
      status: 'pending',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      type: 'fine',
      category: 'payments',
      priority: 'urgent',
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      title: 'Traffic Fine Notice',
      description: 'Speeding violation on Uhuru Highway',
      amount: 'TZS 50,000',
      deadline: '2025-12-20',
      status: 'pending',
      timestamp: '3 days ago'
    },
    {
      id: 4,
      type: 'education',
      category: 'payments',
      priority: 'high',
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-500',
      title: 'School Fees Reminder',
      description: 'Term 2 fees for University of Dar es Salaam',
      amount: 'TZS 1,200,000',
      deadline: '2025-12-25',
      status: 'pending',
      timestamp: '4 days ago'
    },
    {
      id: 5,
      type: 'weather',
      category: 'alert',
      priority: 'urgent',
      icon: Cloud,
      color: 'from-gray-500 to-slate-600',
      title: 'Weather Advisory',
      description: 'Heavy rainfall expected in Dar es Salaam region',
      timestamp: '5 hours ago',
      status: 'info'
    },
    {
      id: 6,
      type: 'nhif',
      category: 'payments',
      priority: 'normal',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      title: 'NHIF Contribution Due',
      description: 'Monthly health insurance payment',
      amount: 'TZS 30,000',
      deadline: '2025-12-15',
      status: 'pending',
      timestamp: '6 days ago'
    },
    {
      id: 7,
      type: 'passport',
      category: 'update',
      priority: 'normal',
      icon: Landmark,
      color: 'from-indigo-500 to-blue-500',
      title: 'Passport Ready for Collection',
      description: 'Your new passport is ready at Immigration Office',
      timestamp: '1 week ago',
      status: 'completed'
    },
    {
      id: 8,
      type: 'missing',
      category: 'alert',
      priority: 'urgent',
      icon: Users,
      color: 'from-red-600 to-pink-600',
      title: 'Missing Person Alert',
      description: 'Help find: John Doe, last seen in Kariakoo',
      timestamp: '2 hours ago',
      status: 'info'
    },
    {
      id: 9,
      type: 'tourism',
      category: 'update',
      priority: 'low',
      icon: MapPin,
      color: 'from-teal-500 to-cyan-500',
      title: 'Tourism Advisory',
      description: 'Serengeti National Park: Best migration viewing this week',
      timestamp: '3 days ago',
      status: 'info'
    },
    {
      id: 10,
      type: 'announcement',
      category: 'update',
      priority: 'normal',
      icon: Bell,
      color: 'from-yellow-500 to-orange-500',
      title: 'Public Holiday Notice',
      description: 'Union Day - December 26, 2025',
      timestamp: '1 week ago',
      status: 'info'
    }
  ];

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return msg.priority === 'urgent';
    if (filter === 'payments') return msg.category === 'payments';
    if (filter === 'alerts') return msg.category === 'alert';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 px-5 pt-8 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full mb-6 transition-all active:scale-95"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <Inbox className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">Government Inbox</h1>
              <p className="text-blue-100 text-sm">National Digital Communication Channel</p>
            </div>
          </div>

          {/* Unread Count */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Unread Messages</p>
              <p className="text-3xl text-white">{messages.filter(m => m.status === 'pending').length}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-xl">
              <Bell className="size-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === 'urgent'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Urgent ({messages.filter(m => m.priority === 'urgent').length})
          </button>
          <button
            onClick={() => setFilter('payments')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === 'payments'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Payments ({messages.filter(m => m.category === 'payments').length})
          </button>
          <button
            onClick={() => setFilter('alerts')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === 'alerts'
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Alerts ({messages.filter(m => m.category === 'alert').length})
          </button>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.map((message) => {
            const Icon = message.icon;
            return (
              <div
                key={message.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${message.color} p-3 rounded-xl text-white flex-shrink-0`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{message.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(message.priority)}`}>
                            {message.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{message.description}</p>
                      </div>
                    </div>

                    {message.amount && (
                      <div className="bg-gray-50 rounded-xl p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Amount Due</span>
                          <span className="font-semibold text-red-600">{message.amount}</span>
                        </div>
                        {message.deadline && (
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">Deadline</span>
                            <span className="text-sm text-gray-900">{message.deadline}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      {message.status === 'pending' && message.amount && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Pay Now
                        </Button>
                      )}
                      {message.status === 'completed' && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="size-4" />
                          <span>Completed</span>
                        </div>
                      )}
                      {message.status === 'info' && (
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* National Communication Channel Badge */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-3">🇹🇿</div>
          <h3 className="text-xl mb-2">Official Government Channel</h3>
          <p className="text-sm text-green-100 mb-4">
            Receive official communications from Tanzania Government agencies:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p>✓ TRA - Tax Authority</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p>✓ NHIF - Health Insurance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p>✓ TANESCO - Electricity</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p>✓ Immigration Services</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p>✓ Traffic Police</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p>✓ Ministry of Education</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg mb-4">Why Use Government Inbox?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm mb-1">Never miss important deadlines</p>
                <p className="text-xs text-gray-600">Automatic reminders for taxes, licenses, fees</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm mb-1">Pay directly from the app</p>
                <p className="text-xs text-gray-600">One-tap payments for government services</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm mb-1">Real-time emergency alerts</p>
                <p className="text-xs text-gray-600">Weather, safety, and public announcements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-blue-600 mb-1">{messages.length}</p>
            <p className="text-xs text-gray-600">Total Messages</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-red-600 mb-1">{messages.filter(m => m.priority === 'urgent').length}</p>
            <p className="text-xs text-gray-600">Urgent</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-green-600 mb-1">{messages.filter(m => m.status === 'completed').length}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
