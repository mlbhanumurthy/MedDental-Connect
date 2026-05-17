import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Badge } from '../components/UI';
import { 
  ClipboardPlus, 
  Search, 
  User, 
  Calendar, 
  Stethoscope, 
  AlertTriangle,
  Zap,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MOCK_SPECIALISTS } from '../lib/demoData';

const CATEGORIES = [
  "Implant Clearance",
  "Maxillofacial Trauma",
  "Dental-Systemic Issues",
  "Prosthodontic Rehabilitation"
];

const URGENCY_LEVELS = ["Routine", "Urgent", "Emergency"];

export default function ReferralPortal() {
  const { user, profile } = useAuth();
  const isDemo = user?.uid.startsWith('demo-');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    condition: '',
    reason: '',
    urgency: 'Routine',
    category: CATEGORIES[0],
    notes: '',
    toDoctorId: '',
  });

  useEffect(() => {
    const fetchSpecialists = async () => {
      if (isDemo) {
        setSpecialists(MOCK_SPECIALISTS);
        if (MOCK_SPECIALISTS.length > 0) setFormData(prev => ({ ...prev, toDoctorId: MOCK_SPECIALISTS[0].id }));
        return;
      }
      const q = query(collection(db, 'users'), where('role', '==', 'Specialist'));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpecialists(list);
      if (list.length > 0) setFormData(prev => ({ ...prev, toDoctorId: list[0].id }));
    };
    fetchSpecialists();
  }, [isDemo]);

  const handleAiAnalysis = async () => {
    if (!formData.condition) return alert("Please enter a medical condition first.");
    setAiAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patientData: {
            name: formData.patientName,
            age: formData.patientAge,
            condition: formData.condition,
            notes: formData.notes,
            category: formData.category
          }
        })
      });
      const data = await response.json();
      setAiResults(data);
      // Automatically set urgency if high score
      if (data.urgencyScore > 80) setFormData(prev => ({ ...prev, urgency: 'Emergency' }));
      else if (data.urgencyScore > 50) setFormData(prev => ({ ...prev, urgency: 'Urgent' }));
    } catch (error) {
      console.error(error);
      if (isDemo) {
        setAiResults({
          summary: "AI Analysis (Demo): Potential fracture risk identified based on pain profile and trauma report. Recommended immediate CBCT scan.",
          urgencyScore: 85,
          recommendedSteps: [
            "Initiate immediate clinical consult",
            "Order CBCT mandibular series",
            "Evaluate for nerve impingement"
          ]
        });
        setFormData(prev => ({ ...prev, urgency: 'Emergency' }));
      }
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isDemo) {
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const referralData = {
        ...formData,
        patientAge: parseInt(formData.patientAge),
        fromDoctorId: user?.uid,
        status: 'Submitted',
        aiSummary: aiResults?.summary || '',
        aiUrgencyScore: aiResults?.urgencyScore || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, 'referrals'), referralData);

      // Create notification for specialist
      await addDoc(collection(db, `users/${formData.toDoctorId}/notifications`), {
        referralId: ref.id,
        userId: formData.toDoctorId,
        message: `New referral received from Dr. ${profile?.displayName} for ${formData.patientName}`,
        type: 'NewReferral',
        read: false,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'referrals');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const specialist = specialists.find(s => s.id === formData.toDoctorId);
    
    const generateDetailedWhatsAppMessage = () => {
      const header = `*REFERRAL FROM DR. ${profile?.displayName?.toUpperCase() || 'GP'}* \n\n`;
      const patientInfo = `*Patient:* ${formData.patientName} (${formData.patientAge} yrs)\n`;
      const refInfo = `*Category:* ${formData.category}\n*Urgency:* ${formData.urgency}\n\n`;
      const clinicalInfo = `*Condition:* ${formData.condition}\n`;
      const notesInfo = formData.notes ? `*Medical Notes:* ${formData.notes}\n\n` : '\n';
      const aiInfo = aiResults ? `*AI Clinical Summary:* ${aiResults.summary}\n*Urgency Score:* ${aiResults.urgencyScore}/100\n` : '';
      
      return encodeURIComponent(header + patientInfo + refInfo + clinicalInfo + notesInfo + aiInfo + "\nPlease review the full case on HealthSync AI.");
    };

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/10"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Referral Dispatched Successfully</h2>
        <p className="text-slate-500 mb-10 font-medium leading-relaxed">
          The collaborative care pathway has been established. Clinical data is now accessible by the specialist.
        </p>

        {specialist && (
          <Card className="w-full p-8 bg-[#161B22] border-blue-500/20 mb-10 text-left relative overflow-hidden group">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex gap-5">
                <div className="w-16 h-16 bg-[#0D1117] rounded-2xl flex items-center justify-center text-blue-500 border border-white/5 shadow-inner">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{specialist.displayName}</h3>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">{specialist.specialty}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                      <Mail size={14} className="text-slate-600" />
                      {specialist.email}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                      <MapPin size={14} className="text-slate-600" />
                      {specialist.hospital}
                    </div>
                  </div>
                </div>
              </div>

              {specialist.phone && (
                <div className="flex flex-col gap-3">
                  <a 
                    href={`https://wa.me/${specialist.phone.replace(/[^0-9]/g, '')}?text=${generateDetailedWhatsAppMessage()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 group/wa animate-pulse hover:animate-none"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Full Details
                  </a>
                  <Button variant="ghost" className="text-[10px] h-10 border-white/5 bg-white/5">
                    View Full Profile
                    <ExternalLink size={12} className="ml-2" />
                  </Button>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setSuccess(false)}>New Referral</Button>
          <Button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="p-8 bg-[#161B22] border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20">
              <ClipboardPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Patient Referral Form</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Initiate a formal collaborative care pathway</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Patient Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                    placeholder="Patient name"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="number"
                    required
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                    placeholder="e.g. 45"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Referral Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none appearance-none text-slate-200 text-sm"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0D1117]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Urgency Level</label>
                <div className="flex gap-2">
                  {URGENCY_LEVELS.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: u })}
                      className={`flex-1 py-1.5 px-1 rounded-lg border font-bold text-[10px] uppercase tracking-widest transition-all ${
                        formData.urgency === u 
                          ? u === 'Routine' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
                            u === 'Urgent' ? 'border-amber-500 bg-amber-500/10 text-amber-400' :
                            'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-white/5 bg-[#0D1117] text-slate-600'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Medical Condition</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-5 text-slate-500 w-4 h-4" />
                <textarea
                  required
                  rows={3}
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full pl-10 pr-4 py-4 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                  placeholder="Describe the clinical findings..."
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Medical Notes & History</label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[9px] px-2 font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  onClick={handleAiAnalysis}
                  isLoading={aiAnalyzing}
                >
                  <Zap size={10} className="mr-1 fill-blue-400" />
                  AI Analyze
                </Button>
              </div>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-4 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                placeholder="Include previous treatments, medications, etc."
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4 ml-1">Assign to Specialist</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialists.map((spec) => (
                  <div
                    key={spec.id}
                    className={`p-4 rounded-xl border transition-all relative overflow-hidden group/card ${
                      formData.toDoctorId === spec.id 
                        ? 'border-blue-600 bg-blue-600/10' 
                        : 'border-white/5 bg-[#0D1117] hover:border-white/10'
                    }`}
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => setFormData({ ...formData, toDoctorId: spec.id })}
                    >
                      <p className={cn("font-bold text-sm", formData.toDoctorId === spec.id ? "text-white" : "text-slate-300")}>{spec.displayName}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{spec.specialty || 'General Dental Specialist'}</p>
                      <p className="text-[10px] text-blue-500 font-bold mt-1.5">{spec.hospital}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-2">
                        {spec.phone && (
                          <a 
                            href={`https://wa.me/${spec.phone.replace(/[^0-9]/g, '')}?text=Hi ${spec.displayName}, I have a clinical case I'd like to refer.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                            title="Direct WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </a>
                        )}
                        <a 
                          href={`mailto:${spec.email}`}
                          className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
                          title="Send Email"
                        >
                          <Mail size={14} />
                        </a>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, toDoctorId: spec.id })}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-all ${
                          formData.toDoctorId === spec.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                      >
                        {formData.toDoctorId === spec.id ? 'Selected' : 'Assign'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-2xl" isLoading={loading}>
              Dispatch Referral
            </Button>
          </form>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-[#1D1236]/30 border-blue-500/20 text-white relative overflow-hidden backdrop-blur-xl">
          <div className="relative z-10 p-6">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-blue-400">
              <Zap size={16} className="fill-blue-400" />
              Clinical Insight Engine
            </h3>
            <AnimatePresence mode="wait">
              {aiResults ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Automated Synthesis</p>
                    <p className="text-xs leading-relaxed text-slate-300 font-medium italic">"{aiResults.summary}"</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">Clinical Urgency Rating</p>
                    <div className="flex items-end gap-3">
                      <span className="text-5xl font-bold tracking-tighter text-blue-500 leading-none">{aiResults.urgencyScore}</span>
                      <span className="text-[10px] text-slate-600 font-bold mb-1 uppercase">/ 100 Risk Index</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Workflow Intelligence</p>
                    <ul className="space-y-3">
                      {aiResults.recommendedSteps.map((step: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400 font-medium">
                          <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-blue-600" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <Zap size={20} className="text-slate-700" />
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                    Awaiting clinical input<br />for real-time analysis
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl"></div>
        </Card>

        <Card className="p-6 bg-[#161B22] border-white/5">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-[#0D1117] rounded-xl text-blue-500 shadow-lg border border-white/5">
                <AlertTriangle size={20} />
             </div>
             <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Standard Operating Procedure</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Dispatch all diagnostic imaging (CBCT/OPG) via the secure document cache immediately following referral submission.
                </p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
