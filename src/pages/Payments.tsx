import { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { CircleAlert, Banknote, Building2, Calendar, Check, ChevronDown, ChevronUp, Clipboard, Clock, CreditCard, DollarSign, Download, FileText, ShieldCheck, Upload, UserCheck, Wallet } from 'lucide-react';

const Payments = () => {
  const [expandedSection, setExpandedSection] = useState('charges');
  const [insuranceProvider, setInsuranceProvider] = useState('Apollo Insurance');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [consentChecked, setConsentChecked] = useState(false);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection('');
    } else {
      setExpandedSection(section);
    }
  };
  
  const chargesData = [
    { description: 'Specialist Consultation', date: 'May 15, 2025', amount: 150 },
    { description: 'Blood Work Panel', date: 'May 15, 2025', amount: 220 },
    { description: 'ECG Test', date: 'May 15, 2025', amount: 85 },
    { description: 'Pharmacy - Prescription Medications', date: 'May 15, 2025', amount: 175 },
    { description: 'Follow-up Telemed Consultation', date: 'May 18, 2025', amount: 75 },
    { description: 'Room Charges (Semi-private)', date: 'May 15, 2025', amount: 350 },
    { description: 'Nursing Care', date: 'May 15, 2025', amount: 120 }
  ];
  
  const totalAmount = chargesData.reduce((sum, item) => sum + item.amount, 0);
  const eligibleForClaim = totalAmount * 0.85; // 85% of total is eligible
  const patientPayable = totalAmount - eligibleForClaim; // remaining is patient responsibility
  
  return (
    <PageContainer title="Hospital Billing & Payments">
      <div className="mb-4 card p-4 bg-primary/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="font-medium text-lg">Patient ID: MED-2025-1234</h2>
            <p className="text-sm text-gray-600">Visit Date: May 15, 2025</p>
            <p className="text-sm text-gray-600">Appointment #: APP-05152025</p>
          </div>
          <div className="mt-2 md:mt-0 flex items-center gap-2">
            <span className="text-sm text-gray-700 hidden md:inline">Status:</span>
            <div className="pill-indicator bg-success text-white">Discharged</div>
            <button className="btn btn-secondary text-xs">
              <span>Need Help?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Billing Summary Section */}
      <div className="card overflow-hidden mb-4">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleSection('charges')}
        >
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            <h2 className="font-medium">Billing Summary</h2>
          </div>
          {expandedSection === 'charges' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSection === 'charges' && (
          <div className="border-t border-gray-100 p-4">
            <div className="mb-3 flex justify-between items-center">
              <div className="text-sm text-gray-600">Invoice #INV-2025-7841</div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Generated on May 18, 2025</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Description</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {chargesData.map((item, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="px-3 py-3">{item.description}</td>
                      <td className="px-3 py-3">{item.date}</td>
                      <td className="px-3 py-3 text-right">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td colSpan={2} className="px-3 py-3 text-right">Total Hospital Bill:</td>
                    <td className="px-3 py-3 text-right">${totalAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="text-primary">
                    <td colSpan={2} className="px-3 py-3 text-right">Amount Eligible for Mediclaim:</td>
                    <td className="px-3 py-3 text-right">${eligibleForClaim.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={2} className="px-3 py-3 text-right">Amount Payable by Patient:</td>
                    <td className="px-3 py-3 text-right">${patientPayable.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="btn btn-secondary text-xs flex items-center gap-1">
                <Clipboard size={14} />
                <span>View Detailed Bill</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Section */}
      <div className="card overflow-hidden mb-4">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleSection('insurance')}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" />
            <h2 className="font-medium">Insurance (Mediclaim)</h2>
          </div>
          {expandedSection === 'insurance' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSection === 'insurance' && (
          <div className="border-t border-gray-100 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Insurance Provider</label>
                <select 
                  className="input"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                >
                  <option value="Apollo Insurance">Apollo Insurance</option>
                  <option value="Medicare Plus">Medicare Plus</option>
                  <option value="Health Assure">Health Assure</option>
                  <option value="National Health">National Health</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Policy Number</label>
                <input type="text" className="input" defaultValue="POL-8547123" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Claim ID</label>
                <input type="text" className="input" defaultValue="CLM-2025-7890" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">TPA (Third Party Administrator)</label>
                <input type="text" className="input" defaultValue="Health Assist Services" />
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <div className="flex flex-col md:flex-row justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-500">Claim Status</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="pill-indicator bg-warning text-white">In Process</div>
                    <span className="text-sm text-gray-600">Submitted on May 16, 2025</span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0">
                  <div className="text-sm text-gray-500">Estimated Reimbursement Time</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={16} className="text-gray-500" />
                    <div className="font-medium">7-10 business days</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="text-sm text-gray-500">Amount Eligible for Claim</div>
                  <div className="text-xl font-bold text-primary">${eligibleForClaim.toFixed(2)}</div>
                </div>
                <div className="mt-3 md:mt-0">
                  <div className="text-sm text-gray-500">Documents Verified</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Check size={16} className="text-green-500" />
                    <span className="font-medium">3 of 4 documents verified</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Claim Progress</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-light">
                      In Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">
                      60%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-light">
                  <div style={{ width: "60%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Submitted</span>
                  <span>Documentation</span>
                  <span>Verification</span>
                  <span>Approval</span>
                  <span>Processed</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary text-sm">
                <Upload size={16} />
                <span>Upload Documents</span>
              </button>
              <button className="btn btn-secondary text-sm">
                <ShieldCheck size={16} />
                <span>Track Claim Status</span>
              </button>
              <button className="btn btn-secondary text-sm">
                <CircleAlert size={16} />
                <span>Report Issue</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div className="card overflow-hidden mb-4">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleSection('payment')}
        >
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-primary" />
            <h2 className="font-medium">Payment Options</h2>
          </div>
          {expandedSection === 'payment' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSection === 'payment' && (
          <div className="border-t border-gray-100 p-4">
            <div className="mb-4">
              <div className="text-lg font-medium mb-2">Amount to Pay: <span className="text-primary">${patientPayable.toFixed(2)}</span></div>
              <p className="text-sm text-gray-500">Select your preferred payment method below</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <button 
                className={`p-4 rounded-lg border text-center flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={24} className={paymentMethod === 'card' ? 'text-primary' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-primary' : 'text-gray-700'}`}>Credit/Debit Card</span>
              </button>
              
              <button 
                className={`p-4 rounded-lg border text-center flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <span className={`text-lg ${paymentMethod === 'upi' ? 'text-primary' : 'text-gray-500'}`}>UPI</span>
                <span className={`text-sm font-medium ${paymentMethod === 'upi' ? 'text-primary' : 'text-gray-700'}`}>UPI Payment</span>
              </button>
              
              <button 
                className={`p-4 rounded-lg border text-center flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
                onClick={() => setPaymentMethod('bank')}
              >
                <Building2 size={24} className={paymentMethod === 'bank' ? 'text-primary' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${paymentMethod === 'bank' ? 'text-primary' : 'text-gray-700'}`}>Net Banking</span>
              </button>
              
              <button 
                className={`p-4 rounded-lg border text-center flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <Banknote size={24} className={paymentMethod === 'wallet' ? 'text-primary' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${paymentMethod === 'wallet' ? 'text-primary' : 'text-gray-700'}`}>Wallets</span>
              </button>
              
              <button 
                className={`p-4 rounded-lg border text-center flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'emi' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
                onClick={() => setPaymentMethod('emi')}
              >
                <DollarSign size={24} className={paymentMethod === 'emi' ? 'text-primary' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${paymentMethod === 'emi' ? 'text-primary' : 'text-gray-700'}`}>EMI Option</span>
              </button>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Card Number</label>
                    <input type="text" className="input" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Cardholder Name</label>
                    <input type="text" className="input" placeholder="Name on card" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Expiry Date</label>
                    <input type="text" className="input" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">CVV</label>
                    <input type="text" className="input" placeholder="XXX" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>
            )}
            
            {paymentMethod === 'upi' && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="border-4 border-gray-200 p-3 rounded-lg mb-4 inline-block">
                    <div className="bg-white p-2 rounded border">
                      <img src="https://mocha-cdn.com/0196eeee-51b7-7201-891b-c9955c90da63/image.png_1909.png" alt="Sample QR Code" className="w-48 h-48 mx-auto" />
                    </div>
                  </div>
                  <p className="text-sm mb-2">Scan with any UPI app to pay</p>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">UPI ID</div>
                    <div className="font-medium">hospital@ybl</div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-sm text-center">
                    Enter Ref No: <span className="font-bold">MED-2025-1234</span> in remarks
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <div className="bg-primary/5 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Payment Summary</div>
                  <div className="text-sm text-gray-600">INV-2025-7841</div>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm text-gray-600">Hospital Bill</div>
                  <div className="font-medium">${totalAmount.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm text-gray-600">Insurance Coverage</div>
                  <div className="font-medium">-${eligibleForClaim.toFixed(2)}</div>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <div className="font-medium">Amount to Pay</div>
                  <div className="font-bold text-primary">${patientPayable.toFixed(2)}</div>
                </div>
              </div>
              
              <label className="flex items-start gap-2 mb-3">
                <input 
                  type="checkbox" 
                  className="mt-1"
                  checked={consentChecked}
                  onChange={() => setConsentChecked(!consentChecked)}
                />
                <span className="text-sm text-gray-600">
                  I confirm that the above details are accurate and agree to the hospital's payment and refund policy.
                  <a href="#" className="text-primary ml-1">View terms</a>
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-gray-600">Send receipt to my email and mobile number</span>
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button className="btn btn-secondary text-sm w-full sm:w-auto">
                <Download size={16} />
                <span>Download Invoice</span>
              </button>
              
              <button 
                className="btn btn-primary text-sm w-full sm:w-auto"
                disabled={!consentChecked}
              >
                <Check size={16} />
                <span>Pay ${patientPayable.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Notifications Section */}
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <UserCheck size={20} className="text-primary" />
          <h2 className="font-medium">Notifications & Updates</h2>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800 flex items-start gap-2">
            <Check size={16} className="mt-0.5" />
            <div>
              <p className="font-medium mb-0.5">Documents Verified</p>
              <p>Your discharge summary and bill have been verified by the insurance provider.</p>
              <p className="text-xs text-gray-600 mt-1">May 17, 2025 • 14:23</p>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-2">
            <Calendar size={16} className="mt-0.5" />
            <div>
              <p className="font-medium mb-0.5">Claim Processing Update</p>
              <p>Your claim is under review. We'll notify you when the status changes.</p>
              <p className="text-xs text-gray-600 mt-1">May 16, 2025 • 09:45</p>
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
            <CircleAlert size={16} className="mt-0.5" />
            <div>
              <p className="font-medium mb-0.5">Additional Document Requested</p>
              <p>Please upload your prescription details for the pharmacy charges.</p>
              <p className="text-xs text-gray-600 mt-1">May 16, 2025 • 11:05</p>
              <button className="mt-2 text-xs bg-white border border-yellow-200 px-3 py-1 rounded-full text-yellow-700 hover:bg-yellow-50">
                Upload Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help & Support */}
      <div className="card p-4 mb-16">
        <div className="flex items-center gap-2 mb-3">
          <CircleAlert size={20} className="text-primary" />
          <h2 className="font-medium">Help & Support</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          Need assistance with your billing or payment? Our support team is here to help.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-secondary text-xs">
            <span>Chat with Support</span>
          </button>
          <button className="btn btn-secondary text-xs">
            <span>Call Billing Desk</span>
          </button>
          <button className="btn btn-secondary text-xs">
            <span>Email Support</span>
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Payments;
