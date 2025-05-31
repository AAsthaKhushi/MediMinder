import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, isSameDay, isToday } from 'date-fns';

interface EnhancedCalendarViewsProps {
  viewMode: 'week' | 'month';
  setViewMode: (mode: 'week' | 'month') => void;
  selectedDate: Date;
  selectDay: (date: Date) => void;
  currentWeekStart: Date;
  currentMonth: Date;
  previousWeek: () => void;
  nextWeek: () => void;
  previousMonth: () => void;
  nextMonth: () => void;
  changeMonth: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  getMonthOptions: () => { value: string; label: string }[];
  getDaysInMonth: () => Date[];
  notes: any[]; // Use a proper Note interface if available
  openAddNoteForDate: (date: Date) => void;
}

const EnhancedCalendarViews: React.FC<EnhancedCalendarViewsProps> = ({
  viewMode,
  setViewMode,
  selectedDate,
  selectDay,
  currentWeekStart,
  currentMonth,
  previousWeek,
  nextWeek,
  previousMonth,
  nextMonth,
  getDaysInMonth,
  notes,
  openAddNoteForDate,
}) => {
  const monthScrollRef = useRef<HTMLDivElement>(null);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isSelected: isSameDay(date, selectedDate),
      isToday: isToday(date),
      hasNote: notes.some(note => {
        // Ensure note.date is a Date object or can be converted
        const noteDate = new Date(note.date);
        return !isNaN(noteDate.getTime()) && isSameDay(noteDate, date);
      })
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-2xl p-1 inline-flex">
          <button
            onClick={() => setViewMode('week')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              viewMode === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              viewMode === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-3xl p-6 min-h-[300px] transition-all duration-500">
        {/* Week View */}
        {viewMode === 'week' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousWeek}
                className="group p-3 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-sm"
              >
                <ChevronLeft size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>

              <div className="text-lg font-semibold text-gray-900 tracking-tight">
                {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
              </div>

              <button
                onClick={nextWeek}
                className="group p-3 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-sm"
              >
                <ChevronRight size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>

            {/* Week Days Grid */}
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  className={`group relative flex flex-col items-center py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    day.isSelected
                      ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : day.isToday
                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                        : 'bg-white hover:bg-blue-50 hover:shadow-sm border-2 border-transparent hover:border-blue-100'
                  }`}
                  onClick={() => selectDay(day.date)}
                >
                  <div className={`text-xs font-medium mb-2 tracking-wide uppercase ${
                    day.isSelected ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {day.dayName}
                  </div>
                  <div className={`text-2xl font-bold ${
                    day.isSelected ? 'text-white' : day.isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.dayNumber}
                  </div>
                  {day.hasNote && (
                    <div className={`absolute bottom-3 w-2 h-2 rounded-full transition-all duration-300 ${
                      day.isSelected ? 'bg-white' : 'bg-blue-500'
                    } group-hover:scale-125`}></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Month View */}
        {viewMode === 'month' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousMonth}
                className="group p-3 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-sm"
              >
                <ChevronLeft size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>

              <div className="text-lg font-semibold text-gray-900 tracking-tight">
                {format(currentMonth, 'MMMM yyyy')}
              </div>

              <button
                onClick={nextMonth}
                className="group p-3 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-sm"
              >
                <ChevronRight size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>

            {/* Horizontal Month Scroll */}
            <div className="overflow-x-auto -mx-6 px-6 pb-4" ref={monthScrollRef}>
              <div className="flex space-x-3 w-max min-w-full">
                {getDaysInMonth().map((date, index) => {
                  const dayNotes = notes.filter(note => {
                    const noteDate = new Date(note.date);
                     return !isNaN(noteDate.getTime()) && isSameDay(noteDate, date);
                  });
                  const isCurrentDay = isSameDay(date, selectedDate);
                  const isTodayDate = isToday(date);

                  return (
                    <div key={index} className="min-w-[80px] relative group">
                      <button
                        className={`group/day flex flex-col items-center p-4 rounded-2xl transition-all duration-300 relative w-full transform hover:scale-105 ${
                          isCurrentDay
                            ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : isTodayDate
                              ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                              : 'bg-white hover:bg-blue-50 hover:shadow-sm border-2 border-transparent hover:border-blue-100'
                        }`}
                        onClick={() => selectDay(date)}
                      >
                        <div className={`text-xs font-medium mb-2 tracking-wide uppercase ${
                          isCurrentDay ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {format(date, 'EEE')}
                        </div>
                        <div className={`text-xl font-bold mb-2 ${
                          isCurrentDay ? 'text-white' : isTodayDate ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {format(date, 'd')}
                        </div>

                        {/* Notes indicators */}
                        {dayNotes.length > 0 && (
                          <div className="flex items-center justify-center">
                            {dayNotes.length > 3 ? (
                              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                isCurrentDay
                                  ? 'bg-white/20 text-white'
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                {dayNotes.length}
                              </div>
                            ) : (
                              <div className="flex space-x-1">
                                {dayNotes.slice(0, 3).map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 group-hover/day:scale-125 ${
                                      isCurrentDay ? 'bg-white' : 'bg-blue-500'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </button>

                      {/* Add Note Button */}
                      <button
                        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-8 h-8 shadow-lg flex items-center justify-center transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl ${
                          'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddNoteForDate(date);
                        }}
                        title="Add note"
                      >
                        <Plus size={16} className="text-blue-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCalendarViews; 