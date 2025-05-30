import { useState } from 'react';
import { Activity, AlertTriangle, Calendar, ChevronDown, ChevronUp, Clock, FileText, User } from 'lucide-react';

interface MedicationCardProps {
  medication: {
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
  compact?: boolean;
}

const MedicationCard = ({ medication, compact = false }: MedicationCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (compact) {
    return (
      <div className="card mb-3 fade-in hover:shadow-md transition-all duration-300">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white mr-3 shadow-sm">
              <span className="text-lg">💊</span>
            </div>
            <div>
              <h3 className="font-medium">{medication.name} <span className="text-sm text-gray-500">{medication.dosage}</span></h3>
              <p className="text-sm text-gray-500">{medication.instruction}</p>
            </div>
          </div>
          <div className="pill-indicator bg-success text-white shadow-sm animate-bounce-light">✓</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 shadow-sm fade-in hover:shadow-md transition-all duration-300">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white mr-3 shadow-sm">
            <span className="text-lg">💊</span>
          </div>
          <div>
            <h3 className="font-medium">{medication.name} <span className="text-sm text-gray-500">{medication.dosage}</span></h3>
            <p className="text-sm text-gray-500">{medication.instruction}</p>
          </div>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors duration-200"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <span className="text-sm">💊</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Active Ingredients</div>
              <div className="text-sm text-gray-600">{medication.activeIngredient}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <Clock size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Frequency & Timing</div>
              <div className="text-sm text-gray-600">{medication.timing}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <User size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Prescribed By</div>
              <div className="text-sm text-gray-600">{medication.doctor}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <Calendar size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Start Date</div>
              <div className="text-sm text-gray-600">{medication.startDate}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <Activity size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Condition Treated</div>
              <div className="text-sm text-gray-600">{medication.condition}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <FileText size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Instructions</div>
              <div className="text-sm text-gray-600">{medication.details}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Side Effects</div>
              <div className="text-sm text-gray-600">{medication.sideEffects}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 text-gray-400 mt-0.5">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Warnings & Precautions</div>
              <div className="text-sm text-gray-600">{medication.warnings}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationCard;
