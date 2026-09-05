import React from 'react';
import { useStudio } from './context/StudioContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import ProjectsSection from './components/ProjectsSection';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import BackgroundSpotlight from './components/BackgroundSpotlight';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { currentView, isAdminLoggedIn } = useStudio();

  // If user navigates to Admin View (/#admin) -> strictly no background spotlight
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-black text-white font-sans bg-grid-pattern">
        {isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />}
      </div>
    );
  }

  // Public Showcase View
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black relative w-full overflow-x-hidden">
      {/* Background Spotlight: Illuminates only background in white on cursor/touch, grill intact */}
      <BackgroundSpotlight />

      <Navbar />
      <main className="w-full overflow-x-hidden relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProjectsSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <ProjectModal />
      <FloatingWhatsApp />
    </div>
  );
}
