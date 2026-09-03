import React from 'react';
import { useStudio } from './context/StudioContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { currentView, isAdminLoggedIn } = useStudio();

  // If user navigates to Admin View (/#admin)
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-black text-white font-sans bg-grid-pattern">
        {isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />}
      </div>
    );
  }

  // Public Showcase View
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black bg-grid-pattern relative w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
      <ProjectModal />
    </div>
  );
}
