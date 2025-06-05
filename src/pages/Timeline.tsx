import { useState, useEffect, useRef } from 'react';
import { Activity, Calendar, Check, Clock, Filter, Pill, RefreshCw, X, Heart, Zap, User, Bell, Star } from 'lucide-react';

type EventStatus = 'completed' | 'missed' | 'snoozed' | 'upcoming';
type EventCategory = 'medication' | 'appointment' | 'monitoring';

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  category: EventCategory;
  status: EventStatus;
  priority?: 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
}

// Mock data with more variety
const mockEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Morning Blood Pressure",
    description: "Take your daily blood pressure reading",
    time: "08:00",
    date: "2025-05-31",
    category: "monitoring",
    status: "completed",
    priority: "high"
  },
  {
    id: 2,
    title: "Lisinopril 10mg",
    description: "Take with breakfast",
    time: "09:30",
    date: "2025-05-31",
    category: "medication",
    status: "upcoming",
    priority: "high"
  },
  {
    id: 3,
    title: "Dr. Johnson Cardiology",
    description: "Follow-up appointment for heart health",
    time: "14:00",
    date: "2025-05-31",
    category: "appointment",
    status: "upcoming",
    priority: "medium"
  },
  {
    id: 4,
    title: "Metformin 500mg",
    description: "Take after lunch",
    time: "15:30",
    date: "2025-05-31",
    category: "medication",
    status: "upcoming",
    priority: "high"
  },
  {
    id: 5,
    title: "Evening Walk",
    description: "30 minutes moderate exercise",
    time: "18:00",
    date: "2025-05-31",
    category: "monitoring",
    status: "upcoming",
    priority: "medium"
  },
  {
    id: 6,
    title: "Sleep Medication",
    description: "Melatonin 3mg before bed",
    time: "21:00",
    date: "2025-05-31",
    category: "medication",
    status: "missed",
    priority: "low"
  }
];

const Timeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState<EventStatus | 'all'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRingPreview, setShowRingPreview] = useState(true);
  const [animatingEvents, setAnimatingEvents] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<string[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Initialize events
  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Clear notifications after delay
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  
  // Filter and sort events
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });
  
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = a.time.split(':');
    const timeB = b.time.split(':');
    return (parseInt(timeA[0]) * 60 + parseInt(timeA[1])) - 
           (parseInt(timeB[0]) * 60 + parseInt(timeB[1]));
  });
  
  // Timeline progress calculation
  const timelineProgress = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const totalMinutes = 24 * 60;
    return (minutes / totalMinutes) * 100;
  };
  
  // Handle status change with animations
  const handleStatusChange = (id: number, newStatus: EventStatus) => {
    setAnimatingEvents(prev => new Set([...prev, id]));
    
    setTimeout(() => {
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, status: newStatus } : event
      ));
      
      // Add notification
      const event = events.find(e => e.id === id);
      if (event) {
        const statusMessages: { [key in Exclude<EventStatus, 'upcoming'>]: string } = {
          completed: `✅ ${event.title} marked as completed!`,
          missed: `❌ ${event.title} marked as missed`,
          snoozed: `⏰ ${event.title} snoozed for later`
        };
        // The previous check 'newStatus in statusMessages' is correct for runtime safety,
        // but TypeScript might need help narrowing the type for compile-time safety.
        // We can check if newStatus is one of the keys explicitly
        if (newStatus === 'completed' || newStatus === 'missed' || newStatus === 'snoozed') {
           setNotifications(prev => [...prev, statusMessages[newStatus]]);
        }
      }
    
      setTimeout(() => {
        setAnimatingEvents(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 500);
    }, 150);
  };
  
  // Category configurations with enhanced styling
  const getCategoryDetails = (category: EventCategory) => {
    switch (category) {
      case 'medication':
        return { 
          color: 'bg-gradient-to-r from-red-500 to-pink-500', 
          lightColor: 'bg-gradient-to-r from-red-50 to-pink-50',
          textColor: 'text-red-600',
          borderColor: 'border-red-400',
          shadowColor: 'shadow-red-200',
          icon: <Pill size={18} />,
          bgPattern: 'medication-pattern'
        };
      case 'appointment':
        return { 
          color: 'bg-gradient-to-r from-blue-500 to-indigo-500', 
          lightColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-400',
          shadowColor: 'shadow-blue-200',
          icon: <Calendar size={18} />,
          bgPattern: 'appointment-pattern'
        };
      case 'monitoring':
        return { 
          color: 'bg-gradient-to-r from-green-500 to-emerald-500', 
          lightColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          textColor: 'text-green-600',
          borderColor: 'border-green-400',
          shadowColor: 'shadow-green-200',
          icon: <Activity size={18} />,
          bgPattern: 'monitoring-pattern'
        };
    }
  };
  
  // Status configurations with enhanced styling
  const getStatusDetails = (status: EventStatus) => {
    switch (status) {
      case 'completed':
        return { 
          icon: <Check size={16} />, 
          color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg',
          label: 'Completed',
          pulse: false
        };
      case 'missed':
        return { 
          icon: <X size={16} />, 
          color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg',
          label: 'Missed',
          pulse: false
        };
      case 'snoozed':
        return { 
          icon: <RefreshCw size={16} />, 
          color: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg',
          label: 'Snoozed',
          pulse: true
        };
      case 'upcoming':
        return { 
          icon: <Clock size={16} />, 
          color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg',
          label: 'Upcoming',
          pulse: true
        };
    }
  };

  // Priority indicator
  const getPriorityDetails = (priority: 'high' | 'medium' | 'low' | undefined = 'medium') => {
    switch (priority) {
      case 'high':
        return { color: 'text-red-500', icon: <Zap size={12} />, label: 'High Priority' };
      case 'medium':
        return { color: 'text-yellow-500', icon: <Star size={12} />, label: 'Medium Priority' };
      case 'low':
        return { color: 'text-green-500', icon: <Heart size={12} />, label: 'Low Priority' };
      default:
         return { color: 'text-gray-500', icon: null, label: 'No Priority' };
    }
  };
  
  const getTabClass = (tabFilter: string) => {
    const isActive = filter === tabFilter;
    return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105 transform' 
        : 'text-gray-600 hover:bg-gray-100 hover:scale-102 transform'
    }`;
  };

  // Get event count for each filter
  const getEventCount = (filterType: string) => {
    if (filterType === 'all') return events.length;
    return events.filter(event => event.status === filterType).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Custom CSS for animations */}
      <style >{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -10px, 0); }
          70% { transform: translate3d(0, -5px, 0); }
          90% { transform: translate3d(0, -2px, 0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse 2s infinite; }
        .animate-bounce-gentle { animation: bounce 2s infinite; }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .timeline-dot {
          transition: all 0.3s ease;
        }
        .timeline-dot:hover {
          transform: scale(1.2);
        }
      `}</style>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 shadow-lg border border-gray-200 animate-slideInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-sm font-medium">{notification}</p>
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Health Timeline
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Your personalized health companion</p>
            </div>
            <button className="p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Today's Overview</h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">
                  {events.filter(e => e.status === 'completed').length}/{events.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Tasks Complete</div>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 sm:gap-2 p-1 bg-gray-100 rounded-lg sm:rounded-xl">
              {[
                { key: 'all', label: 'All' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'completed', label: 'Completed' },
                { key: 'missed', label: 'Missed' }
              ].map(tab => (
                <div
                  key={tab.key}
                  className={getTabClass(tab.key)}
                  onClick={() => setFilter(tab.key as any)}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm">{tab.label}</span>
                    <span className="bg-white/20 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs">
                      {getEventCount(tab.key)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:gap-0 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-pulse-slow"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Medications</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse-slow"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Appointments</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse-slow"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Monitoring</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
            <Clock size={14} />
            <span className="font-medium">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Timeline track */}
          <div className="absolute left-4 sm:left-6 w-0.5 sm:w-1 bg-gradient-to-b from-blue-200 via-indigo-200 to-purple-200 rounded-full" 
               style={{ top: 0, bottom: 0, zIndex: 0 }}>
          </div>
          
          {/* Current time indicator */}
          <div 
            className="absolute left-2 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full z-10 shadow-lg border-2 border-white"
            style={{ 
              top: `${timelineProgress()}%`,
              transition: 'top 1s linear'
            }}
          >
            <div className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-blue-400/30 rounded-full -left-1 -top-1 sm:-left-1.5 sm:-top-1.5 animate-ping"></div>
            <div className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-blue-500/50 rounded-full -left-0.5 -top-0.5 animate-pulse"></div>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-bounce-gentle">
                <Clock size={24} className="opacity-50" />
              </div>
              <p className="text-base sm:text-lg font-medium">Loading your timeline...</p>
              <div className="w-24 sm:w-32 h-1.5 sm:h-2 mx-auto mt-3 sm:mt-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 shimmer"></div>
              </div>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500 bg-white rounded-xl sm:rounded-2xl shadow-sm">
              <Calendar size={36} className="mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium mb-2">No events match your filter</p>
              <button 
                onClick={() => setFilter('all')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                View all events
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-28">
              {sortedEvents.map((event, index) => {
                const categoryDetails = getCategoryDetails(event.category);
                const statusDetails = getStatusDetails(event.status);
                const priorityDetails = getPriorityDetails(event.priority);
                const isAnimating = animatingEvents.has(event.id);
                
                return (
                  <div 
                    key={event.id}
                    className={`flex items-start gap-3 sm:gap-6 animate-slideInUp card-hover ${isAnimating ? 'scale-105' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="relative mt-2">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${categoryDetails.color} timeline-dot shadow-lg`}>
                        {event.status === 'upcoming' && (
                          <>
                            <div className={`absolute w-6 h-6 sm:w-8 sm:h-8 ${categoryDetails.color} rounded-full -left-1.5 -top-1.5 sm:-left-2 sm:-top-2 opacity-20 animate-ping`}></div>
                            <div className={`absolute w-4 h-4 sm:w-6 sm:h-6 ${categoryDetails.color} rounded-full -left-0.5 -top-0.5 sm:-left-1 sm:-top-1 opacity-40 animate-pulse`}></div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Event Card */}
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-500">{event.time}</span>
                        {priorityDetails && (
                           <div className={`flex items-center gap-1 ${priorityDetails.color}`}>
                             {priorityDetails.icon}
                             <span className="text-[10px] sm:text-xs">{priorityDetails.label}</span>
                           </div>
                         )}
                      </div>
                      
                      <div className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border-l-4 ${categoryDetails.borderColor} ${categoryDetails.shadowColor} shadow-lg card-hover ${isAnimating ? 'shimmer' : ''}`}>
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                              <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${categoryDetails.lightColor} ${categoryDetails.textColor}`}>
                                {categoryDetails.icon}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 text-base sm:text-lg">{event.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">{event.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${statusDetails.color} ${statusDetails.pulse ? 'animate-pulse-slow' : ''}`}>
                            <div className="flex items-center gap-1">
                              {statusDetails.icon}
                              <span className="text-[10px] sm:text-xs font-medium">{statusDetails.label}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        {event.status === 'upcoming' && (
                          <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <button 
                              className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                              onClick={() => handleStatusChange(event.id, 'completed')}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <Check size={14} />
                                Complete
                              </div>
                            </button>
                            <button 
                              className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                              onClick={() => handleStatusChange(event.id, 'snoozed')}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <RefreshCw size={14} />
                                Snooze
                              </div>
                            </button>
                            <button 
                              className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                              onClick={() => handleStatusChange(event.id, 'missed')}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <X size={14} />
                                Skip
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Smart Ring Preview */}
        {showRingPreview && (
          <div className="fixed bottom-4 sm:bottom-6 left-2 sm:left-4 right-2 sm:right-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-100 z-30 animate-slideInUp">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bell size={14} className="text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-gray-800">Smart Device Integration</h3>
              </div>
              <button 
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110"
                onClick={() => setShowRingPreview(false)}
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-2xl">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-inner">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse opacity-0" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse opacity-0" style={{ animationDelay: '4s', animationDuration: '3s' }}></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-bounce"></div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Seamless Health Monitoring</h4>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                  Get gentle vibrations and color-coded LED alerts directly on your smart ring for all health tasks
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-red-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
                    <span className="text-[10px] sm:text-xs font-medium text-red-600">Medications</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <span className="text-[10px] sm:text-xs font-medium text-blue-600">Appointments</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-green-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                    <span className="text-[10px] sm:text-xs font-medium text-green-600">Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;