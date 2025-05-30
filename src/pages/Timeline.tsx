import { useState, useEffect, useRef } from 'react';
import { format, isToday } from 'date-fns';
import { Activity, Calendar, Check, Clock, Filter, Pill, RefreshCw, X } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import { timelineEvents } from '../data/mockData';

type EventStatus = 'completed' | 'missed' | 'snoozed' | 'upcoming';
type EventCategory = 'medication' | 'appointment' | 'monitoring';

// Type for the timeline events
interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  category: EventCategory;
  status: EventStatus;
  icon?: React.ReactNode;
}

const Timeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState<EventStatus | 'all'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRingPreview, setShowRingPreview] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Initialize events from mock data
  useEffect(() => {
    // Add a small delay for loading animation effect
    const timer = setTimeout(() => {
      setEvents(timelineEvents as TimelineEvent[]);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filter events based on selected filter
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });
  
  // Sort events by time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = a.time.split(':');
    const timeB = b.time.split(':');
    return (parseInt(timeA[0]) * 60 + parseInt(timeA[1])) - 
           (parseInt(timeB[0]) * 60 + parseInt(timeB[1]));
  });
  
  // Calculate the current progress on the timeline (0-100%)
  const timelineProgress = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const totalMinutes = 24 * 60;
    return (minutes / totalMinutes) * 100;
  };
  
  // Handle status change of an event
  const handleStatusChange = (id: number, newStatus: EventStatus) => {
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === id ? { ...event, status: newStatus } : event
      );
      
      // Add animation class to the updated event
      setTimeout(() => {
        const element = document.getElementById(`event-${id}`);
        if (element) {
          element.classList.add('status-changed');
          setTimeout(() => element.classList.remove('status-changed'), 500);
        }
      }, 10);
      
      return updated;
    });
  };
  
  // Get category details (color and icon)
  const getCategoryDetails = (category: EventCategory) => {
    switch (category) {
      case 'medication':
        return { 
          color: 'bg-red-500', 
          lightColor: 'bg-red-100',
          textColor: 'text-red-500',
          borderColor: 'border-red-500',
          icon: <Pill size={16} />
        };
      case 'appointment':
        return { 
          color: 'bg-blue-500', 
          lightColor: 'bg-blue-100',
          textColor: 'text-blue-500',
          borderColor: 'border-blue-500',
          icon: <Calendar size={16} />
        };
      case 'monitoring':
        return { 
          color: 'bg-green-500', 
          lightColor: 'bg-green-100',
          textColor: 'text-green-500', 
          borderColor: 'border-green-500',
          icon: <Activity size={16} />
        };
    }
  };
  
  // Get status details (color and icon)
  const getStatusDetails = (status: EventStatus) => {
    switch (status) {
      case 'completed':
        return { 
          icon: <Check size={16} />, 
          color: 'bg-success text-white',
          label: 'Completed'
        };
      case 'missed':
        return { 
          icon: <X size={16} />, 
          color: 'bg-danger text-white',
          label: 'Missed'
        };
      case 'snoozed':
        return { 
          icon: <RefreshCw size={16} />, 
          color: 'bg-warning text-white',
          label: 'Snoozed'
        };
      case 'upcoming':
        return { 
          icon: <Clock size={16} />, 
          color: 'bg-gray-200 text-gray-600',
          label: 'Upcoming'
        };
    }
  };
  
  // Set active tab class
  const getTabClass = (tabFilter: string) => {
    return `tab transition-all duration-300 ${filter === tabFilter ? 'tab-active scale-105' : ''}`;
  };

  return (
    <PageContainer 
      title="Smart Health Timeline" 
      actionButton={
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <Filter size={20} className="text-gray-600" />
        </button>
      }
    >
      <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        <h2 className="text-sm text-gray-500 mb-3">All your medical tasks simplified, scheduled, and synced.</h2>
        
        <div className="flex items-center justify-between mt-4 bg-gray-50 p-1 rounded-lg">
          <div 
            className={getTabClass('all')}
            onClick={() => setFilter('all')}
          >
            All
          </div>
          <div 
            className={getTabClass('upcoming')}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </div>
          <div 
            className={getTabClass('completed')}
            onClick={() => setFilter('completed')}
          >
            Completed
          </div>
          <div 
            className={getTabClass('missed')}
            onClick={() => setFilter('missed')}
          >
            Missed
          </div>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 pulse-animation"></div>
            <span className="text-xs text-gray-600">Medications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 pulse-animation"></div>
            <span className="text-xs text-gray-600">Appointments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 pulse-animation"></div>
            <span className="text-xs text-gray-600">Monitoring</span>
          </div>
        </div>
        
        <span className="text-xs font-medium text-gray-400">
          {format(currentTime, 'EEEE, MMM d')}
        </span>
      </div>
      
      <div className="timeline-container relative" ref={timelineRef}>
        {/* Timeline track */}
        <div 
          className="absolute left-[18px] w-[3px] bg-gray-100 rounded-full" 
          style={{ top: 0, bottom: 0, zIndex: 0 }}
        ></div>
        
        {/* Current time indicator */}
        {isToday(new Date()) && (
          <div 
            className="absolute left-[14px] w-[10px] h-[10px] bg-primary rounded-full z-10 shadow-md border-2 border-white"
            style={{ 
              top: `${timelineProgress()}%`,
              transition: 'top 1s linear'
            }}
          >
            <div className="absolute w-5 h-5 bg-primary/30 rounded-full -left-1.5 -top-1.5 animate-ping"></div>
          </div>
        )}
        
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-400 animate-pulse">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            <p>Loading your timeline...</p>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
            <p>No events match your filter</p>
            <button 
              onClick={() => setFilter('all')}
              className="mt-2 text-xs text-primary underline"
            >
              View all events
            </button>
          </div>
        ) : (
          <div className="space-y-6 pb-28">
            {sortedEvents.map((event, index) => {
              const categoryDetails = getCategoryDetails(event.category);
              const statusDetails = getStatusDetails(event.status);
              const delay = index * 50; // Stagger animation delay
              
              return (
                <div 
                  key={event.id} 
                  id={`event-${event.id}`}
                  className="flex items-start gap-4 timeline-item"
                  style={{
                    animationDelay: `${delay}ms`,
                    opacity: 0,
                    animation: `fadeSlideIn 0.4s ease-out ${delay}ms forwards`
                  }}
                >
                  {/* Timeline dot with pulse effect for upcoming events */}
                  <div className="relative mt-1">
                    <div className={`w-[10px] h-[10px] rounded-full ${categoryDetails.color} z-10 relative transition-all duration-300`}>
                      {event.status === 'upcoming' && (
                        <div className={`absolute w-5 h-5 ${categoryDetails.color} rounded-full -left-[7px] -top-[7px] opacity-30 timeline-pulse`}></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {event.time}
                    </div>
                    
                    <div className={`card p-3 border-l-4 ${categoryDetails.borderColor} hover:shadow-md transition-all duration-300`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <span className={`p-1 rounded-md ${categoryDetails.lightColor} ${categoryDetails.textColor}`}>
                              {categoryDetails.icon}
                            </span>
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        
                        <div className={`pill-indicator ${statusDetails.color} shadow-sm`} title={statusDetails.label}>
                          {statusDetails.icon}
                        </div>
                      </div>
                      
                      {/* Action buttons with improved styling and animations */}
                      {event.status === 'upcoming' && (
                        <div className="flex gap-2 mt-3">
                          <button 
                            className="flex-1 py-1.5 px-2 rounded-lg border border-success text-success text-xs font-medium hover:bg-success hover:text-white transition-all duration-200"
                            onClick={() => handleStatusChange(event.id, 'completed')}
                          >
                            <div className="flex items-center justify-center">
                              <Check size={12} className="mr-1" />
                              Complete
                            </div>
                          </button>
                          <button 
                            className="flex-1 py-1.5 px-2 rounded-lg border border-warning text-warning text-xs font-medium hover:bg-warning hover:text-white transition-all duration-200"
                            onClick={() => handleStatusChange(event.id, 'snoozed')}
                          >
                            <div className="flex items-center justify-center">
                              <RefreshCw size={12} className="mr-1" />
                              Snooze
                            </div>
                          </button>
                          <button 
                            className="flex-1 py-1.5 px-2 rounded-lg border border-danger text-danger text-xs font-medium hover:bg-danger hover:text-white transition-all duration-200"
                            onClick={() => handleStatusChange(event.id, 'missed')}
                          >
                            <div className="flex items-center justify-center">
                              <X size={12} className="mr-1" />
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

      {/* Smart ring notification preview with minimalist design */}
      {showRingPreview && (
        <div className="fixed bottom-20 left-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100 z-30 animate-slideUp">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Smart Device Integration</h3>
            <button 
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowRingPreview(false)}
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shadow-inner">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shadow-inner">
                  <div className="w-6 h-6 rounded-full smart-ring-pulse">
                    {/* Different colors based on event types */}
                    <div className="absolute inset-0 w-full h-full rounded-full bg-red-500 ring-pulse opacity-0"></div>
                    <div className="absolute inset-0 w-full h-full rounded-full bg-blue-500 ring-pulse opacity-0" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute inset-0 w-full h-full rounded-full bg-green-500 ring-pulse opacity-0" style={{ animationDelay: '4s' }}></div>
                  </div>
                </div>
              </div>
              <div className="absolute w-3 h-3 rounded-full bg-red-500 top-0 right-0 animate-ping"></div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Real-time health alerts on your smart ring</h4>
              <p className="text-xs text-gray-500 mt-1">Color-coded LED indicators with gentle vibrations for medications, appointments and monitoring tasks</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-red-500 flex items-center"><span className="block w-2 h-2 rounded-full bg-red-500 mr-1"></span> Medications</span>
                <span className="text-xs text-blue-500 flex items-center"><span className="block w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Appointments</span>
                <span className="text-xs text-green-500 flex items-center"><span className="block w-2 h-2 rounded-full bg-green-500 mr-1"></span> Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Timeline;
