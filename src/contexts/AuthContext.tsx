import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsDemo: (role: 'GP' | 'Specialist') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
  loginAsDemo: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const refreshProfile = async () => {
    if (isDemo) return;
    if (auth.currentUser) {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    }
  };

  const loginAsDemo = (role: 'GP' | 'Specialist') => {
    setIsDemo(true);
    const mockUser = {
      uid: role === 'GP' ? 'demo-gp-id' : 'demo-spec-id',
      displayName: role === 'GP' ? 'Dr. Demo (GP)' : 'Dr. Demo (Specialist)',
      email: 'demo@healthsync.ai',
    } as User;
    
    const mockProfile = {
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: role,
      hospital: 'Demo Medical Center',
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);
  };

  useEffect(() => {
    // Check if we were in demo mode (could use localStorage if we wanted persistence)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isDemo) return;
      
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // Initialize if missing
          const newProfile = {
            uid: user.uid,
            displayName: user.displayName || 'Doctor',
            email: user.email,
            role: 'GP', // Default role
            createdAt: new Date().toISOString(),
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
