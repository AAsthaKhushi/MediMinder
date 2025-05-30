import { useState } from 'react';
import { Bell, Calendar, Check, Clock, X } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: {
    title: string;
    description: string;
    date: string;
    time: string;
    repeat: string;
  }) => void;
  initialData?: {
    title: string;
    description: string;
    date: string;
    time: string;
    repeat: string;
  };
}

const ReminderModal = ({ isOpen, onClose, onSave, initialData }: ReminderModalProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [repeat, setRepeat] = useState(initialData?.repeat || 'never');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      title,
      description,
      date,
      time,
      repeat
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-xl w-full max-w-md p-4 animate-scaleIn shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <Bell size={18} className="mr-2 text-primary" />
            Set Reminder
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Title*</label>
            <input 
              type="text" 
              className="input w-full"
              placeholder="What do you want to be reminded about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Description</label>
            <textarea 
              className="input w-full h-20"
              placeholder="Add additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Date*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input 
                  type="date" 
                  className="input pl-9 w-full"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Time*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <input 
                  type="time" 
                  className="input pl-9 w-full"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Repeat</label>
            <select 
              className="input w-full"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="never">Never</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={!title || !date || !time}
            >
              <Check size={16} />
              <span>Save Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
