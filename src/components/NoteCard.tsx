import { useState } from 'react';
import { Calendar, Check, Squircle, Ellipsis, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  date: Date;
  category?: string;
  color?: 'bg-primary' | 'bg-red-500' | 'bg-blue-500' | 'bg-green-500' | 'bg-yellow-500' | 'bg-purple-500';
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, content: string, category: string) => void;
}

const NoteCard = ({ 
  id, 
  title, 
  content, 
  date, 
  category = 'General', 
  color = 'bg-primary', 
  onDelete, 
  onEdit 
}: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedCategory, setEditedCategory] = useState(category);

  const handleSave = () => {
    onEdit(id, editedTitle, editedContent, editedCategory);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedContent(content);
    setEditedCategory(category);
    setIsEditing(false);
  };

  const colorClasses = {
    'bg-primary': 'border-l-4 border-primary bg-primary/5',
    'bg-red-500': 'border-l-4 border-red-500 bg-red-50',
    'bg-blue-500': 'border-l-4 border-blue-500 bg-blue-50',
    'bg-green-500': 'border-l-4 border-green-500 bg-green-50',
    'bg-yellow-500': 'border-l-4 border-yellow-500 bg-yellow-50',
    'bg-purple-500': 'border-l-4 border-purple-500 bg-purple-50'
  } as const;

  return (
    <div className={`card mb-3 overflow-hidden transition-all duration-300 hover:shadow-md ${colorClasses[color] || colorClasses['bg-primary']}`}>
      {isEditing ? (
        <div className="p-4">
          <input
            type="text"
            className="input mb-2 w-full font-medium text-gray-800"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Note title"
          />
          
          <textarea
            className="input mb-2 w-full h-24 text-sm text-gray-600"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Note content"
          ></textarea>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">Category:</span>
            <select
              className="text-sm border border-gray-200 rounded-lg px-2 py-1"
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Medication">Medication</option>
              <option value="Appointment">Appointment</option>
              <option value="Symptom">Symptom</option>
              <option value="Question">Question for Doctor</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-secondary text-xs px-3 py-1"
              onClick={handleCancel}
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
            <button
              className="btn btn-primary text-xs px-3 py-1"
              onClick={handleSave}
            >
              <Check size={14} />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{title}</h3>
            <div className="relative">
              <button 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowMenu(!showMenu)}
              >
                <Ellipsis size={16} className="text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-md border border-gray-100 py-1 w-32 z-10 animate-fadeIn">
                  <button 
                    className="flex items-center w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 text-gray-700"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    <Squircle size={14} className="mr-2" />
                    <span>Edit</span>
                  </button>
                  <button 
                    className="flex items-center w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 text-red-600"
                    onClick={() => {
                      onDelete(id);
                      setShowMenu(false);
                    }}
                  >
                    <Trash2 size={14} className="mr-2" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">{content}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={12} className="mr-1" />
              <span>{format(new Date(date), 'MMM d, yyyy')}</span>
            </div>
            <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
              {category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
