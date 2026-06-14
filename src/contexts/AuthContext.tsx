/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserSettings } from '../types';

interface UserProfile extends UserSettings {
  id: string;
  email: string;
  role: 'athlete' | 'coach';
  name: string;
  coachId?: string;
  inviteCode?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch and listen to profile
        const profileRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({
              id: docSnap.id,
              ...docSnap.data()
            } as UserProfile);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        }, (err) => {
          console.error("Profile listen error:", err);
          setLoading(false);
        });

        return () => {
          unsubscribeProfile();
        };
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  const reloadProfile = async () => {
    if (!currentUser) return;
    const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
    if (docSnap.exists()) {
      setUserProfile({
        id: docSnap.id,
        ...docSnap.data()
      } as UserProfile);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    logout,
    reloadProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
