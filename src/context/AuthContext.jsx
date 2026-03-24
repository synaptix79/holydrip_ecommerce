import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Estos correos SIEMPRE tienen acceso — no se pueden eliminar desde la UI
const MASTER_EMAILS = [
  'synaptixenterprise@gmail.com',
  'fioremazzei0@gmail.com',
  'holydriparaguay@gmail.com'
];

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [allowedEmails, setAllowedEmails] = useState(MASTER_EMAILS);

  // Escuchar settings/store para obtener admins extra en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'store'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const extras = (data.adminEmails || []).filter(e => e && e.trim());
        setAllowedEmails([...MASTER_EMAILS, ...extras]);
      }
    }, () => {
      // Si falla la lectura (e.g. rules), al menos los master funcionan
      setAllowedEmails(MASTER_EMAILS);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Verificar contra la lista actual (que incluye extras de Firestore)
        const emailLower = firebaseUser.email.toLowerCase();
        const isAllowed = allowedEmails.some(e => e.toLowerCase() === emailLower);
        if (isAllowed) {
          setUser(firebaseUser);
          setIsAuthorized(true);
        } else {
          await signOut(auth);
          setUser(null);
          setIsAuthorized(false);
        }
      } else {
        setUser(null);
        setIsAuthorized(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [allowedEmails]);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const emailLower = result.user.email.toLowerCase();
    const isAllowed = allowedEmails.some(e => e.toLowerCase() === emailLower);
    if (!isAllowed) {
      await signOut(auth);
      throw new Error('ACCESO DENEGADO');
    }
    return result;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAuthorized, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
