import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';



const AddAppointment = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderSet, setReminderSet] = useState(true);

  // Appointment type options
  const appointmentTypes = [
    'Doctor Visit',
    'Specialist Consultation',
    'Lab Test',
    'Vaccination',
    'Therapy Session',
    'Prescription Refill',
    'Follow-up',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim() || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to a database or state management
    toast.success('Appointment added successfully!');
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/follow-ups');
    }, 1500);
  };

  return (
    <PageContainer 
      title="Add Appointment" 
      actionButton={
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      }
    >
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Schedule a New Appointment</h2>
        <p className="text-sm text-gray-600">
          Keep track of your upcoming medical appointments
        </p>
      </div>

      {/* Add Appointment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Appointment Details
          </h3>
          <div className="space-y-4">
            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Type*
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                required
              >
                <option value="" disabled>Select appointment type</option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date*
              </label>
              <div className="flex items-center">
                <div className="mr-2">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time*
              </label>
              <div className="flex items-center">
                <div className="mr-2">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="flex items-center">
                <div className="mr-2">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input"
                  placeholder="Enter appointment location"
                />
              </div>
            </div>

            {/* Healthcare Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Healthcare Provider
              </label>
              <div className="flex items-center">
                <div className="mr-2">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="input"
                  placeholder="Enter doctor or provider name"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <div className="flex items-center">
                <div className="mr-2">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input min-h-[80px]"
                  placeholder="Any additional notes about this appointment"
                />
              </div>
            </div>

            {/* Set Reminder */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="set-reminder"
                checked={reminderSet}
                onChange={(e) => setReminderSet(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="set-reminder" className="ml-2 text-sm font-medium text-gray-700">
                Set reminder for this appointment
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Add Appointment
        </button>
      </form>
    </PageContainer>
  );
};

export default AddAppointment;
