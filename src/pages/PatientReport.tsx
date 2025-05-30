import { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import { diagnoses } from '../data/mockData';
import html2pdf from 'html2pdf.js';

const PatientReport = () => {
  const [expandedSections, setExpandedSections] = useState({
    diagnoses: true,
    symptoms: false,
    history: false,
    medications: false,
    lifestyle: false,
    family: false
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const downloadPdf = () => {
    const reportElement = document.getElementById('patient-report');
    if (reportElement) {
      // Open all sections for the PDF
      const allSections = Object.fromEntries(
        Object.keys(expandedSections).map(key => [key, true])
      );
      setExpandedSections(allSections as typeof expandedSections);
      
      // Wait for state update to render
      setTimeout(() => {
        const opt = {
          margin: 10,
          filename: 'patient-report.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(reportElement).save();
      }, 300);
    }
  };
  
  return (
    <PageContainer 
      title="Patient Report" 
      actionButton={
        <button className="btn btn-primary text-sm" onClick={downloadPdf}>
          <Download size={16} />
          <span>Download as PDF</span>
        </button>
      }
    >
      <div id="patient-report" className="space-y-3">
        <div className="card overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('diagnoses')}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.56 12.59C4.91 16.83 6.13 19 8 19C8.96 19 9.73 18.54 10.67 17.75C11.39 17.15 12.32 16.43 13.54 16.43C14.43 16.43 15.11 16.83 15.71 17.25C16.34 17.71 16.9 18.18 17.62 18.18C18.77 18.18 19.55 15.39 21.4 12.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.2 9.65001C15.2 11.6667 13.6667 13.2 11.65 13.2C9.64 13.2 8.11 11.6667 8.11 9.65001C8.11 7.64001 9.64 6.10001 11.65 6.10001C13.6667 6.10001 15.2 7.64001 15.2 9.65001Z" stroke="#ef4444" strokeWidth="1.5"/>
              </svg>
              <h2 className="font-medium">Current Diagnoses / Active Conditions</h2>
            </div>
            {expandedSections.diagnoses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.diagnoses && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {diagnoses.map((diagnosis, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{diagnosis.condition}</h3>
                    <div className="status-badge bg-blue-100 text-blue-800">
                      Diagnosed: {diagnosis.diagnosedDate}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{diagnosis.stage}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-sm text-gray-500">Linked Medications: </span>
                    {diagnosis.linkedMedications.map((med, i) => (
                      <span key={i} className="text-sm text-primary font-medium">
                        {med}{i < diagnosis.linkedMedications.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="card overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('symptoms')}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 12H16.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7.5V16.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="font-medium">Symptom History</h2>
            </div>
            {expandedSections.symptoms ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.symptoms && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-gray-500 text-center py-2">No recent symptom entries</p>
            </div>
          )}
        </div>
        
        <div className="card overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('history')}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H8L10 16L14 8L16 12H21" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="font-medium">Past Medical History</h2>
            </div>
            {expandedSections.history ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.history && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="mb-3">
                <h3 className="font-medium mb-1">Previous Conditions</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 pl-1">
                  <li>Appendicitis (2019) - Resolved with appendectomy</li>
                  <li>Childhood Asthma (1995-2005) - Resolved</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Previous Procedures</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 pl-1">
                  <li>Appendectomy (2019)</li>
                  <li>Wisdom teeth extraction (2010)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="card overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('medications')}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 18V6" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 18V14.5" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 12H7" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 9H4.5" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 6H7.5" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 18V9.5" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.5 18V6" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 14H19.5" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 18H19.5" stroke="#2AC9B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="font-medium">Medication History</h2>
            </div>
            {expandedSections.medications ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.medications && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="mb-3">
                <h3 className="font-medium mb-1">Current Medications</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 pl-1">
                  <li>Amlodipine 5mg - Since Jan 1, 2024</li>
                  <li>Lisinopril 10mg - Since Jan 1, 2024</li>
                  <li>Metformin 500mg - Since Feb 15, 2024</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Past Medications</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 pl-1">
                  <li>Amoxicillin 500mg - Oct 2023 (10 day course)</li>
                  <li>Prednisone 10mg - May 2022 (5 day course)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="card overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('lifestyle')}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 20H10.5V14H4.5V20ZM4.5 20V22.5H10.5V20" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 20H19.5V14H13.5V20ZM13.5 20V22.5H19.5V20" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 2L21 6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6.5H6C3.79086 6.5 2 8.29086 2 10.5C2 12.7091 3.79086 14.5 6 14.5H8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12L7 12" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 9H12" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="font-medium">Lifestyle & Risk Factors</h2>
            </div>
            {expandedSections.lifestyle ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.lifestyle && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Exercise</h3>
                  <p className="text-sm text-gray-700">Moderate activity, 3x weekly</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Diet</h3>
                  <p className="text-sm text-gray-700">Low-sodium diet</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Smoking</h3>
                  <p className="text-sm text-gray-700">Non-smoker</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Alcohol</h3>
                  <p className="text-sm text-gray-700">Occasional (1-2 drinks/week)</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="card overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('family')}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 21V19C8 16.7909 9.79086 15 12 15H16.5C17.8807 15 19 16.1193 19 17.5V21" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.25 11C14.25 12.2426 13.2426 13.25 12 13.25C10.7574 13.25 9.75 12.2426 9.75 11C9.75 9.75736 10.7574 8.75 12 8.75C13.2426 8.75 14.25 9.75736 14.25 11Z" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="font-medium">Family Medical History</h2>
            </div>
            {expandedSections.family ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.family && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <ul className="space-y-2">
                <li className="flex">
                  <div className="w-24 text-sm font-medium">Father:</div>
                  <div className="text-sm text-gray-700">Hypertension, Type 2 Diabetes</div>
                </li>
                <li className="flex">
                  <div className="w-24 text-sm font-medium">Mother:</div>
                  <div className="text-sm text-gray-700">No significant history</div>
                </li>
                <li className="flex">
                  <div className="w-24 text-sm font-medium">Siblings:</div>
                  <div className="text-sm text-gray-700">Brother - Asthma</div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default PatientReport;
