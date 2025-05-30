import { useState } from 'react';
import { ArrowLeft, AlertTriangle, Calendar, Clock, FileText, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';


const AddSymptom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState(3);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [relatedMedication, setRelatedMedication] = useState('');

  // Common symptom options
  const commonSymptoms = [
    'Headache',
    'Nausea',
    'Dizziness',
    'Fatigue',
    'Rash',
    'Fever',
    'Cough',
    'Shortness of breath',
    'Muscle pain',
    'Joint pain',
    'Stomach pain',
    'Diarrhea',
    'Constipation',
    'Insomnia',
    'Other'
  ];

  // Duration options
  const durationOptions = [
    'Less than 1 hour',
    '1-3 hours',
    '3-6 hours',
    '6-12 hours',
    '12-24 hours',
    'More than 24 hours',
    'Ongoing'
  ];

  // Mock medications for dropdown
  const medications = [
    'Lisinopril 10mg',
    'Metformin 500mg',
    'Atorvastatin 20mg',
    'Levothyroxine 50mcg',
    'Amlodipine 5mg',
    'None'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to a database or state management
    toast.success('Symptom recorded successfully!');
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  return (
    <PageContainer 
      title="Record Symptom" 
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
        <h2 className="text-lg font-medium mb-2">Record a New Symptom</h2>
        <p className="text-sm text-gray-600">
          Track your symptoms to monitor your health and medication effects
        </p>
      </div>

      {/* Add Symptom Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-primary" />
            Symptom Details
          </h3>
          <div className="space-y-4">
            {/* Symptom Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptom*
              </label>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
              >
                <option value="" disabled>Select symptom</option>
                {commonSymptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom}
                  </option>
                ))}
              </select>
              {name === 'Other' && (
                <input
                  type="text"
                  value={name === 'Other' ? '' : name}
                  onChange={(e) => setName(e.target.value)}
                  className="input mt-2"
                  placeholder="Enter symptom name"
                  required
                />
              )}
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity (1-5)*
              </label>
              <div className="flex items-center gap-2">
                <BarChart size={18} className="text-gray-400" />
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium w-6 text-center">
                  {severity}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
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

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input"
              >
                <option value="" disabled>Select duration</option>
                {durationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Related Medication */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Medication (if any)
              </label>
              <select
                value={relatedMedication}
                onChange={(e) => setRelatedMedication(e.target.value)}
                className="input"
              >
                <option value="" disabled>Select medication</option>
                {medications.map((med) => (
                  <option key={med} value={med}>
                    {med}
                  </option>
                ))}
              </select>
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
                  placeholder="Any additional details about this symptom"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Record Symptom
        </button>
      </form>
    </PageContainer>
  );
};

export default AddSymptom;
