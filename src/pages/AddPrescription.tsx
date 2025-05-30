import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';



const AddPrescription = () => {
  const navigate = useNavigate();
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [refills, setRefills] = useState(0);
  const [prescribedBy, setPrescribedBy] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  const [notes, setNotes] = useState('');

  // Frequency options
  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every other day',
    'Once weekly',
    'As needed'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!medicationName.trim() || !dosage.trim() || !startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to a database or state management
    toast.success('Prescription added successfully!');
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/medications');
    }, 1500);
  };

  return (
    <PageContainer 
      title="Add Prescription" 
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
        <h2 className="text-lg font-medium mb-2">Add a New Prescription</h2>
        <p className="text-sm text-gray-600">
          Record prescription details for your medication
        </p>
      </div>

      {/* Add Prescription Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <AlertCircle size={18} className="text-primary" />
            Medication Information
          </h3>
          <div className="space-y-4">
            {/* Medication Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name*
              </label>
              <input
                type="text"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                className="input"
                placeholder="Enter medication name"
                required
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage*
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="input"
                placeholder="e.g., 10mg, 1 tablet, 2 pills"
                required
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency*
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="input"
                required
              >
                {frequencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Prescription Timeline
          </h3>
          <div className="space-y-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date*
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (if applicable)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input"
              />
            </div>

            {/* Refills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Refills
              </label>
              <input
                type="number"
                min="0"
                value={refills}
                onChange={(e) => setRefills(parseInt(e.target.value))}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Additional Information
          </h3>
          <div className="space-y-4">
            {/* Prescribed By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescribed By
              </label>
              <input
                type="text"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                className="input"
                placeholder="Doctor's name"
              />
            </div>

            {/* Pharmacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pharmacy
              </label>
              <input
                type="text"
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value)}
                className="input"
                placeholder="Pharmacy name"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input min-h-[80px]"
                placeholder="Any additional notes or instructions"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Add Prescription
        </button>
      </form>
    </PageContainer>
  );
};

export default AddPrescription;
