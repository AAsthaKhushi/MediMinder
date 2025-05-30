import { useState } from 'react';
import { ArrowLeft, Check, Clock, Coffee, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MedicationTemplate {
  id: string;
  name: string;
  dosage: string;
  instruction: string;
}

const AddDose = () => {
  const navigate = useNavigate();
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [period, setPeriod] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [mealRelation, setMealRelation] = useState<'before' | 'after' | 'with' | 'any'>('any');
  const [instruction, setInstruction] = useState('Take 1 tablet');
  const [showTemplates, setShowTemplates] = useState(false);

  // Sample medication templates
  const medicationTemplates: MedicationTemplate[] = [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      instruction: 'Take 1 tablet daily'
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      instruction: 'Take 1 tablet twice daily with meals'
    },
    {
      id: '3',
      name: 'Atorvastatin',
      dosage: '20mg',
      instruction: 'Take 1 tablet at bedtime'
    },
    {
      id: '4',
      name: 'Levothyroxine',
      dosage: '50mcg',
      instruction: 'Take 1 tablet in the morning on empty stomach'
    }
  ];

  const handleSelectTemplate = (template: MedicationTemplate) => {
    setMedicationName(template.name);
    setDosage(template.dosage);
    setInstruction(template.instruction);
    setShowTemplates(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!medicationName.trim() || !dosage.trim() || !time || !instruction.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to a database or state management
    toast.success('Medication dose added successfully!');
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/schedule');
    }, 1500);
  };

  const getPeriodIcon = (periodValue: string) => {
    switch (periodValue) {
      case 'Morning':
        return <Sun size={18} />;
      case 'Afternoon':
        return <Coffee size={18} />;
      case 'Evening':
        return <Moon size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const getPeriodColor = (periodValue: string) => {
    switch (periodValue) {
      case 'Morning':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Afternoon':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Evening':
        return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <PageContainer 
      title="Add Dose" 
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
        <h2 className="text-lg font-medium mb-2">Add a Medication Dose</h2>
        <p className="text-sm text-gray-600">
          Record a medication dose to track in your schedule
        </p>
      </div>

      {/* Quick Templates */}
      <div className="mb-6">
        <button 
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-primary font-medium text-sm flex items-center"
        >
          {showTemplates ? 'Hide Templates' : 'Show Quick Templates'}
        </button>
        
        {showTemplates && (
          <div className="mt-2 border border-gray-200 rounded-lg p-2 bg-gray-50 animate-fadeIn">
            <p className="text-xs text-gray-500 mb-2">Select a template to auto-fill details:</p>
            <div className="space-y-2">
              {medicationTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full text-left p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{template.name} {template.dosage}</p>
                      <p className="text-xs text-gray-500">{template.instruction}</p>
                    </div>
                    <Check size={16} className="text-primary opacity-0 group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Dose Form */}
      <form onSubmit={handleSubmit}>
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

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time*
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input"
              required
            />
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Morning', 'Afternoon', 'Evening'] as const).map((periodOption) => (
                <button
                  key={periodOption}
                  type="button"
                  onClick={() => setPeriod(periodOption)}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${
                    period === periodOption 
                      ? getPeriodColor(periodOption)
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {getPeriodIcon(periodOption)}
                  <span>{periodOption}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meal Relation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['before', 'with', 'after', 'any'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMealRelation(option)}
                  className={`p-2 rounded-lg border text-sm ${
                    mealRelation === option 
                      ? 'bg-primary-light border-primary text-primary'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {option === 'before' && 'Before meal'}
                  {option === 'with' && 'With meal'}
                  {option === 'after' && 'After meal'}
                  {option === 'any' && 'Any time'}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions*
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="input min-h-[80px]"
              placeholder="Enter special instructions"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-6"
          >
            Add Medication Dose
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default AddDose;
