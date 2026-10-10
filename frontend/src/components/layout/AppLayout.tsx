import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors">
      <Navbar />
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          duration: 4000,
          className: 'text-sm font-bold shadow-xl rounded-2xl',
        }} 
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};
