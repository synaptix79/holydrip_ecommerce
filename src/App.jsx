import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Lazy loading views
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Catalog = lazy(() => import('./pages/Catalog').then(m => ({ default: m.Catalog })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ProductsAdmin = lazy(() => import('./pages/admin/ProductsAdmin').then(m => ({ default: m.ProductsAdmin })));
const OrdersAdmin = lazy(() => import('./pages/admin/OrdersAdmin').then(m => ({ default: m.OrdersAdmin })));
const CategoriesAdmin = lazy(() => import('./pages/admin/CategoriesAdmin').then(m => ({ default: m.CategoriesAdmin })));
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin').then(m => ({ default: m.SettingsAdmin })));

// Main User Layout with Navbar and Footer
const UserLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <CartDrawer />
    <main style={{ flex: 1, paddingTop: 'var(--nav-height)' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* User Facing Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Catalog />} />
            <Route path="nosotros" element={<About />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>

          {/* Admin Login — público */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes — protegidas */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="orders" element={<OrdersAdmin />} />
              <Route path="categories" element={<CategoriesAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
