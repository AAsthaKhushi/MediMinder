import { useState } from 'react';
import { Users, Plus, Phone, Mail, Heart, Trash2, Edit, AlertCircle, X, Check } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isEmergency: boolean;
  isPrimary: boolean;
  isActive: boolean;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@example.com',
      isEmergency: true,
      isPrimary: true,
      isActive: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      phone: '+1 (555) 987-6543',
      email: 'sarah.j@example.com',
      isEmergency: true,
      isPrimary: false,
      isActive: true
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      relationship: 'Primary Physician',
      phone: '+1 (555) 456-7890',
      email: 'dr.chen@medical.com',
      isEmergency: false,
      isPrimary: false,
      isActive: true
    }
  ]);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [contactToToggle, setContactToToggle] = useState<Contact | null>(null);

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      toast.success(`${contactToDelete.name} has been removed from your contacts`);
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const handleToggleActive = (contact: Contact) => {
    setContactToToggle(contact);
    setShowDeactivateModal(true);
  };

  const confirmToggleActive = () => {
    if (contactToToggle) {
      setContacts(contacts.map(c => 
        c.id === contactToToggle.id 
          ? { ...c, isActive: !c.isActive } 
          : c
      ));
      
      const actionText = contactToToggle.isActive ? 'deactivated' : 'reactivated';
      toast.info(`${contactToToggle.name} has been ${actionText}`);
      setShowDeactivateModal(false);
      setContactToToggle(null);
    }
  };

  const handleEditContact = (contact: Contact) => {
    // In a real app, this would open an edit form
    toast.info(`Edit functionality would open for ${contact.name}`);
  };

  return (
    <PageContainer title="Trusted Contacts">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Users size={20} className="mr-2 text-primary" />
          Manage Your Trusted Contacts
        </h2>
        <p className="text-sm text-gray-600">
          These contacts can access your medication information and receive emergency alerts.
        </p>
      </div>

      {/* Add Contact Button */}
      <button 
        className="w-full mb-4 border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
        onClick={() => toast.info("Add contact functionality would open here")}
      >
        <Plus size={20} className="mr-2" />
        <span className="font-medium">Add New Trusted Contact</span>
      </button>

      {/* Contact List */}
      <div className="space-y-3">
        {contacts.map(contact => (
          <div 
            key={contact.id}
            className={`border rounded-lg overflow-hidden transition-all ${
              contact.isActive 
                ? 'border-gray-200' 
                : 'border-gray-200 bg-gray-50 opacity-75'
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{contact.name}</h3>
                    {contact.isPrimary && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                        Primary
                      </span>
                    )}
                    {contact.isEmergency && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        Emergency
                      </span>
                    )}
                    {!contact.isActive && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{contact.relationship}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditContact(contact)}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    aria-label="Edit contact"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleToggleActive(contact)}
                    className={`p-1.5 rounded-full ${
                      contact.isActive 
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    aria-label={contact.isActive ? "Deactivate contact" : "Activate contact"}
                  >
                    {contact.isActive ? <X size={16} /> : <Check size={16} />}
                  </button>
                  <button 
                    onClick={() => handleDeleteContact(contact)}
                    className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    aria-label="Delete contact"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {contact.isEmergency 
                  ? 'Has emergency access to your medication info' 
                  : 'Limited access to your medication info'}
              </div>
              <button className="text-primary text-sm font-medium">
                Manage Access
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">No trusted contacts added yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Add trusted contacts who can help manage your medications
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => toast.info("Add contact functionality would open here")}
          >
            <Plus size={16} className="mr-1" />
            Add Your First Contact
          </button>
        </div>
      )}

      {/* Emergency Access Info */}
      <div className="mt-6 bg-red-50 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center text-red-700">
          <Heart size={18} className="mr-2" />
          Emergency Access Settings
        </h3>
        <p className="text-sm text-red-700 mb-3">
          Emergency contacts can access your critical medication information in case of emergency.
        </p>
        <div className="bg-white rounded-lg p-3 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Emergency Access is Enabled</p>
              <p className="text-xs text-gray-500 mt-1">
                {contacts.filter(c => c.isEmergency).length} contacts can access your information
              </p>
            </div>
            <button className="text-primary text-sm font-medium">
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contactToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4 animate-scaleIn">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold">Remove Contact</h3>
              <p className="text-gray-600 mt-2">
                Are you sure you want to remove <strong>{contactToDelete.name}</strong> from your trusted contacts? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn btn-danger flex-1"
              >
                Remove Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate/Activate Confirmation Modal */}
      {showDeactivateModal && contactToToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4 animate-scaleIn">
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                contactToToggle.isActive ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                {contactToToggle.isActive 
                  ? <X size={24} className="text-yellow-600" />
                  : <Check size={24} className="text-green-600" />
                }
              </div>
              <h3 className="text-lg font-bold">
                {contactToToggle.isActive ? 'Deactivate Contact' : 'Reactivate Contact'}
              </h3>
              <p className="text-gray-600 mt-2">
                {contactToToggle.isActive 
                  ? `Temporarily deactivate ${contactToToggle.name} without removing them from your contacts?`
                  : `Reactivate ${contactToToggle.name} as a trusted contact?`
                }
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowDeactivateModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={confirmToggleActive}
                className={`flex-1 ${
                  contactToToggle.isActive 
                    ? 'btn btn-warning' 
                    : 'btn btn-success'
                }`}
              >
                {contactToToggle.isActive ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Contacts;
