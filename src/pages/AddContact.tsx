import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddContact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [notes, setNotes] = useState('');

  // Relationship options
  const relationshipOptions = [
    'Family',
    'Friend',
    'Doctor',
    'Pharmacist',
    'Caregiver',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // In a real app, this would save to a database or state management
    toast.success('Contact added successfully!');
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/contacts');
    }, 1500);
  };

  return (
    <PageContainer 
      title="Add Contact" 
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
        <h2 className="text-lg font-medium mb-2">Add a Trusted Contact</h2>
        <p className="text-sm text-gray-600">
          Add someone who can help you with your medication management
        </p>
      </div>

      {/* Add Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <User size={18} className="text-primary" />
            Contact Information
          </h3>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter contact name"
                required
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship*
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="input"
                required
              >
                <option value="" disabled>Select relationship</option>
                {relationshipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <div className="flex items-center">
                <div className="mr-2">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center">
                <div className="mr-2">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emergency-contact"
                checked={isEmergencyContact}
                onChange={(e) => setIsEmergencyContact(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="emergency-contact" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                <Heart size={16} className="text-red-500 mr-1" />
                Emergency Contact
              </label>
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
                placeholder="Any additional information about this contact"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Add Contact
        </button>
      </form>
    </PageContainer>
  );
};

export default AddContact;
