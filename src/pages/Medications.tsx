import { useState } from 'react';
import { Filter, Plus, Search, X } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import MedicationCard from '../components/MedicationCard';
import { medications, addMedication } from '../data/mockData';

// Define the medication type inline
type Medication = {
  id: number;
  name: string;
  dosage: string;
  instruction: string;
  activeIngredient: string;
  timing: string;
  doctor: string;
  startDate: string;
  condition: string;
  details: string;
  sideEffects: string;
  warnings: string;
};

const Medications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    instruction: '',
    activeIngredient: '',
    timing: '',
    period: 'Morning',
    mealTiming: 'After meal',
    time: '',
    doctor: '',
    startDate: '',
    condition: '',
    details: '',
    sideEffects: '',
    warnings: '',
    allergies: ''
  });
  
  const filteredMedications = medications.filter((med: Medication) => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create a timing string combining period and time
    const timingStr = `${newMedication.period}, ${newMedication.time} - ${newMedication.mealTiming}`;
    
    // Add new medication to the list
    addMedication({
      ...newMedication,
      timing: timingStr,
      id: medications.length + 1
    });
    
    // Reset form
    setNewMedication({
      name: '',
      dosage: '',
      instruction: '',
      activeIngredient: '',
      timing: '',
      period: 'Morning',
      mealTiming: 'After meal',
      time: '',
      doctor: '',
      startDate: '',
      condition: '',
      details: '',
      sideEffects: '',
      warnings: '',
      allergies: ''
    });
    
    // Close the form
    setShowAddForm(false);
  };
  
  return (
    <PageContainer 
      title="My Medications" 
      actionButton={
        <button className="btn btn-primary text-sm flex items-center gap-1" onClick={() => setShowAddForm(true)}>
          <Plus size={16} />
          <span>Add New</span>
        </button>
      }
    >
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search medications..."
          className="input pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Filter size={16} className="text-gray-400" />
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">All Medications</h2>
        <span className="text-sm text-gray-500">{filteredMedications.length} medications</span>
      </div>
      
      <div>
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med: Medication) => (
            <MedicationCard key={med.id} medication={med} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No medications found</p>
          </div>
        )}
      </div>
      
      {/* Add Medication Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add New Medication</h2>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Medication Name*</label>
                <input 
                  type="text" 
                  name="name"
                  className="input"
                  placeholder="e.g., Lisinopril"
                  value={newMedication.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Dosage*</label>
                <input 
                  type="text" 
                  name="dosage"
                  className="input"
                  placeholder="e.g., 10mg"
                  value={newMedication.dosage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Active Ingredient</label>
                <input 
                  type="text" 
                  name="activeIngredient"
                  className="input"
                  placeholder="e.g., Lisinopril"
                  value={newMedication.activeIngredient}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Time of Day*</label>
                <select 
                  name="period"
                  className="input"
                  value={newMedication.period}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Specific Time*</label>
                <input 
                  type="text" 
                  name="time"
                  className="input"
                  placeholder="e.g., 08:00 AM"
                  value={newMedication.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Meal Timing</label>
                <select 
                  name="mealTiming"
                  className="input"
                  value={newMedication.mealTiming}
                  onChange={handleInputChange}
                >
                  <option value="Before breakfast">Before breakfast</option>
                  <option value="After breakfast">After breakfast</option>
                  <option value="Before lunch">Before lunch</option>
                  <option value="After lunch">After lunch</option>
                  <option value="Before dinner">Before dinner</option>
                  <option value="After dinner">After dinner</option>
                  <option value="After meal">After meal</option>
                  <option value="With food">With food</option>
                  <option value="On an empty stomach">On an empty stomach</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Instructions*</label>
                <input 
                  type="text" 
                  name="instruction"
                  className="input"
                  placeholder="e.g., Take 1 tablet"
                  value={newMedication.instruction}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Prescribed By</label>
                <input 
                  type="text" 
                  name="doctor"
                  className="input"
                  placeholder="e.g., Dr. John Doe"
                  value={newMedication.doctor}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Start Date</label>
                <input 
                  type="text" 
                  name="startDate"
                  className="input"
                  placeholder="e.g., May 20, 2025"
                  value={newMedication.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Condition Treated</label>
                <input 
                  type="text" 
                  name="condition"
                  className="input"
                  placeholder="e.g., Hypertension"
                  value={newMedication.condition}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Detailed Instructions</label>
                <textarea 
                  name="details"
                  className="input h-24"
                  placeholder="e.g., Take 1 tablet daily with water"
                  value={newMedication.details}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Allergies & Warnings</label>
                <textarea 
                  name="allergies"
                  className="input h-20"
                  placeholder="e.g., Do not take if allergic to ACE inhibitors"
                  value={newMedication.allergies}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Possible Side Effects</label>
                <textarea 
                  name="sideEffects"
                  className="input h-20"
                  placeholder="e.g., Dizziness, Headache, Dry cough"
                  value={newMedication.sideEffects}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Additional Warnings</label>
                <textarea 
                  name="warnings"
                  className="input h-20"
                  placeholder="e.g., Avoid alcohol"
                  value={newMedication.warnings}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newMedication.name || !newMedication.dosage || !newMedication.instruction}
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Medications;
