import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROJECTS, INITIAL_STUDIO_PROFILE } from '../data/initialData';

const StudioContext = createContext();

const STORAGE_KEYS = {
  PROJECTS: 'amstudio_projects_v3',
  PROFILE: 'amstudio_profile_v5',
  PASSWORD: 'amstudio_admin_pwd_v1',
  INQUIRIES: 'amstudio_inquiries_v1',
  AUTH: 'amstudio_auth_token_v1',
};

export const StudioProvider = ({ children }) => {
  // Load Projects from localStorage or fallback
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(p => 
          p.id !== 'proj-aether-4' && 
          p.id !== 'proj-monolith-5' && 
          !p.title.toLowerCase().includes('aether') && 
          !p.title.toLowerCase().includes('monolith')
        );
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Load Profile from localStorage or fallback
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleanedSocials = {
          github: (parsed.socials?.github && parsed.socials.github !== 'https://github.com') ? parsed.socials.github : '',
          twitter: (parsed.socials?.twitter && parsed.socials.twitter !== 'https://twitter.com') ? parsed.socials.twitter : '',
          linkedin: (parsed.socials?.linkedin && parsed.socials.linkedin !== 'https://linkedin.com') ? parsed.socials.linkedin : '',
          instagram: (parsed.socials?.instagram && parsed.socials.instagram !== 'https://instagram.com') ? parsed.socials.instagram : '',
          dribbble: (parsed.socials?.dribbble && parsed.socials.dribbble !== 'https://dribbble.com') ? parsed.socials.dribbble : '',
        };
        return {
          ...parsed,
          heroHeading: "BEAUTIFULLY CRAFTED WEDDING INVITATION WEBSITES MADE JUST FOR YOU.",
          heroSubheading: "AM Studio is an independent creative engineering laboratory.",
          email: "amstudio.support.in@gmail.com",
          phone: "+91 97316 96952",
          location: "Davanagere, Karnataka",
          socials: cleanedSocials,
        };
      }
      return INITIAL_STUDIO_PROFILE;
    } catch {
      return INITIAL_STUDIO_PROFILE;
    }
  });

  // Inquiries received from contact form
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : [
        {
          id: "inq-1",
          name: "Soren Nielsen",
          email: "soren@nordicspatial.co",
          projectType: "3D Web Application",
          budget: "$15k - $30k",
          message: "Looking for a custom WebGL 3D architectural showcase for our flagship Copenhagen design center.",
          date: "2026-08-29T14:30:00.000Z",
          read: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Admin Password
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORD);
      return saved || 'amstudio2026!';
    } catch {
      return 'amstudio2026!';
    }
  });

  // Auth State (Session-persisted)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Active view: 'public' or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') return 'admin';
    }
    return 'public';
  });
  // Selected project for modal preview
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') setCurrentView('admin');
      else if (hash === '' || hash === '#' || hash === '#projects' || hash === '#contact') {
        setCurrentView('public');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed saving projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed saving profile to localStorage', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed saving inquiries to localStorage', e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, adminPassword);
    } catch (e) {
      console.error('Failed saving password to localStorage', e);
    }
  }, [adminPassword]);

  // Actions
  const addProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      year: projectData.year || new Date().getFullYear().toString(),
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id, updatedData) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateProfile = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const updatePassword = (currentAttempt, newPass) => {
    if (currentAttempt !== adminPassword) {
      return { success: false, message: "Current password does not match." };
    }
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: "New password must be at least 6 characters." };
    }
    setAdminPassword(newPass.trim());
    return { success: true, message: "Password updated successfully!" };
  };

  const resetPasswordDirectly = (newPass) => {
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: "New password must be at least 6 characters." };
    }
    setAdminPassword(newPass.trim());
    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, newPass.trim());
    } catch (e) {
      console.error(e);
    }
    return { success: true, message: "Password reset successfully!" };
  };

  const loginAdmin = (passwordAttempt) => {
    if (passwordAttempt === adminPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    setCurrentView('public');
  };

  const submitInquiry = (data) => {
    const newInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString(),
      read: false
    };
    setInquiries(prev => [newInquiry, ...prev]);
    return true;
  };

  const markInquiryAsRead = (id) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, read: true } : item));
  };

  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(item => item.id !== id));
  };

  const resetToDefaults = () => {
    setProjects(INITIAL_PROJECTS);
    setProfile(INITIAL_STUDIO_PROFILE);
    setAdminPassword('amstudio2026!');
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PASSWORD);
  };

  const exportDataAsJSON = () => {
    const exportBundle = {
      version: "1.0",
      studio: "AM Studio",
      exportedAt: new Date().toISOString(),
      profile,
      projects,
      inquiries
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `am-studio-backup-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataFromJSON = (importedObj) => {
    if (importedObj.projects && Array.isArray(importedObj.projects)) {
      setProjects(importedObj.projects);
    }
    if (importedObj.profile && typeof importedObj.profile === 'object') {
      setProfile(importedObj.profile);
    }
    if (importedObj.inquiries && Array.isArray(importedObj.inquiries)) {
      setInquiries(importedObj.inquiries);
    }
  };

  return (
    <StudioContext.Provider value={{
      projects,
      profile,
      inquiries,
      adminPassword,
      isAdminLoggedIn,
      currentView,
      selectedProject,
      setCurrentView,
      setSelectedProject,
      addProject,
      updateProject,
      deleteProject,
      updateProfile,
      updatePassword,
      resetPasswordDirectly,
      loginAdmin,
      logoutAdmin,
      submitInquiry,
      markInquiryAsRead,
      deleteInquiry,
      resetToDefaults,
      exportDataAsJSON,
      importDataFromJSON,
    }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
