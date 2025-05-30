import { useState } from 'react';
import { ArrowLeft, Activity, Calendar, Clock, FileText, Heart, Thermometer, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';


const AddMeasurement = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [notes, setNotes] = useState('');

  // Measurement types
  const measurementTypes = [
    { name: 'Blood Pressure', units: ['mmHg'] },
    { name: 'Blood Sugar', units: ['mg/dL', 'mmol/L'] },
    { name: 'Heart Rate', units: ['bpm'] },
    { name: 'Temperature', units: ['°F', '°C'] },
    { name: 'Weight', units: ['kg', 'lbs'] },
    { name: 'Oxygen Saturation', units: ['%'] },
    { name: 'Other', units: [] }
  ];

  // Get units based on selected type
  const getUnits = () => {
    const selectedType = measurementTypes.find(m => m.name === type);
    return selectedType ? selectedType.units : [];
  };

  // Get icon based on measurement type
  const getIcon = () => {
    switch (type) {
      case 'Blood Pressure':
        return <Activity size={18} className="text-red-500" />;
      case 'Blood Sugar':
        return <Droplets size={18} className="text-blue-500" />;
      case 'Heart Rate':
        return <Heart size={18} className="text-red-500" />;
      case 'Temperature':
        return <Thermometer size={18} className="text-orange-500" />;
      case 'Weight':
        return <Activity size={18} className="text-green-500" />;
      case 'Oxygen Saturation':
        return <Activity size={18} className="text-blue-500" />;
      default:
        return <Activity size={18} className="text-primary" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!type || !value || !unit || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to a database or state management
    toast.success('Measurement recorded successfully!');
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/progress');
    }, 1500);
  };

  // Handle type change
  const handleTypeChange = (newType: string) => {
    setType(newType);
    // Reset unit when type changes
    setUnit(measurementTypes.find(m => m.name === newType)?.units[0] || '');
  };

  return (
    <PageContainer 
      title="Record Measurement" 
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
        <h2 className="text-lg font-medium mb-2">Record a Health Measurement</h2>
        <p className="text-sm text-gray-600">
          Track your vital signs and health measurements
        </p>
      </div>

      {/* Add Measurement Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            {getIcon()}
            Measurement Details
          </h3>
          <div className="space-y-4">
            {/* Measurement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Measurement Type*
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="input"
                required
              >
                <option value="" disabled>Select measurement type</option>
                {measurementTypes.map((measureType) => (
                  <option key={measureType.name} value={measureType.name}>
                    {measureType.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Value and Unit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value*
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="input"
                  placeholder={type === 'Blood Pressure' ? "e.g., 120/80" : "Enter value"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit*
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="input"
                  required
                  disabled={!type || getUnits().length === 0}
                >
                  <option value="" disabled>Select unit</option>
                  {getUnits().map((unitOption) => (
                    <option key={unitOption} value={unitOption}>
                      {unitOption}
                    </option>
                  ))}
                </select>
                {type === 'Other' && (
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="input mt-2"
                    placeholder="Enter unit"
                    required
                  />
                )}
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
                  placeholder="Any additional notes about this measurement"
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
          Record Measurement
        </button>
      </form>
    </PageContainer>
  );
};

export default AddMeasurement;
