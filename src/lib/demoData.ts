export const MOCK_SPECIALISTS = [
  {
    id: 'demo-spec-id',
    displayName: 'Dr. Kesiraju Hemanth',
    role: 'Specialist',
    specialty: 'Oral & Maxillofacial Surgeon',
    hospital: 'Metropolitan Dental Institute',
    email: 'hemanth.specialist@healthsync.ai',
    phone: '9177227514'
  },
  {
    id: 'demo-spec-2',
    displayName: 'Dr. James Ortho',
    role: 'Specialist',
    specialty: 'Orthodontist',
    hospital: 'City Orthodontics',
    email: 'james.ortho@demo.com',
    phone: '+1098765432'
  },
  {
    id: 'demo-spec-3',
    displayName: 'Dr. Priya Sharma',
    role: 'Specialist',
    specialty: 'Endodontist',
    hospital: 'Apex Dental Care',
    email: 'priya.sharma@apex.com',
    phone: '9123456789'
  },
  {
    id: 'demo-spec-4',
    displayName: 'Dr. Robert Chen',
    role: 'Specialist',
    specialty: 'Periodontist',
    hospital: 'Gum Health Specialists',
    email: 'robert.chen@gumhealth.com',
    phone: '9876543210'
  }
];

export const MOCK_REFERRALS = [
  {
    id: 'demo-1',
    patientName: 'Alex Rivera',
    patientAge: 45,
    condition: 'Possible mandible fracture',
    reason: 'Heavy trauma from bicycle accident. Significant swelling in left jaw area.',
    urgency: 'Emergency',
    category: 'Maxillofacial Trauma',
    status: 'Scheduled',
    fromDoctorId: 'demo-gp-id',
    toDoctorId: 'demo-spec-id',
    createdAt: new Date().toISOString(),
    aiSummary: 'High probability of unilateral mandible fracture. Nerve compression possible.',
    aiUrgencyScore: 92
  },
  {
    id: 'demo-2',
    patientName: 'Sam Taylor',
    patientAge: 62,
    condition: 'Prosthodontic clearance for implant surgery',
    reason: 'Patient requires multiple implants. Systemic review needed due to type 2 diabetes.',
    urgency: 'Routine',
    category: 'Implant Clearance',
    status: 'Treatment Started',
    fromDoctorId: 'demo-gp-id',
    toDoctorId: 'demo-spec-id',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aiSummary: 'Glycated hemoglobin within surgical range (6.8). Clearing for implant procedure.',
    aiUrgencyScore: 15
  },
  {
    id: 'demo-3',
    patientName: 'Sarah Jenkins',
    patientAge: 28,
    condition: 'Wisdom teeth impaction affecting sinus',
    reason: 'Severe pain radiating to sinus. Possible odontogenic sinusitis.',
    urgency: 'Urgent',
    category: 'Dental-Systemic Issues',
    status: 'Completed',
    fromDoctorId: 'demo-gp-id',
    toDoctorId: 'demo-spec-id',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    aiSummary: 'Left upper 3rd molar impacting maxillary sinus floor. Procedure successful.',
    aiUrgencyScore: 78
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'demo-gp-id',
    message: 'Dr. Specialist scheduled a consultation for Alex Rivera.',
    type: 'StatusUpdate',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    userId: 'demo-gp-id',
    message: 'New clinical summary generated for Sam Taylor.',
    type: 'DocumentShared',
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];
