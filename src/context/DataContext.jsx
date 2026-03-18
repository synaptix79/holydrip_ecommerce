import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData debe usarse dentro de un DataProvider');
  return context;
};

/**
 * Genera un slug URL-safe a partir de un string.
 * "Remeras de Algodón" → "remeras-de-algodon"
 */
const toSlug = (str) =>
  str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const DataProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Productos en tiempo real ───
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setAllProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    }, (err) => {
      console.error('Error productos:', err);
      setError(err.message);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // ─── Categorías en tiempo real ───
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      setAllCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('Error categorías:', err));
    return () => unsub();
  }, []);

  // ─── Pedidos en tiempo real ───
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('Error pedidos:', err));
    return () => unsub();
  }, []);

  // ─── Settings (una vez) ───
  useEffect(() => {
    getDoc(doc(db, 'settings', 'store'))
      .then(snap => { if (snap.exists()) setSettings(snap.data()); })
      .catch(err => console.error('Error settings:', err));
  }, []);

  // ─── Visitas: una por sesión ───
  useEffect(() => {
    const key = 'hd_visited';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    addDoc(collection(db, 'visits'), {
      date: new Date().toISOString().split('T')[0],
      ts: Date.now()
    }).catch(() => {});
  }, []);

  const getVisitCount = async (period = 'month') => {
    if (period === 'all') {
      try {
        return (await getDocs(collection(db, 'visits'))).size;
      } catch { return 0; }
    }
    const now = new Date();
    let from = new Date(now);
    if (period === 'week') from.setDate(now.getDate() - 7);
    else from.setDate(1);
    try {
      const q = query(collection(db, 'visits'), where('date', '>=', from.toISOString().split('T')[0]));
      return (await getDocs(q)).size;
    } catch { return 0; }
  };

  // ─── Datos públicos (solo visibles) ───
  const products = allProducts.filter(p => p.isVisible !== false);
  const categories = allCategories.filter(c => c.isVisible !== false);

  // ─── CRUD Productos ───
  const addProduct = async (data) => {
    const slug = toSlug(data.name);
    await addDoc(collection(db, 'products'), {
      ...data,
      slug: slug || null,
      createdAt: Date.now(),
      isVisible: data.isVisible !== false
    });
  };
  const removeProduct = (id) => deleteDoc(doc(db, 'products', id));
  const updateProduct = (id, data) => {
    const updateData = { ...data };
    if (data.name) updateData.slug = toSlug(data.name);
    return updateDoc(doc(db, 'products', id), updateData);
  };

  // ─── CRUD Categorías ───
  // El slug se usa como document ID → consistente entre admin y landing
  const addCategory = async (data) => {
    const slug = toSlug(data.name);
    if (!slug) throw new Error('El nombre de la categoría no es válido.');
    await setDoc(doc(db, 'categories', slug), {
      name: data.name,
      slug,
      image: data.image || null,
      isVisible: true,
      createdAt: Date.now()
    });
  };

  const removeCategory = (id) => deleteDoc(doc(db, 'categories', id));
  const updateCategory = (id, data) => updateDoc(doc(db, 'categories', id), data);

  // ─── CRUD Pedidos ───
  const addOrder = async (data) => {
    const ref = await addDoc(collection(db, 'orders'), {
      ...data,
      status: 'en_espera',
      createdAt: Date.now()
    });
    return ref.id;
  };
  const updateOrderStatus = (id, status) => updateDoc(doc(db, 'orders', id), { status });

  // ─── Settings ───
  const updateSettings = async (data) => {
    await setDoc(doc(db, 'settings', 'store'), data, { merge: true });
    setSettings(prev => ({ ...prev, ...data }));
  };

  const value = {
    products,           // solo visibles — para landing
    categories,         // solo visibles — para landing
    allProducts,        // para admin
    allCategories,      // para admin (incluye ocultas)
    orders,
    settings,
    isLoading,
    error,
    addProduct, removeProduct, updateProduct,
    addCategory, removeCategory, updateCategory,
    addOrder, updateOrderStatus,
    getVisitCount,
    updateSettings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
