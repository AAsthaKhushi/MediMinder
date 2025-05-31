import { useState, useEffect, useRef } from 'react';
import { format, addDays, isSameDay, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getYear } from 'date-fns';
import { Bell, BookOpen, Check, ChevronLeft, ChevronRight, CircleAlert, CircleX, Clock, Plus, Trash2 } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import { updateTodayMedications } from '../data/mockData';
import ReminderModal from '../components/ReminderModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnhancedCalendarViews from '../components/EnhancedCalendarViews';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  instruction: string;
  time: string;
  period: string;
  taken: boolean;
  skipped?: boolean;
  missed?: boolean;
  skipReason?: string;
  type?: 'tablet' | 'capsule' | 'liquid' | 'injection' | string;
  withFood?: boolean;


}

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  color: string;
  lastEdited?: Date;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  repeat: string;
  isCompleted: boolean;
}


const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [medications, setMedications] = useState<Medication[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [noteText, setNoteText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    instruction: 'Take 1 tablet',
    time: '08:00 AM',
    period: 'Morning',
  });
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showSkipReasonModal, setShowSkipReasonModal] = useState(false);
  const [skipReason, setSkipReason] = useState('');
  const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Touch gesture variables for swipe navigation
  const touchStartXRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    
    // Swipe threshold (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next day
        selectDay(addDays(selectedDate, 1));
      } else {
        // Swipe right - previous day
        selectDay(addDays(selectedDate, -1));
      }
    }
    
    touchStartXRef.current = null;
  };
  
  // Handle long press to quick-add medication
  const handleTouchStartLongPress = (med: Medication) => {
    longPressTimerRef.current = setTimeout(() => {
      // Toggle medication status on long press
      if (!med.taken && !med.missed && !med.skipped) {
        handleStatusChange(med, 'taken');
      } else if (med.taken) {
        handleStatusChange(med, 'missed');
      } else if (med.missed) {
        handleStatusChange(med, 'skipped');
      } else {
        handleStatusChange(med, 'taken');
      }
      
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }, 800); // 800ms long press
  };
  
  const handleTouchEndLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  
  // Load medications
  useEffect(() => {
    // Update the medications from the global state
    setMedications(updateTodayMedications());
    
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    // Load reminders from localStorage
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
    
    // Initialize current month based on selected date
    setCurrentMonth(selectedDate);
    
    // Set up notification checking
    checkForDueReminders();
    notificationTimerRef.current = setInterval(checkForDueReminders, 60000); // Check every minute
    
    return () => {
      if (notificationTimerRef.current) {
        clearInterval(notificationTimerRef.current);
      }
    };
  }, []);
  
  // Check for reminders that need notifications
  const checkForDueReminders = () => {
    const now = new Date();
    const currentDateStr = format(now, 'yyyy-MM-dd');
    const currentTimeStr = format(now, 'HH:mm');
    
    reminders.forEach(reminder => {
      if (!reminder.isCompleted && reminder.date === currentDateStr) {
        const reminderTime = reminder.time;
        if (reminderTime === currentTimeStr) {
          // Show notification
          toast.info(`Reminder: ${reminder.title}`, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          
          // Play sound if available
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(err => console.log('Audio play failed', err));
        }
      }
    });
  };
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);
  
  
  const nextWeek = () => {
    const nextWeekStart = addDays(currentWeekStart, 7);
    setCurrentWeekStart(nextWeekStart);
    selectDay(nextWeekStart);
  };
  
  const previousWeek = () => {
    const prevWeekStart = addDays(currentWeekStart, -7);
    setCurrentWeekStart(prevWeekStart);
    selectDay(prevWeekStart);
  };
  
  const nextMonth = () => {
    const nextMonthDate = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonthDate);
    selectDay(nextMonthDate);
  };
  
  const previousMonth = () => {
    const prevMonthDate = addMonths(currentMonth, -1);
    setCurrentMonth(prevMonthDate);
    selectDay(prevMonthDate);
  };
  
  const changeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    const newDate = new Date(year, month, 1);
    setCurrentMonth(newDate);
    selectDay(newDate);
  };
  
  // Generate month options for dropdown
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = getYear(currentDate);
    
    // Generate options for current year and next year
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        options.push({
          value: `${year}-${month}`,
          label: format(date, 'MMMM yyyy')
        });
      }
    }
    
    return options;
  };
  
  // Get days for the current month
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };
  
  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const newMed: Medication = {
        id: medications.length + 1,
        name: newMedication.name || '',
        dosage: newMedication.dosage || '',
        instruction: newMedication.instruction || 'Take 1 tablet',
        time: newMedication.time || '08:00 AM',
        period: newMedication.period || 'Morning',
        taken: false,
      };
      
      setMedications([...medications, newMed]);
      setNewMedication({
        name: '',
        dosage: '',
        instruction: 'Take 1 tablet',
        time: '08:00 AM',
        period: 'Morning',
      });
      setShowAddMedication(false);
    }
  };
  
  const handleStatusChange = (med: Medication, status: 'taken' | 'missed' | 'skipped') => {
    if (status === 'skipped') {
      setSelectedMedication(med);
      setShowSkipReasonModal(true);
      return;
    }
    
    const updatedMedications = medications.map(m => {
      if (m.id === med.id) {
        switch (status as 'taken' | 'missed' | 'skipped') {
          case 'taken':
            return { ...m, taken: true, missed: false, skipped: false, skipReason: undefined };
          case 'missed':
            return { ...m, taken: false, missed: true, skipped: false, skipReason: undefined };
          case 'skipped':
            return { ...m, taken: false, missed: false, skipped: true, skipReason: m.skipReason };
        }
      }
      return m;
    });
    
    setMedications(updatedMedications);
  };
  
  const confirmSkipReason = () => {
    if (selectedMedication) {
      const updatedMedications = medications.map(m => {
        if (m.id === selectedMedication.id) {
          return {
            ...m,
            taken: false,
            missed: false,
            skipped: true,
            skipReason: skipReason
          };
        }
        return m;
      });
      
      setMedications(updatedMedications);
      setShowSkipReasonModal(false);
      setSelectedMedication(null);
      setSkipReason('');
    }
  };
  
  const openAddNote = () => {
    setNoteTitle('');
    setNoteText('');
    setNoteCategory('General');
    setShowNoteModal(true);
    setEditingNoteId(null);
  };
  
  const openAddNoteForDate = (date: Date) => {
    setSelectedDate(date);
    setActiveTab('notes');
    openAddNote();
  };
  
  const saveNote = () => {
    if (noteText.trim() && noteTitle.trim()) {
      if (editingNoteId) {
        // Update existing note
        setNotes(notes.map(note => 
          note.id === editingNoteId 
            ? { 
                ...note, 
                title: noteTitle, 
                content: noteText, 
                category: noteCategory, 
                color: getCategoryColor(noteCategory),
                lastEdited: new Date()
              }
            : note
        ));
        
        toast.success('Note updated successfully!', {
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        // Create new note
        const newNote: Note = {
          id: Date.now().toString(),
          title: noteTitle,
          content: noteText,
          date: selectedDate,
          category: noteCategory,
          color: getCategoryColor(noteCategory),
          lastEdited: new Date()
        };
        
        setNotes([...notes, newNote]);
        
        toast.success('Note added successfully!', {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
      
      setShowNoteModal(false);
      setEditingNoteId(null);
    } else {
      toast.error('Title and content are required', {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };
  
  const editNote = (note: Note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteText(note.content);
    setNoteCategory(note.category);
    setShowNoteModal(true);
  };
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Medication': return 'bg-red-500';
      case 'Appointment': return 'bg-blue-500';
      case 'Symptom': return 'bg-green-500';
      case 'Question': return 'bg-yellow-500';
      default: return 'bg-primary';
    }
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.info('Note deleted', {
      position: "bottom-right",
      autoClose: 2000,
    });
  };
  
  
  const handleAddReminder = (reminderData: {
    title: string;
    description: string;
    date: string;
    time: string;
    repeat: string;
  }) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString(),
      isCompleted: false
    };
    
    setReminders([...reminders, newReminder]);
    
    toast.success('Reminder set successfully!', {
      position: "bottom-right",
      autoClose: 2000,
    });
  };
  
  const toggleReminderComplete = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isCompleted: !reminder.isCompleted }
        : reminder
    ));
  };
  
  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    
    toast.info('Reminder deleted', {
      position: "bottom-right",
      autoClose: 2000,
    });
  };
  
  // Filter reminders for today
  const todayReminders = reminders.filter(reminder => {
    return reminder.date === format(selectedDate, 'yyyy-MM-dd');
  });
  
  // Filter notes for selected date
  const filteredNotes = notes.filter(note => {
    const noteDate = new Date(note.date);
    return isSameDay(noteDate, selectedDate);
  });
  
  // Group medications by period (morning, afternoon, evening)
  const medicationsByPeriod: Record<string, typeof medications> = {
    "Morning": medications.filter(med => med.period === "Morning"),
    "Afternoon": medications.filter(med => med.period === "Afternoon"),
    "Evening": medications.filter(med => med.period === "Evening"),
  };
  
  return (
    <PageContainer 
      title="Schedule" 
      actionButton={
        <div className="flex gap-2">
          <button 
            className="btn btn-secondary text-sm pulse-shadow" 
            onClick={() => setShowReminderModal(true)}
          >
            <Bell size={16} />
            <span>Set Reminder</span>
          </button>
          <button className="btn btn-primary text-sm" onClick={() => setShowAddMedication(true)}>
            <Plus size={16} />
            <span>Add Medication</span>
          </button>
        </div>
      }
    >
      <ToastContainer />
      <div 
        ref={contentRef}
        className="mb-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEndLongPress}
      >
        {/* View Mode Toggle and Month Selection */}
        <EnhancedCalendarViews
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedDate={selectedDate}
          selectDay={selectDay}
          currentWeekStart={currentWeekStart}
          currentMonth={currentMonth}
          previousWeek={previousWeek}
          nextWeek={nextWeek}
          previousMonth={previousMonth}
          nextMonth={nextMonth}
          changeMonth={changeMonth}
          getMonthOptions={getMonthOptions}
          getDaysInMonth={getDaysInMonth}
          notes={notes}
          openAddNoteForDate={openAddNoteForDate}
        />
      </div>
      
      <div className="mb-4 overflow-x-auto -mx-4 px-4">
        <div className="flex space-x-2 w-max min-w-full">
          <button
            className={`tab flex items-center gap-1 ${activeTab === 'schedule' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Clock size={16} />
            <span>Today's Schedule</span>
          </button>
          
          <button
            className={`tab flex items-center gap-1 ${activeTab === 'notes' ? 'tab-active' : ''} relative`}
            onClick={() => setActiveTab('notes')}
          >
            <BookOpen size={16} />
            <span>Notes & Journal</span>
            {filteredNotes.length > 0 && (
              <div className="notification-badge">{filteredNotes.length}</div>
            )}
          </button>
          
          <button
            className={`tab flex items-center gap-1 ${activeTab === 'reminders' ? 'tab-active' : ''} relative`}
            onClick={() => setActiveTab('reminders')}
          >
            <Bell size={16} />
            <span>Reminders</span>
            {todayReminders.length > 0 && (
              <div className="notification-badge">{todayReminders.length}</div>
            )}
          </button>
        </div>
      </div>
      
      {activeTab === 'notes' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Notes for {format(selectedDate, 'MMM d, yyyy')}</h2>
            <button 
              onClick={openAddNote} 
              className="btn btn-primary text-sm"
            >
              <Plus size={16} />
              <span>Add Note</span>
            </button>
          </div>
          
          {filteredNotes.length > 0 ? (
            <div className="space-y-3">
              {/* Note preview bubbles */}
              <div className="flex flex-wrap gap-2 mb-2">
                {filteredNotes.map(note => (
                  <div 
                    key={`bubble-${note.id}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${note.color === 'bg-primary' ? 'bg-primary/10 text-primary' : note.color.replace('bg-', 'bg-') + '/10 text-' + note.color.replace('bg-', '')}`}
                    onClick={() => editNote(note)}
                  >
                    <span className={`w-2 h-2 rounded-full ${note.color}`}></span>
                    <span>{note.title}</span>
                  </div>
                ))}
              </div>
              
              {/* Note cards */}
              <div className="space-y-3">
                {filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    className="card p-4 hover:shadow-md transition-all duration-300 border-l-4"
                    style={{ borderLeftColor: note.color.replace('bg-', '').includes('primary') ? 'var(--color-primary)' : '' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{note.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${note.color === 'bg-primary' ? 'bg-primary/10 text-primary' : note.color.replace('bg-', 'bg-') + '/10 text-' + note.color.replace('bg-', '')}`}>
                            {note.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {note.lastEdited ? (
                            <>Last edited {format(new Date(note.lastEdited), 'MMM d, h:mm a')}</>
                          ) : (
                            <>Created {format(new Date(note.date), 'MMM d, h:mm a')}</>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button 
                          onClick={() => editNote(note)}
                          className="p-1.5 rounded-full hover:bg-gray-100"
                          title="Edit note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1.5 rounded-full hover:bg-gray-100 text-red-500"
                          title="Delete note"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: note.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^- (.*?)$/gm, '• $1')
                          .replace(/^\d+\. (.*?)$/gm, '1. $1')
                          .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
                          .replace(/\n/g, '<br>')
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <BookOpen size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No notes for this day</p>
              <button 
                onClick={openAddNote} 
                className="text-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Plus size={16} />
                <span>Add a note</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'reminders' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Reminders for {format(selectedDate, 'MMM d, yyyy')}</h2>
            <button 
              onClick={() => setShowReminderModal(true)} 
              className="btn btn-primary text-sm"
            >
              <Plus size={16} />
              <span>Add Reminder</span>
            </button>
          </div>
          
          {todayReminders.length > 0 ? (
            <div className="space-y-2">
              {todayReminders.map(reminder => (
                <div 
                  key={reminder.id} 
                  className={`card p-4 border-l-4 ${reminder.isCompleted ? 'border-green-500 bg-green-50' : 'border-primary'} transition-all duration-300 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className={`font-medium ${reminder.isCompleted ? 'line-through text-gray-500' : ''}`}>{reminder.title}</h3>
                        <div className="ml-2 flex items-center">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{reminder.time}</span>
                          {reminder.repeat !== 'never' && (
                            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{reminder.repeat}</span>
                          )}
                        </div>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleReminderComplete(reminder.id)}
                        className={`p-1.5 rounded-full ${reminder.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} hover:shadow-sm transition-all duration-200`}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-1.5 rounded-full bg-red-100 text-red-600 hover:shadow-sm transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Bell size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No reminders for this day</p>
              <button 
                onClick={() => setShowReminderModal(true)} 
                className="text-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Plus size={16} />
                <span>Add a reminder</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {Object.entries(medicationsByPeriod).map(([period, meds]) => (
  meds.length > 0 && (
    <div key={period} className={`mb-6 rounded-xl shadow-lg overflow-hidden border-2 ${
      period === 'Morning' ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50' : 
      period === 'Afternoon' ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50' : 
      'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50'
    }`}>
      {/* Enhanced Period Header */}
      <div className={`p-4 flex items-center justify-between ${
        period === 'Morning' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 
        period === 'Afternoon' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 
        'bg-gradient-to-r from-indigo-500 to-purple-500'
      }`}>
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-white/20 rounded-full">
            {period === 'Morning' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M5.5 5.5L6.5 6.5M18.5 5.5L17.5 6.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {period === 'Afternoon' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C12 3 8 6 8 12C8 18 12 21 12 21C12 21 16 18 16 12C16 6 12 3 12 3Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            )}
            {period === 'Evening' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.4 13.7001C20.6 13.9001 19.8 14.0001 19 14.0001C15.1 14.0001 12 10.9001 12 7.00006C12 5.40006 12.5 3.90006 13.3 2.70006C13.1 2.70006 12.9 2.70006 12.7 2.70006C7.5 2.60006 3.1 6.80006 3 12.0001C2.9 17.2001 7.1 21.6001 12.3 21.7001C16 21.7001 19.1 19.5001 20.6 16.4001C20.9 15.7001 21.1 14.9001 21.3 14.1001C21.3 14.0001 21.4 13.8001 21.4 13.7001Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">{period}</h2>
            <p className="text-white/80 text-sm">
              {period === 'Morning' && '6:00 AM - 12:00 PM'}
              {period === 'Afternoon' && '12:00 PM - 6:00 PM'}
              {period === 'Evening' && '6:00 PM - 12:00 AM'}
            </p>
          </div>
        </div>
        <div className="text-white/90 text-sm font-medium">
          {meds.filter(med => med.taken).length}/{meds.length} taken
        </div>
      </div>

      {/* Medications List */}
      <div className="p-3 space-y-3">
        {meds.map((med, index) => (
          <div 
            key={index}
            className={`bg-white rounded-xl p-4 shadow-md border-l-4 transition-all duration-200 hover:shadow-lg ${
              med.taken ? 'border-l-green-500 bg-green-50/50' :
              med.missed ? 'border-l-red-500 bg-red-50/50' :
              med.skipped ? 'border-l-yellow-500 bg-yellow-50/50' :
              'border-l-gray-300 hover:border-l-blue-400'
            }`}
            onTouchStart={() => handleTouchStartLongPress(med)}
            onTouchEnd={handleTouchEndLongPress}
            onTouchCancel={handleTouchEndLongPress}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/* Medication Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    med.type === 'tablet' ? 'bg-blue-100' :
                    med.type === 'capsule' ? 'bg-green-100' :
                    med.type === 'liquid' ? 'bg-purple-100' :
                    med.type === 'injection' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {/* Tablet Icon */}
                    {(med.type === 'tablet' || !med.type) && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="12" cy="12" rx="8" ry="6" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>
                        <line x1="12" y1="6" x2="12" y2="18" stroke="#1E40AF" strokeWidth="1"/>
                      </svg>
                    )}
                    {/* Capsule Icon */}
                    {med.type === 'capsule' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="6" width="8" height="12" rx="4" fill="#10B981" stroke="#059669" strokeWidth="2"/>
                        <rect x="8" y="6" width="8" height="6" fill="#34D399"/>
                      </svg>
                    )}
                    {/* Liquid Icon */}
                    {med.type === 'liquid' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 3V6H17V3H7Z" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="2"/>
                        <path d="M7 6H17V18C17 19.1046 16.1046 20 15 20H9C7.89543 20 7 19.1046 7 18V6Z" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2"/>
                        <circle cx="12" cy="13" r="2" fill="#8B5CF6"/>
                      </svg>
                    )}
                    {/* Injection Icon */}
                    {med.type === 'injection' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3L21 7L19 9L15 5L17 3Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
                        <path d="M15 5L3 17V21H7L19 9L15 5Z" fill="#FCA5A5" stroke="#DC2626" strokeWidth="2"/>
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{med.name}</h3>
                    <p className="text-blue-600 font-semibold">{med.dosage}</p>
                    <p className="text-gray-600 text-sm mt-1">{med.instruction}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock size={14} />
                    <span className="font-medium">{med.time}</span>
                  </div>
                  {med.withFood && (
                    <div className="flex items-center gap-1 text-amber-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                      </svg>
                      <span className="text-xs font-medium">With food</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="ml-4">
                {med.taken && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Taken
                  </div>
                )}
                {med.missed && (
                  <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Missed
                  </div>
                )}
                {med.skipped && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Skipped</span>
                    {med.skipReason && (
                      <span className="text-xs underline cursor-help" title={med.skipReason}>
                        (?)
                      </span>
                    )}
                  </div>
                )}
                {!med.taken && !med.missed && !med.skipped && (
                  <div className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    Pending
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button 
                className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold flex justify-center items-center gap-2 transition-all duration-200 ${
                  med.taken 
                    ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-200' 
                    : 'bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md'
                }`}
                onClick={() => handleStatusChange(med, 'taken')}
              >
                <Check size={16} strokeWidth={2.5} />
                Taken
              </button>
              
              <button 
                className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold flex justify-center items-center gap-2 transition-all duration-200 ${
                  med.missed 
                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200' 
                    : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md'
                }`}
                onClick={() => handleStatusChange(med, 'missed')}
              >
                <CircleX size={16} strokeWidth={2.5} />
                Missed
              </button>
              
              <button 
                className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold flex justify-center items-center gap-2 transition-all duration-200 ${
                  med.skipped 
                    ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-200' 
                    : 'bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 hover:shadow-md'
                }`}
                onClick={() => handleStatusChange(med, 'skipped')}
              >
                <CircleAlert size={16} strokeWidth={2.5} />
                Skip
              </button>
            </div>
            
            {/* Skip Reason Display */}
            {med.skipReason && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-600 mt-0.5 flex-shrink-0">
                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-medium text-sm">Skip Reason:</p>
                    <p className="text-yellow-700 text-sm">{med.skipReason}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Progress Indicator */}
            {med.taken && (
              <div className="mt-3 flex items-center gap-2 text-green-600">
                <div className="flex-1 bg-green-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full transition-all duration-500"></div>
                </div>
                <span className="text-xs font-medium">Completed</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Period Summary */}
      <div className={`p-3 border-t ${
        period === 'Morning' ? 'bg-orange-50 border-orange-100' : 
        period === 'Afternoon' ? 'bg-blue-50 border-blue-100' : 
        'bg-indigo-50 border-indigo-100'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Progress: <span className="font-semibold">{meds.filter(med => med.taken).length}/{meds.length}</span>
            </span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              meds.every(med => med.taken) ? 'bg-green-100 text-green-700' :
              meds.some(med => med.missed) ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {meds.every(med => med.taken) ? 'Complete' :
               meds.some(med => med.missed) ? 'Needs attention' :
               'In progress'}
            </div>
          </div>
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                period === 'Morning' ? 'bg-orange-400' : 
                period === 'Afternoon' ? 'bg-blue-400' : 
                'bg-indigo-400'
              }`}
              style={{ width: `${(meds.filter(med => med.taken).length / meds.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
))}
      
      {/* Add Medication Modal */}
      {showAddMedication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4">
            <h2 className="text-lg font-bold mb-4">Add New Medication</h2>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Medication Name</label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="e.g., Lisinopril"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Dosage</label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="e.g., 10mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Instructions</label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="e.g., Take 1 tablet"
                  value={newMedication.instruction}
                  onChange={(e) => setNewMedication({...newMedication, instruction: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Time</label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="e.g., 08:00 AM"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Period</label>
                <select 
                  className="input"
                  value={newMedication.period}
                  onChange={(e) => setNewMedication({...newMedication, period: e.target.value})}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowAddMedication(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMedication}
                className="btn btn-primary"
                disabled={!newMedication.name || !newMedication.dosage}
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Skip Reason Modal */}
      {showSkipReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4">
            <h2 className="text-lg font-bold mb-4">Skipping Medication</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for skipping {selectedMedication?.name} {selectedMedication?.dosage}:
            </p>
            
            <textarea 
              className="input h-24 mb-4"
              placeholder="e.g., Doctor advised to skip, Feeling unwell, etc."
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
            ></textarea>
            
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowSkipReasonModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSkipReason}
                className="btn btn-warning"
                disabled={!skipReason.trim()}
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-lg p-4 animate-scaleIn">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <BookOpen size={20} className="mr-2 text-primary" />
              {editingNoteId ? 'Edit Note' : 'Add Note'} for {format(selectedDate, 'MMM d, yyyy')}
            </h2>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Title*</label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="Note title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['General', 'Medication', 'Appointment', 'Symptom', 'Question'].map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setNoteCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${noteCategory === category 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Note*</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Rich Text Editor Toolbar */}
                  <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                    <button 
                      type="button"
                      onClick={() => setNoteText(noteText + '**Bold Text**')}
                      className="p-1.5 rounded hover:bg-gray-200" 
                      title="Bold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNoteText(noteText + '*Italic Text*')}
                      className="p-1.5 rounded hover:bg-gray-200" 
                      title="Italic"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNoteText(noteText + '- List item\n- Another item')}
                      className="p-1.5 rounded hover:bg-gray-200" 
                      title="Bullet List"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNoteText(noteText + '1. Numbered item\n2. Another item')}
                      className="p-1.5 rounded hover:bg-gray-200" 
                      title="Numbered List"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    <button 
                      type="button"
                      onClick={() => setNoteText(noteText + '> Important quote or highlight')}
                      className="p-1.5 rounded hover:bg-gray-200" 
                      title="Quote"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                    </button>
                  </div>
                  
                  {/* Text Area */}
                  <textarea 
                    className="w-full p-3 min-h-[200px] focus:outline-none"
                    placeholder="Write your note here... You can use markdown formatting like **bold**, *italic*, lists, etc."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              {/* Preview Section */}
              {noteText && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="text-xs font-medium text-gray-500 mb-1">Preview:</div>
                  <div className="prose prose-sm max-w-none">
                    {/* This would be better with a markdown renderer, but for now we'll use basic formatting */}
                    <div dangerouslySetInnerHTML={{ 
                      __html: noteText
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/^- (.*?)$/gm, '• $1')
                        .replace(/^\d+\. (.*?)$/gm, '1. $1')
                        .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
                        .replace(/\n/g, '<br>')
                    }}></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowNoteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={saveNote}
                className="btn btn-primary"
                disabled={!noteTitle.trim() || !noteText.trim()}
              >
                {editingNoteId ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4">
            <h2 className="text-lg font-bold mb-4">Select Date</h2>
            <div className="calendar-wrapper">
              {/* Calendar implementation */}
              <div className="flex justify-between mb-4">
                <button 
                  className="btn btn-sm" 
                  onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
                <button 
                  className="btn btn-sm" 
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {eachDayOfInterval({
                  start: startOfMonth(currentMonth),
                  end: endOfMonth(currentMonth)
                }).map((date) => (
                  <button
                    key={date.toString()}
                    className={`p-2 rounded-full ${isSameDay(date, selectedDate) ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setShowCalendarModal(false);
                    }}
                  >
                    {format(date, 'd')}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCalendarModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showReminderModal && (
        <ReminderModal 
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          onSave={handleAddReminder}
        />
      )}
    </PageContainer>
  );
};

// Calendar icon component removed as it's unused

export default Schedule;
