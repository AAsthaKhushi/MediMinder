// Mock data for the application

interface Medication {
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
  allergies?: string;
}

// Get stored medications if any
const storedMedications = localStorage.getItem('medications');
const initialMedications = storedMedications ? JSON.parse(storedMedications) : [
  {
    id: 1,
    name: "Amlodipine",
    dosage: "5mg",
    instruction: "Take 1 tablet",
    activeIngredient: "Amlodipine",
    timing: "Morning, 08:05 AM",
    doctor: "Dr. John Doe, Cardiologist",
    startDate: "Jan 1, 2024",
    condition: "Hypertension",
    details: "Take 1 tablet daily in the morning after breakfast",
    sideEffects: "Dizziness, Headache",
    warnings: "Avoid alcohol",
    allergies: "None known"
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    instruction: "Take 1 tablet",
    activeIngredient: "Lisinopril",
    timing: "Morning, 07:30 AM",
    doctor: "Dr. John Doe, Cardiologist",
    startDate: "Jan 1, 2024",
    condition: "Hypertension",
    details: "Take 1 tablet daily in the morning before breakfast",
    sideEffects: "Dry cough, Dizziness",
    warnings: "May cause drowsiness"
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "500mg",
    instruction: "Take 1 tablet",
    activeIngredient: "Metformin hydrochloride",
    timing: "Afternoon, 01:30 PM",
    doctor: "Dr. Jane Smith, Endocrinologist",
    startDate: "Feb 15, 2024",
    condition: "Type 2 Diabetes",
    details: "Take 1 tablet daily with lunch",
    sideEffects: "Nausea, Stomach upset",
    warnings: "Take with food to minimize stomach upset"
  },
  {
    id: 4,
    name: "Atorvastatin",
    dosage: "20mg",
    instruction: "Take 1 tablet",
    activeIngredient: "Atorvastatin calcium",
    timing: "Evening, 08:00 PM",
    doctor: "Dr. John Doe, Cardiologist",
    startDate: "Jan 10, 2024",
    condition: "High Cholesterol",
    details: "Take 1 tablet in the evening",
    sideEffects: "Muscle pain, Headache",
    warnings: "Avoid grapefruit juice"
  },
  {
    id: 5,
    name: "Aspirin",
    dosage: "81mg",
    instruction: "Take 1 tablet",
    activeIngredient: "Acetylsalicylic acid",
    timing: "Morning, 08:05 AM",
    doctor: "Dr. John Doe, Cardiologist",
    startDate: "Jan 1, 2024",
    condition: "Heart disease prevention",
    details: "Take 1 tablet daily with breakfast",
    sideEffects: "Stomach upset, Indigestion",
    warnings: "May increase risk of bleeding"
  }
];

// Initialize medications with stored data if available and export it
export let medications: Medication[] = initialMedications;

// Add medication function
export const addMedication = (newMed: Medication) => {
  medications = [...medications, newMed];
  
  // Update local storage
  localStorage.setItem('medications', JSON.stringify(medications));
  
  // Also update today's medications
  updateTodayMedications();
  
  return newMed;
};

// Update today's medications based on the full medication list
export const updateTodayMedications = () => {
  // Create medication entries for today based on the full med list
  const updatedTodayMeds = medications.map((med: Medication) => {
    // Extract time from timing string, defaults to "08:00 AM" if not found
    const timeMatch = med.timing.match(/\d{1,2}:\d{2}\s*[APap][Mm]/);
    const timeStr = timeMatch ? timeMatch[0] : "08:00 AM";
    
    // Determine period from timing string
    const periodMatch = med.timing.match(/Morning|Afternoon|Evening/i);
    const period = periodMatch ? periodMatch[0] : "Morning";
    
    return {
      id: med.id,
      name: med.name,
      dosage: med.dosage,
      instruction: med.instruction,
      time: timeStr,
      period: period,
      taken: false
    };
  });
  
  todayMedications.splice(0, todayMedications.length, ...updatedTodayMeds);
  return todayMedications;
};

// Today's medications
export let todayMedications = [
  {
    id: 1,
    name: "Amlodipine",
    dosage: "5mg",
    instruction: "Take 1 tablet",
    time: "08:05 AM",
    period: "Morning",
    taken: true
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    instruction: "Take 1 tablet",
    time: "07:30 AM",
    period: "Morning",
    taken: true
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "500mg",
    instruction: "Take 1 tablet",
    time: "01:30 PM",
    period: "Afternoon",
    taken: false
  },
  {
    id: 4,
    name: "Atorvastatin",
    dosage: "20mg",
    instruction: "Take 1 tablet",
    time: "08:00 PM",
    period: "Evening",
    taken: false
  }
];

