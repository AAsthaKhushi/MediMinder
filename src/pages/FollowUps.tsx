import { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Calendar, Clipboard, Download, FileUp, Paperclip, Plus, UserPlus } from 'lucide-react';
import { followUps } from '../data/mockData';

const FollowUps = () => {
  const [activeTab, setActiveTab] = useState('lab');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'lab' | 'visit' | 'procedure' | 'attachment' | 'report'>('lab');
  
  const handleUpload = (type: 'lab' | 'visit' | 'procedure' | 'attachment' | 'report') => {
    setUploadType(type);
    setShowUploadModal(true);
  };
  
  return (
    <PageContainer 
      title="Follow-Ups" 
      actionButton={
        <button className="btn btn-primary text-sm" onClick={() => handleUpload('report')}>
          <Plus size={16} />
          <span>Add New</span>
        </button>
      }
    >
      <div className="mb-4 overflow-x-auto -mx-4 px-4">
        <div className="flex space-x-2 w-max min-w-full">
          <button
            className={`tab flex items-center gap-1 ${activeTab === 'lab' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('lab')}
          >
            <Clipboard size={16} />
            <span>Lab Work & Reports</span>
          </button>
          
          <button
            className={`tab flex items-center gap-1 ${activeTab === 'doctor' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('doctor')}
          >
            <UserPlus size={16} />
            <span>Doctor Visits</span>
          </button>
          
          <button
            className={`tab flex items-center gap-1 ${activeTab === 'procedures' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('procedures')}
          >
            <Clipboard size={16} />
            <span>Procedures</span>
          </button>
          
          <button
            className={`tab flex items-center gap-1 ${activeTab === 'attachments' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('attachments')}
          >
            <Paperclip size={16} />
            <span>Attachments</span>
          </button>
        </div>
      </div>
      
      {activeTab === 'lab' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Lab Work & Reports</h2>
            <button 
              className="btn btn-secondary text-xs px-2 py-1"
              onClick={() => handleUpload('lab')}
            >
              <Plus size={14} />
              <span>Add Lab Report</span>
            </button>
          </div>
          
          {followUps
            .filter(item => item.type === 'lab' || !item.type)
            .map((item, index) => (
            <div key={index} className="card mb-3 last:mb-0">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className={`status-badge ${
                    item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    item.status === 'Rescheduled' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                
                {item.reportUrl && (
                  <button className="btn btn-secondary text-sm">
                    <Download size={14} />
                    <span>View Report (PDF)</span>
                  </button>
                )}
                
                {!item.reportUrl && (
                  <div className="text-sm text-gray-500">No report yet</div>
                )}
                
                {item.doctorRemarks && (
                  <div className="mt-3 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="font-medium mb-1">Doctor Remarks:</div>
                    <p>{item.doctorRemarks}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'doctor' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Doctor & Specialist Visits</h2>
            <button 
              className="btn btn-secondary text-xs px-2 py-1"
              onClick={() => handleUpload('visit')}
            >
              <Plus size={14} />
              <span>Add Visit</span>
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="card">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Cardiologist Follow-up</h3>
                  <div className="status-badge bg-yellow-100 text-yellow-800">
                    Scheduled
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar size={14} />
                  <span>May 25, 2025 - 10:00 AM</span>
                </div>
                
                <div className="text-sm text-gray-500 mb-3">
                  Dr. John Doe - Heart Center Medical Group
                </div>
                
                <div className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-medium mb-1">Purpose:</div>
                  <p>Review medication efficacy and blood pressure trends</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Primary Care Checkup</h3>
                  <div className="status-badge bg-green-100 text-green-800">
                    Completed
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar size={14} />
                  <span>May 5, 2025 - 9:30 AM</span>
                </div>
                
                <div className="text-sm text-gray-500 mb-3">
                  Dr. Sarah Smith - Family Medicine
                </div>
                
                <div className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-medium mb-1">Notes:</div>
                  <p>General health is stable. Continue current medication regimen. Follow up in 3 months.</p>
                </div>
                
                <button className="btn btn-secondary text-sm mt-3">
                  <Download size={14} />
                  <span>View Summary Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'procedures' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Procedures & Follow-up Actions</h2>
            <button 
              className="btn btn-secondary text-xs px-2 py-1"
              onClick={() => handleUpload('procedure')}
            >
              <Plus size={14} />
              <span>Add Procedure</span>
            </button>
          </div>
          
          <div className="card">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Echocardiogram</h3>
                <div className="status-badge bg-green-100 text-green-800">
                  Completed
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <Calendar size={14} />
                <span>April 15, 2025</span>
              </div>
              
              <div className="text-sm text-gray-500 mb-3">
                Heart Center Medical Group - Dr. Williams
              </div>
              
              <div className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                <div className="font-medium mb-1">Results:</div>
                <p>Normal cardiac function. Ejection fraction 60%. No significant abnormalities.</p>
              </div>
              
              <button className="btn btn-secondary text-sm">
                <Download size={14} />
                <span>View Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'attachments' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Attachments & Notes</h2>
            <button 
              className="btn btn-secondary text-xs px-2 py-1"
              onClick={() => handleUpload('attachment')}
            >
              <Plus size={14} />
              <span>Add Attachment</span>
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                  <Paperclip size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Medication List - Mayo Clinic</h3>
                  <div className="text-sm text-gray-500 mb-2">PDF document - May 1, 2025</div>
                  <button className="btn btn-secondary text-sm">
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Health Journal</h3>
                  <div className="text-sm text-gray-500 mb-2">Daily tracking of symptoms - Last updated: May 20, 2025</div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                    <p>Feeling generally well. Minor headache in the afternoon that resolved after rest.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Doctor Remarks</h2>
        <textarea 
          className="input h-24"
          placeholder="Add remarks..."
        ></textarea>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4">
            <h2 className="text-lg font-bold mb-4">
              {uploadType === 'lab' ? 'Add Lab Report' : 
               uploadType === 'visit' ? 'Add Doctor Visit' :
               uploadType === 'procedure' ? 'Add Procedure' :
               uploadType === 'attachment' ? 'Add Attachment' : 'Add Entry'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Title*</label>
                <input type="text" className="input" placeholder="e.g., Blood Work, MRI, etc." />
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Date*</label>
                <input type="date" className="input" />
              </div>
              
              {(uploadType === 'visit' || uploadType === 'procedure') && (
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Doctor/Provider</label>
                  <input type="text" className="input" placeholder="e.g., Dr. John Doe" />
                </div>
              )}
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Status</label>
                <select className="input">
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Notes/Description</label>
                <textarea className="input h-24" placeholder="Add details about this entry..."></textarea>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Upload File (optional)</label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileUp className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop a file or click to select</p>
                  <input type="file" className="hidden" />
                  <button className="btn btn-secondary text-sm mt-2">Select File</button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowUploadModal(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default FollowUps;
