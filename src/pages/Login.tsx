import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button, Card } from '../components/UI';
import { Stethoscope, Mail, Lock, User, Hospital, CreditCard, Chrome, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'GP' | 'Specialist'>('GP');
  const [hospital, setHospital] = useState('');

  const { loginAsDemo } = useAuth();

  const handleDemoLogin = (selectedRole: 'GP' | 'Specialist') => {
    loginAsDemo(selectedRole);
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // If it's a new user via Google, we might need more info, 
        // but for now we create a basic profile
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName || 'Doctor',
          email: user.email,
          role: 'GP', // Default role
          hospital: 'Provisional Clinic',
          createdAt: new Date().toISOString(),
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
      // If it's the specific auth/operation-not-allowed, it shouldn't happen for Google 
      // if it was provisioned correctly.
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        // Create Firestore Profile
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: name,
          email,
          role,
          hospital,
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not yet enabled. Please use Google Sign-In or enable it in the Firebase Console.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-blue-500/20">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">HealthSync</h1>
          <p className="text-slate-500 mt-2 font-medium">The Medical-Dental Referral Ecosystem</p>
        </div>

        <Card className="p-8 bg-[#161B22] border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            {isSignUp ? 'Create your professional account' : 'Welcome back, Doctor'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Healthcare Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('GP')}
                      className={`py-2 px-4 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
                        role === 'GP' 
                          ? 'border-blue-600 bg-blue-600/10 text-blue-400' 
                          : 'border-white/5 bg-[#0D1117] text-slate-500'
                      }`}
                    >
                      General Physician
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('Specialist')}
                      className={`py-2 px-4 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
                        role === 'Specialist' 
                          ? 'border-blue-600 bg-blue-600/10 text-blue-400' 
                          : 'border-white/5 bg-[#0D1117] text-slate-500'
                      }`}
                    >
                      Specialist
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Hospital / Clinic</label>
                  <div className="relative">
                    <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                      placeholder="Westside Medical Center"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Professional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                  placeholder="jane.smith@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-200 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 italic">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-11" isLoading={loading}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="px-2 bg-[#161B22] text-slate-500">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              className="w-full h-11 flex gap-2 items-center justify-center border-white/10 hover:bg-white/5"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Chrome size={16} />
              Professional Google Login
            </Button>

            <div className="relative my-6 mt-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-blue-500/10"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-blue-500/50">
                <span className="px-2 bg-[#161B22]">System Demo Access</span>
              </div>
            </div>

            <div className="mt-10">
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full h-12 border-blue-500/10 hover:border-blue-500/30 text-blue-400"
                onClick={() => handleDemoLogin('GP')}
              >
                <Zap size={14} className="mr-2 fill-blue-400" />
                Access Full GP Dashboard Demo
              </Button>
              <p className="text-[10px] text-slate-600 text-center mt-3 font-medium italic uppercase tracking-wider">
                Specialist direct contact & WhatsApp messaging enabled in-app
              </p>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-600 font-bold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