// Follow-ups data
export const followUps = [
  {
    id: 1,
    title: "Bloodwork",
    date: "2024-04-10",
    status: "Completed",
    reportUrl: "/reports/bloodwork-04-10.pdf",
    type: "lab",
    doctorRemarks: "All values within normal range. Continue current medication."
  },
  {
    id: 2,
    title: "MRI Brain",
    date: "2024-05-01",
    status: "Pending",
    reportUrl: null,
    type: "lab"
  },
  {
    id: 3,
    title: "Cardiology Consultation",
    date: "2024-05-15",
    status: "Scheduled",
    reportUrl: null,
    type: "doctor",
    doctorName: "Dr. Robert Williams",
    location: "Heart Center Medical Group"
  },
  {
    id: 4,
    title: "Echocardiogram",
    date: "2024-04-20",
    status: "Completed",
    reportUrl: "/reports/echo-04-20.pdf",
    type: "procedure",
    doctorRemarks: "Normal cardiac function. Follow up in 6 months."
  }
];

// Progress data
export const progressData = {
  weekAdherence: 92,
  currentStreak: 14,
  perfectWeeks: 3,
  medications: [
    {
      name: "Amlodipine 5mg",
      adherence: 100
    },
    {
      name: "Lisinopril 10mg",
      adherence: 100
    },
    {
      name: "Metformin 500mg",
      adherence: 85
    },
    {
      name: "Atorvastatin 20mg",
      adherence: 70
    }
  ],
  timeOfDay: [
    {
      period: "Morning",
      adherence: 100
    },
    {
      period: "Afternoon",
      adherence: 85
    },
    {
      period: "Evening",
      adherence: 70
    }
  ]
};

// Timeline event data
export const timelineEvents = [
  {
    id: 1,
    title: "Amlodipine",
    description: "Take 1 tablet (5mg) with water",
    time: "08:00",
    date: "2025-05-20",
    category: "medication",
    status: "completed",
    details: "Blood pressure medication. Take with or without food."
  },
  {
    id: 2,
    title: "Lisinopril",
    description: "Take 1 tablet (10mg) with breakfast",
    time: "08:30",
    date: "2025-05-20",
    category: "medication",
    status: "completed",
    details: "ACE inhibitor for blood pressure. Take consistently at the same time each day."
  },
  {
    id: 3,
    title: "Check Blood Pressure",
    description: "Measure and record your blood pressure",
    time: "09:15",
    date: "2025-05-20",
    category: "monitoring",
    status: "completed",
    details: "Target: <130/80 mmHg. Rest 5 minutes before measuring."
  },
  {
    id: 4,
    title: "Metformin",
    description: "Take 1 tablet (500mg) with lunch",
    time: "13:00",
    date: "2025-05-20",
    category: "medication",
    status: "upcoming",
    details: "Diabetes medication. Take with food to reduce stomach upset."
  },
  {
    id: 5,
    title: "Cardiology Appointment",
    description: "Dr. Williams - Heart Center Medical Group",
    time: "15:30",
    date: "2025-05-20",
    category: "appointment",
    status: "upcoming",
    details: "Bring medication list, recent lab results, and blood pressure log."
  },
  {
    id: 6,
    title: "Check Blood Sugar",
    description: "Measure and record your glucose levels",
    time: "17:45",
    date: "2025-05-20",
    category: "monitoring",
    status: "upcoming",
    details: "Target before dinner: 70-130 mg/dL. Wash hands before testing."
  },
  {
    id: 7,
    title: "Atorvastatin",
    description: "Take 1 tablet (20mg) after dinner",
    time: "20:00",
    date: "2025-05-20",
    category: "medication",
    status: "upcoming",
    details: "Cholesterol medication. Most effective when taken in the evening."
  },
  {
    id: 8,
    title: "Aspirin",
    description: "Take 1 tablet (81mg) before sleep",
    time: "22:00",
    date: "2025-05-20",
    category: "medication",
    status: "upcoming",
    details: "Low-dose for heart attack prevention. Take with water."
  },
  {
    id: 9,
    title: "Weight Check",
    description: "Record your weight",
    time: "07:30",
    date: "2025-05-20",
    category: "monitoring",
    status: "missed",
    details: "Measure in the morning after using the bathroom and before eating."
  },
  {
    id: 10,
    title: "Physical Therapy Exercises",
    description: "Complete knee strengthening routine",
    time: "10:30",
    date: "2025-05-20",
    category: "monitoring",
    status: "snoozed",
    details: "15 minutes of prescribed exercises. Don't skip stretching."
  }
];

// Diagnoses data
export const diagnoses = [
  {
    condition: "Hypertension",
    diagnosedDate: "2021-02-15",
    stage: "Stage 1, Stable",
    linkedMedications: ["Amlodipine", "Lisinopril"]
  },
  {
    condition: "COPD",
    diagnosedDate: "2019-08-10",
    stage: "Moderate, Stable",
    linkedMedications: ["Salbutamol"]
  }
];
