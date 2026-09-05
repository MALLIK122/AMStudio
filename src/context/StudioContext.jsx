import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROJECTS, INITIAL_STUDIO_PROFILE, DATA_VERSION } from '../data/initialData';

const StudioContext = createContext();

const STORAGE_KEYS = {
  PROJECTS: 'amstudio_projects_v3',
  PROFILE: 'amstudio_profile_v5',
  PASSWORD: 'amstudio_admin_pwd_v1',
  INQUIRIES: 'amstudio_inquiries_v1',
  AUTH: 'amstudio_auth_token_v1',
  GITHUB_TOKEN: 'amstudio_gh_token_v1',
  LAST_DEPLOY: 'amstudio_last_deploy_v1',
  DATA_VERSION: 'amstudio_data_version_v2',
};

export const StudioProvider = ({ children }) => {
  // Load Projects from localStorage or fallback with version check
  const [projects, setProjects] = useState(() => {
    try {
      const savedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      // If deployed version is newer than device cache, invalidate old cache immediately!
      if (!savedVersion || Number(savedVersion) !== Number(DATA_VERSION)) {
        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(DATA_VERSION));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
        return INITIAL_PROJECTS;
      }

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

  // Load Profile from localStorage or fallback with version check
  const [profile, setProfile] = useState(() => {
    try {
      const savedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      if (!savedVersion || Number(savedVersion) !== Number(DATA_VERSION)) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_STUDIO_PROFILE));
        return INITIAL_STUDIO_PROFILE;
      }

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
          name: "Amrutha & Mallikarjun",
          email: "mallikarjunks012022@gmail.com",
          phone: "+91 97316 96952",
          projectType: "Traditional Invitation",
          budget: "Wedding: 01/12/2026",
          message: "Good Looking, Traditional Animations, Premium features with background music, RSVP tracking, and Google Maps venue navigation.",
          date: "2026-09-05T09:42:00.000Z",
          read: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Admin Password (strictly configured by studio owner, no public default)
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORD);
      if (saved === 'amstudio2026!') {
        localStorage.removeItem(STORAGE_KEYS.PASSWORD);
        return '';
      }
      return saved || '';
    } catch {
      return '';
    }
  });

  // GitHub Personal Access Token for automated Vercel deployment
  const [githubToken, setGithubToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || '';
    } catch {
      return '';
    }
  });

  // Last successful live deployment metadata
  const [lastDeployInfo, setLastDeployInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_DEPLOY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
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

  // Real-time cross-device synchronization:
  // Dynamically fetches latest projects from GitHub public data so any update made in Admin
  // displays immediately across ALL mobile phones, tablets, and computers worldwide
  // without waiting for or depending on Vercel builds!
  useEffect(() => {
    let isMounted = true;

    // 1. Invalidate local storage if build DATA_VERSION is newer
    try {
      const savedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      if (!savedVersion || Number(savedVersion) < Number(DATA_VERSION)) {
        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(DATA_VERSION));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_STUDIO_PROFILE));
        setProjects(INITIAL_PROJECTS);
        setProfile(INITIAL_STUDIO_PROFILE);
      }
    } catch (e) {
      console.warn('Version check error:', e);
    }

    // 2. Fetch live data from GitHub public repository
    const syncFromRemote = async () => {
      try {
        const endpoints = [
          `https://raw.githubusercontent.com/MALLIK122/AMStudio/main/public/data/projects.json?_t=${Date.now()}`,
          `/data/projects.json?_t=${Date.now()}`
        ];

        for (const url of endpoints) {
          try {
            const res = await fetch(url, { cache: 'no-store' });
            if (res.ok) {
              const data = await res.json();
              if (data && Array.isArray(data.projects) && data.projects.length > 0) {
                if (isMounted) {
                  setProjects(prev => {
                    const currentIds = prev.map(p => p.id).sort().join(',');
                    const remoteIds = data.projects.map(p => p.id).sort().join(',');
                    const currentStr = JSON.stringify(prev);
                    const remoteStr = JSON.stringify(data.projects);

                    // Update if count changed or content changed
                    if (currentIds !== remoteIds || currentStr !== remoteStr) {
                      localStorage.setItem(STORAGE_KEYS.PROJECTS, remoteStr);
                      if (data.version) {
                        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(data.version));
                      }
                      return data.projects;
                    }
                    return prev;
                  });

                  if (data.profile) {
                    setProfile(prev => {
                      const currentStr = JSON.stringify(prev);
                      const remoteStr = JSON.stringify(data.profile);
                      if (currentStr !== remoteStr) {
                        localStorage.setItem(STORAGE_KEYS.PROFILE, remoteStr);
                        return data.profile;
                      }
                      return prev;
                    });
                  }
                }
                break; // successfully synced from this endpoint
              }
            }
          } catch {
            // try next endpoint
          }
        }
      } catch (err) {
        console.warn('[StudioSync] Remote sync check failed:', err);
      }
    };

    syncFromRemote();
    const interval = setInterval(syncFromRemote, 20000); // refresh every 20 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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

  useEffect(() => {
    try {
      if (githubToken) {
        localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, githubToken);
      } else {
        localStorage.removeItem(STORAGE_KEYS.GITHUB_TOKEN);
      }
    } catch (e) {
      console.error('Failed saving githubToken to localStorage', e);
    }
  }, [githubToken]);

  useEffect(() => {
    try {
      if (lastDeployInfo) {
        localStorage.setItem(STORAGE_KEYS.LAST_DEPLOY, JSON.stringify(lastDeployInfo));
      } else {
        localStorage.removeItem(STORAGE_KEYS.LAST_DEPLOY);
      }
    } catch (e) {
      console.error('Failed saving lastDeployInfo to localStorage', e);
    }
  }, [lastDeployInfo]);

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
    setAdminPassword('');
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
      githubToken,
      setGithubToken,
      lastDeployInfo,
      setLastDeployInfo,
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
