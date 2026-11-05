import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../services/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { useStoreSettings } from './StoreSettingsContext';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const { coinSettings } = useStoreSettings();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem('karishma_customer_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const welcomeCoins = Number(coinSettings?.welcomeCoins) || 50;

  // Real-time Firebase Auth listener
  useEffect(() => {
    let unsubSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        unsubSnapshot = onSnapshot(userRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const validCoins = (data.coins !== undefined && data.coins !== null && !isNaN(Number(data.coins)))
              ? Math.max(0, Number(data.coins))
              : welcomeCoins;

            const normalized = {
              ...data,
              coins: validCoins,
              coinsEarnedTotal: data.coinsEarnedTotal ? Number(data.coinsEarnedTotal) : validCoins
            };
            setUserData(normalized);
            try {
              localStorage.setItem('karishma_customer_profile', JSON.stringify(normalized));
            } catch {}
          } else {
            // New user registration in Firestore
            const initialData = {
              uid: user.uid,
              displayName: user.displayName || 'সম্মানিত ক্রেতা',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              coins: welcomeCoins,
              coinsEarnedTotal: welcomeCoins,
              role: 'customer',
              createdAt: serverTimestamp()
            };
            try {
              await setDoc(userRef, initialData, { merge: true });
            } catch (err) {
              console.warn('User profile firestore fallback:', err);
            }
            setUserData(initialData);
            try {
              localStorage.setItem('karishma_customer_profile', JSON.stringify(initialData));
            } catch {}
          }
          setLoading(false);
        }, (err) => {
          console.warn('Firestore user listener fallback to cache:', err.message);
          setLoading(false);
        });
      } else {
        if (unsubSnapshot) unsubSnapshot();
        // If not logged in with Firebase, check local guest profile or retain cached profile
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, [welcomeCoins]);

  // Real-time cross-tab & local sync
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('karishma_customer_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserData(prev => prev ? { ...prev, ...parsed } : parsed);
        }
      } catch {}
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('karishma_profile_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('karishma_profile_updated', handleSync);
    };
  }, []);

  // Email Sign Up
  const signupWithEmail = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      } catch {}
    }
    const initial = {
      uid: cred.user.uid,
      displayName: displayName?.trim() || 'সম্মানিত ক্রেতা',
      email: cred.user.email || '',
      coins: welcomeCoins,
      coinsEarnedTotal: welcomeCoins,
      role: 'customer'
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), initial, { merge: true });
    } catch {}
    setUserData(initial);
    try {
      localStorage.setItem('karishma_customer_profile', JSON.stringify(initial));
    } catch {}
    setIsAuthModalOpen(false);
    return cred.user;
  };

  // Email Login
  const loginWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    setIsAuthModalOpen(false);
    return cred.user;
  };

  // Google Login
  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    setIsAuthModalOpen(false);
    return cred.user;
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(null);
    setUserData(null);
    try {
      localStorage.removeItem('karishma_customer_profile');
    } catch {}
  };

  // Update profile
  const updateUserProfile = async (updates) => {
    const updated = { ...(userData || {}), ...updates };
    setUserData(updated);
    try {
      localStorage.setItem('karishma_customer_profile', JSON.stringify(updated));
      window.dispatchEvent(new Event('karishma_profile_updated'));
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), updates);
      }
    } catch (err) {
      console.warn('Update user profile local only:', err);
    }
  };

  // Coins management
  const awardCoins = async (coinsToAdd) => {
    const amount = Number(coinsToAdd) || 0;
    if (amount <= 0) return;
    const current = Number(userData?.coins) || 0;
    const totalEarned = Number(userData?.coinsEarnedTotal) || current;
    const updated = {
      ...(userData || { uid: currentUser?.uid || 'guest' }),
      coins: current + amount,
      coinsEarnedTotal: totalEarned + amount
    };
    setUserData(updated);
    try {
      localStorage.setItem('karishma_customer_profile', JSON.stringify(updated));
      window.dispatchEvent(new Event('karishma_profile_updated'));
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          coins: current + amount,
          coinsEarnedTotal: totalEarned + amount
        });
      }
    } catch {}
  };

  const redeemCoins = async (coinsToDeduct) => {
    const amount = Number(coinsToDeduct) || 0;
    if (amount <= 0) return;
    const current = Number(userData?.coins) || 0;
    const newCoins = Math.max(0, current - amount);
    const updated = { ...(userData || {}), coins: newCoins };
    setUserData(updated);
    try {
      localStorage.setItem('karishma_customer_profile', JSON.stringify(updated));
      window.dispatchEvent(new Event('karishma_profile_updated'));
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), { coins: newCoins });
      }
    } catch {}
  };

  const revertOrderCoins = async (coinsEarned, coinsRedeemed, targetUid = null) => {
    const uid = targetUid || currentUser?.uid || userData?.uid;
    const earned = Number(coinsEarned) || 0;
    const redeemed = Number(coinsRedeemed) || 0;
    const netChange = redeemed - earned; // refund used, deduct earned
    if (netChange === 0) return;

    const current = Number(userData?.coins) || 0;
    const newCoins = Math.max(0, current + netChange);
    const updated = { ...(userData || {}), coins: newCoins };
    setUserData(updated);
    try {
      localStorage.setItem('karishma_customer_profile', JSON.stringify(updated));
      window.dispatchEvent(new Event('karishma_profile_updated'));
      if (uid && uid !== 'guest') {
        await updateDoc(doc(db, 'users', uid), { coins: newCoins });
      }
    } catch {}
  };

  const userCoins = Number(userData?.coins) || 0;

  return (
    <CustomerAuthContext.Provider
      value={{
        currentUser,
        userData,
        userCoins,
        loading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        updateUserProfile,
        awardCoins,
        redeemCoins,
        revertOrderCoins
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
