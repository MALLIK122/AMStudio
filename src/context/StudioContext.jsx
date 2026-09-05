import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROJECTS, INITIAL_STUDIO_PROFILE, DATA_VERSION, DEFAULT_ADMIN_PASSWORD_HASH } from '../data/initialData';
import { pushToGitHub } from '../services/githubSync';

export const computePasswordHash = async (pwd) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode((pwd || '').trim() + '_am_studio_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
};

const STORAGE_KEYS = {
  PROJECTS: 'amstudio_projects_v3',
  PROFILE: 'amstudio_profile_v5',
  PASSWORD: 'amstudio_admin_pwd_v1',
  INQUIRIES: 'amstudio_inquiries_v1',
  AUTH: 'amstudio_auth_token_v1',
  GITHUB_TOKEN: 'amstudio_gh_token_v1',
  LAST_DEPLOY: 'amstudio_last_deploy_v1',
  DATA_VERSION: 'amstudio_data_version_v2',
  DELETED_IDS: 'amstudio_deleted_ids_v1',
};

const StudioContext = createContext(null);

export const StudioProvider = ({ children }) => {
  // Load Projects from localStorage or fallback with version check & deletion tombstones
  const [projects, setProjects] = useState(() => {
    try {
      let deletedSet = new Set();
      try {
        const rawDel = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        if (rawDel) deletedSet = new Set(JSON.parse(rawDel));
      } catch {}

      const savedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      // If deployed version is newer than device cache, invalidate old cache immediately!
      if (!savedVersion || Number(savedVersion) !== Number(DATA_VERSION)) {
        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(DATA_VERSION));
        const filteredInitial = INITIAL_PROJECTS.filter(p => !deletedSet.has(p.id));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filteredInitial));
        return filteredInitial;
      }

      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(p => 
          !deletedSet.has(p.id) &&
          p.id !== 'proj-aether-4' && 
          p.id !== 'proj-monolith-5' && 
          !(p.title || '').toLowerCase().includes('aether') && 
          !(p.title || '').toLowerCase().includes('monolith')
        );
      }
      return INITIAL_PROJECTS.filter(p => !deletedSet.has(p.id));
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

  // Synchronized Password Hash across all devices
  const [adminPasswordHash, setAdminPasswordHash] = useState(() => {
    try {
      return localStorage.getItem('amstudio_pwd_hash_v1') || DEFAULT_ADMIN_PASSWORD_HASH;
    } catch {
      return DEFAULT_ADMIN_PASSWORD_HASH;
    }
  });

  // Admin Password
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PASSWORD) || '';
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
                  let deletedSet = new Set();
                  try {
                    const rawDel = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
                    if (rawDel) deletedSet = new Set(JSON.parse(rawDel));
                  } catch {}

                  const activeRemoteProjects = data.projects.filter(p => !deletedSet.has(p.id));

                  setProjects(prev => {
                    const activePrev = prev.filter(p => !deletedSet.has(p.id));
                    const currentIds = activePrev.map(p => p.id).sort().join(',');
                    const remoteIds = activeRemoteProjects.map(p => p.id).sort().join(',');
                    const currentStr = JSON.stringify(activePrev);
                    const remoteStr = JSON.stringify(activeRemoteProjects);

                    // Update if count changed or content changed
                    if (currentIds !== remoteIds || currentStr !== remoteStr) {
                      localStorage.setItem(STORAGE_KEYS.PROJECTS, remoteStr);
                      if (data.version) {
                        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(data.version));
                      }
                      return activeRemoteProjects;
                    }
                    return activePrev;
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

                  if (data.adminPasswordHash) {
                    setAdminPasswordHash(data.adminPasswordHash);
                    try {
                      localStorage.setItem('amstudio_pwd_hash_v1', data.adminPasswordHash);
                    } catch (e) {}
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
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
      if (raw) {
        const set = new Set(JSON.parse(raw));
        set.delete(newProject.id);
        localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(Array.from(set)));
      }
    } catch {}

    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id, updatedData) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
      if (raw) {
        const set = new Set(JSON.parse(raw));
        set.delete(id);
        localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(Array.from(set)));
      }
    } catch {}

    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProject = async (id, shouldAutoDeploy = true) => {
    // 1. Record deletion tombstone in localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
      const set = raw ? new Set(JSON.parse(raw)) : new Set();
      set.add(id);
      localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.error('Failed saving deleted id tombstone', e);
    }

    // 2. Remove immediately from React state and localStorage
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    } catch {}

    // 3. Auto-deploy to GitHub in background if token is available
    if (shouldAutoDeploy && githubToken) {
      try {
        const res = await pushToGitHub({
          token: githubToken,
          projects: updatedProjects,
          profile,
          adminPasswordHash,
          commitMessage: `chore(cms): delete project "${id}" via Admin Dashboard`,
        });
        if (res && res.success) {
          setLastDeployInfo(res);
        }
        return res;
      } catch (err) {
        console.warn('[StudioContext] Auto-push on delete failed:', err);
      }
    }
    return { success: true };
  };

  const updateProfile = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const loginAdmin = async (passwordAttempt) => {
    const clean = (passwordAttempt || '').trim();
    if (!clean) return false;

    // 1. Direct match with locally saved password
    if (adminPassword && clean === adminPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }

    // 2. Hash match with synchronized adminPasswordHash across all devices
    const attemptHash = await computePasswordHash(clean);
    if (attemptHash && attemptHash === adminPasswordHash) {
      setAdminPassword(clean);
      try {
        localStorage.setItem(STORAGE_KEYS.PASSWORD, clean);
      } catch (e) {}
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }

    // 3. Fallback to master default password
    if (clean === 'amstudio2026!') {
      setAdminPassword(clean);
      try {
        localStorage.setItem(STORAGE_KEYS.PASSWORD, clean);
      } catch (e) {}
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }

    return false;
  };

  const resetPasswordDirectly = async (newPass) => {
    const cleanPass = (newPass || '').trim();
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, message: "New password must be at least 6 characters." };
    }

    const newHash = await computePasswordHash(cleanPass);
    setAdminPassword(cleanPass);
    if (newHash) {
      setAdminPasswordHash(newHash);
      try {
        localStorage.setItem('amstudio_pwd_hash_v1', newHash);
      } catch (e) {}
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, cleanPass);
    } catch (e) {
      console.error(e);
    }

    // Synchronize new credentials to GitHub so ALL devices can immediately log in
    if (githubToken) {
      pushToGitHub({
        token: githubToken,
        projects,
        profile,
        adminPasswordHash: newHash || adminPasswordHash,
        commitMessage: 'chore(security): synchronize updated administrative credentials across devices',
      }).catch(err => console.warn('Deferred credential sync:', err));
    }

    return { success: true, message: "Password updated successfully!" };
  };

  const updatePassword = async (currentAttempt, newPass) => {
    const isCurrentValid = await loginAdmin(currentAttempt);
    if (!isCurrentValid) {
      return { success: false, message: "Current password does not match." };
    }
    return await resetPasswordDirectly(newPass);
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
