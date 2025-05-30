import { useState, useEffect } from 'react';
import { Calendar, Mail, MapPin, Phone, Plus, Save, Trash2, User, Pencil, PhoneCall } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

interface ProfileData {
  personal: {
    fullName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
  };
  medical: {
    bloodType: string;
    height: string;
    weight: string;
    allergies: string;
    primaryPhysician: string;
  };
  emergencyContacts: EmergencyContact[];
  healthMetrics: {
    bloodPressure: string;
    heartRate: string;
    bloodGlucose: string;
    lastUpdated: {
      bloodPressure: string;
      heartRate: string;
      bloodGlucose: string;
    };
  };
}

const defaultProfileData: ProfileData = {
  personal: {
    fullName: 'Jordan Smith',
    dateOfBirth: 'January 15, 1991',
    email: 'jordan.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Health St, Medical City, CA 90210',
  },
  medical: {
    bloodType: 'A+',
    height: '5\'10" (178 cm)',
    weight: '165 lbs (75 kg)',
    allergies: 'Penicillin, Peanuts',
    primaryPhysician: 'Dr. Emily Johnson',
  },
  emergencyContacts: [
    {
      id: 1,
      name: 'Sarah Smith',
      phone: '+1 (555) 987-6543',
      email: 'sarah.smith@example.com',
      relationship: 'Spouse',
    }
  ],
  healthMetrics: {
    bloodPressure: '120/80 mmHg',
    heartRate: '72 bpm',
    bloodGlucose: '110 mg/dL',
    lastUpdated: {
      bloodPressure: 'May 10, 2025',
      heartRate: 'May 10, 2025',
      bloodGlucose: 'May 9, 2025',
    }
  }
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [editedData, setEditedData] = useState<ProfileData>(defaultProfileData);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
  useEffect(() => {
    // Load profile data from localStorage if available
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setProfileData(JSON.parse(savedData));
      setEditedData(JSON.parse(savedData));
    }
  }, []);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({...profileData});
  };
  
  const handleSave = () => {
    setProfileData({...editedData});
    setIsEditing(false);
    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(editedData));
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({...profileData});
  };
  
  const handleInputChange = (section: keyof ProfileData, field: string, value: string) => {
    setEditedData({
      ...editedData,
      [section]: {
        ...editedData[section],
        [field]: value
      }
    });
  };
  
  const handleContactChange = (id: number, field: string, value: string) => {
    setEditedData({
      ...editedData,
      emergencyContacts: editedData.emergencyContacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    });
  };
  
  const addEmergencyContact = () => {
    if (editedData.emergencyContacts.length < 4) {
      const newContact: EmergencyContact = {
        id: Date.now(), // Use timestamp as temporary ID
        name: '',
        phone: '',
        email: '',
        relationship: '',
      };
      
      setEditedData({
        ...editedData,
        emergencyContacts: [...editedData.emergencyContacts, newContact]
      });
    } else {
      toast.warning('Maximum of 4 emergency contacts allowed');
    }
  };
  
  const removeEmergencyContact = (id: number) => {
    setEditedData({
      ...editedData,
      emergencyContacts: editedData.emergencyContacts.filter(contact => contact.id !== id)
    });
    setShowDeleteConfirm(null);
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEmergencyCall = (phone: string) => {
    // In a real app, this would initiate a phone call
    toast.info(`Calling emergency contact: ${phone}`);
    window.location.href = `tel:${phone}`;
  };
  
  const renderField = (label: string, value: string, icon: JSX.Element, section: keyof ProfileData, field: string) => {
    if (isEditing && section !== 'healthMetrics') {
      return (
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">{label}</label>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">{icon}</span>
            <input 
              type="text" 
              className="input flex-1"
              value={editedData[section][field as keyof typeof editedData[typeof section]]}
              onChange={(e) => handleInputChange(section, field, e.target.value)}
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-4">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">{icon}</span>
          <span>{value}</span>
        </div>
      </div>
    );
  };
  
  return (
    <PageContainer 
      title="Profile" 
      actionButton={
        !isEditing ? (
          <button 
            onClick={handleEdit}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
            aria-label="Edit Profile"
          >
            <Pencil size={18} />
          </button>
        ) : null
      }
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-6 pb-6">
        <div className="card p-4 mb-4 flex items-center">
          <div className="relative mr-4">
            {photoUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                {profileData.personal.fullName.charAt(0)}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
                <Pencil size={14} />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profileData.personal.fullName}</h2>
            <p className="text-gray-500">Patient ID: #1</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="bg-primary/10 p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-medium">Personal Information</h2>
              {isEditing && (
                <div className="flex gap-2">
                  <button onClick={handleCancel} className="btn btn-sm btn-secondary text-sm">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn btn-sm btn-primary text-sm">
                    <Save size={14} className="mr-1" />
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              {renderField('Full Name', profileData.personal.fullName, <User size={18} />, 'personal', 'fullName')}
              {renderField('Date of Birth', profileData.personal.dateOfBirth, <Calendar size={18} />, 'personal', 'dateOfBirth')}
              {renderField('Email', profileData.personal.email, <Mail size={18} />, 'personal', 'email')}
              {renderField('Phone', profileData.personal.phone, <Phone size={18} />, 'personal', 'phone')}
              {renderField('Address', profileData.personal.address, <MapPin size={18} />, 'personal', 'address')}
            </div>
          </div>
          
          <div className="card overflow-hidden">
            <div className="bg-primary/10 p-4 border-b border-gray-100">
              <h2 className="font-medium">Medical Information</h2>
            </div>
            <div className="p-4">
              {renderField('Blood Type', profileData.medical.bloodType, <span className="text-red-500">🩸</span>, 'medical', 'bloodType')}
              {renderField('Height', profileData.medical.height, <span>📏</span>, 'medical', 'height')}
              {renderField('Weight', profileData.medical.weight, <span>⚖️</span>, 'medical', 'weight')}
              {renderField('Allergies', profileData.medical.allergies, <span>⚠️</span>, 'medical', 'allergies')}
              {renderField('Primary Physician', profileData.medical.primaryPhysician, <span>👨‍⚕️</span>, 'medical', 'primaryPhysician')}
            </div>
          </div>
          
          <div className="card overflow-hidden">
            <div className="bg-primary/10 p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-medium">Emergency Contacts</h2>
              {!isEditing && profileData.emergencyContacts.length < 4 && (
                <button 
                  onClick={handleEdit}
                  className="btn btn-sm btn-primary text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  Add Contact
                </button>
              )}
            </div>
            <div className="p-4">
              {!isEditing ? (
                profileData.emergencyContacts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.emergencyContacts.map(contact => (
                      <div key={contact.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm relative">
                        <div className="font-medium mb-1">{contact.name}</div>
                        <div className="text-sm text-gray-600 mb-1">{contact.relationship}</div>
                        <div className="text-sm mb-1 flex items-center">
                          <Phone size={14} className="mr-1 text-gray-500" />
                          {contact.phone}
                        </div>
                        <div className="text-sm flex items-center">
                          <Mail size={14} className="mr-1 text-gray-500" />
                          {contact.email}
                        </div>
                        <button 
                          onClick={() => handleEmergencyCall(contact.phone)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          aria-label="Emergency call"
                        >
                          <PhoneCall size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Phone size={24} className="mx-auto mb-2 text-gray-400" />
                    <p>No emergency contacts added</p>
                    <button 
                      onClick={handleEdit}
                      className="btn btn-primary mt-4 text-sm"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Emergency Contact
                    </button>
                  </div>
                )
              ) : (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500">{editedData.emergencyContacts.length} of 4 contacts added</p>
                    <button 
                      onClick={addEmergencyContact}
                      className="btn btn-sm btn-primary text-sm"
                      disabled={editedData.emergencyContacts.length >= 4}
                    >
                      <Plus size={14} className="mr-1" />
                      <span>Add Contact</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {editedData.emergencyContacts.map(contact => (
                      <div key={contact.id} className="bg-gray-50 p-4 rounded-lg relative border border-gray-200">
                        <button 
                          onClick={() => setShowDeleteConfirm(contact.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-200 text-red-500"
                          aria-label="Delete contact"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm text-gray-500 block mb-1">Name*</label>
                            <input 
                              type="text" 
                              className="input"
                              value={contact.name}
                              onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                              placeholder="Full Name"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-500 block mb-1">Relationship*</label>
                            <select 
                              className="input"
                              value={contact.relationship}
                              onChange={(e) => handleContactChange(contact.id, 'relationship', e.target.value)}
                              required
                            >
                              <option value="">Select relationship</option>
                              <option value="Spouse">Spouse</option>
                              <option value="Parent">Parent</option>
                              <option value="Child">Child</option>
                              <option value="Sibling">Sibling</option>
                              <option value="Friend">Friend</option>
                              <option value="Caregiver">Caregiver</option>
                              <option value="Doctor">Doctor</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-500 block mb-1">Phone*</label>
                            <input 
                              type="tel" 
                              className="input"
                              value={contact.phone}
                              onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)}
                              placeholder="Phone Number"
                              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                              title="Phone format: 123-456-7890"
                              required
                            />
                            <p className="text-xs text-gray-400 mt-1">Format: 123-456-7890</p>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-500 block mb-1">Email</label>
                            <input 
                              type="email" 
                              className="input"
                              value={contact.email}
                              onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                              placeholder="Email Address"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {editedData.emergencyContacts.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-2">No emergency contacts added yet</p>
                        <button 
                          onClick={addEmergencyContact}
                          className="btn btn-primary text-sm"
                        >
                          <Plus size={16} className="mr-1" />
                          <span>Add Emergency Contact</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="bg-primary/10 p-4 border-b border-gray-100">
            <h2 className="font-medium">Recent Health Metrics</h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Blood Pressure</div>
                <div className="text-xs text-gray-400">Last updated: {profileData.healthMetrics.lastUpdated.bloodPressure}</div>
              </div>
              <div className="text-lg font-medium">{profileData.healthMetrics.bloodPressure}</div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Heart Rate</div>
                <div className="text-xs text-gray-400">Last updated: {profileData.healthMetrics.lastUpdated.heartRate}</div>
              </div>
              <div className="text-lg font-medium">{profileData.healthMetrics.heartRate}</div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Blood Glucose</div>
                <div className="text-xs text-gray-400">Last updated: {profileData.healthMetrics.lastUpdated.bloodGlucose}</div>
              </div>
              <div className="text-lg font-medium">{profileData.healthMetrics.bloodGlucose}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-4">
            <h3 className="text-lg font-bold mb-2">Delete Contact</h3>
            <p className="mb-4">Are you sure you want to delete this emergency contact?</p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => removeEmergencyContact(showDeleteConfirm)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Profile;
