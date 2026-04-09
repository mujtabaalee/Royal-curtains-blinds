import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Map from "@/components/Map";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FloatingActions from "@/components/FloatingActions";

const Home = lazy(() => import("@/pages/Home"));
const ProductsPage = lazy(() => import("@/pages/Products"));
const FullGallery = lazy(() => import("@/pages/FullGallery"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

// Admin Pages
import { ProtectedRoute } from "@/components/Admin/ProtectedRoute";
import Login from "@/pages/Admin/Login";
import DashboardLayout from "@/pages/Admin/DashboardLayout";
import BlogManager from "@/pages/Admin/BlogManager";
import GalleryManager from "@/pages/Admin/GalleryManager";
import ProductManager from "@/pages/Admin/ProductManager";

// Wrapper for suburb-specific pages
const SuburbPage = () => {
  const { suburb } = useParams<{ suburb: string }>();
  const capitalizedSuburb = suburb ? suburb.charAt(0).toUpperCase() + suburb.slice(1) : 'Sydney';

  return (
    <>
      <Hero suburb={capitalizedSuburb} />
      <Services />
      <Gallery />
      <Reviews />
      <Map />
      <Contact />
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><ProductsPage /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><FullGallery /></PageWrapper>} />
        <Route path="/locations/:suburb" element={<PageWrapper><SuburbPage /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
        <Route path="/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <CustomCursor />
      <FloatingActions />
      <div className="app">
        {/* We use useLocation to conditionally hide Navbar/Footer on Admin routes */}
        <Routes>
          <Route path="/admin/*" element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--primary-navy)' }} />}>
              <Routes>
                <Route path="login" element={<Login />} />
                <Route path="" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<div>Welcome to Admin Dashboard. Select an option from the sidebar.</div>} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="blog" element={<BlogManager />} />
                  <Route path="gallery" element={<GalleryManager />} />
                </Route>
              </Routes>
            </Suspense>
          } />
          <Route path="*" element={
            <>
              <Navbar />
              <main>
                <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--primary-navy)' }} />}>
                  <AnimatedRoutes />
                </Suspense>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
