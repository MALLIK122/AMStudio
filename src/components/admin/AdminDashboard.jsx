import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import ProjectForm from './ProjectForm';
import ContactEditor from './ContactEditor';
import PasswordEditor from './PasswordEditor';
import InquiriesManager from './InquiriesManager';
import GitHubSyncManager from './GitHubSyncManager';
import { pushToGitHub } from '../../services/githubSync';
import { 
  FolderGit2, 
  UserCog, 
  Lock, 
  MessageSquare, 
  Plus, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  LogOut, 
  ArrowLeft, 
  Sparkles,
  UploadCloud,
  RefreshCw
} from 'lucide-react';
import { Github } from '../Icons';
import AMLogo from '../AMLogo';

export default function AdminDashboard() {
  const { 
    projects, 
    profile,
    inquiries, 
    setCurrentView, 
    logoutAdmin, 
    addProject, 
    updateProject, 
    deleteProject,
    githubToken,
    setLastDeployInfo,
  } = useStudio();

  const [activeTab, setActiveTab] = useState('projects');
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [addingType, setAddingType] = useState('website');
  const [isDeployingGlobal, setIsDeployingGlobal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteProject = async (project) => {
    if (!confirm(`Permanently delete project "${project.title}"?`)) {
      return;
    }
    setDeletingId(project.id);
    try {
      const res = await deleteProject(project.id, Boolean(githubToken));
      if (res && res.success && githubToken) {
        setLastDeployInfo(res);
      }
    } catch (err) {
      console.error('Failed deleting project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProject = async (projectData) => {
    setIsDeployingGlobal(true);
    try {
      if (editingProject) {
        const res = await updateProject(editingProject.id, projectData, Boolean(githubToken));
        setEditingProject(null);
        if (res && res.success && githubToken) {
          setLastDeployInfo(res);
          alert(`Project "${projectData.title}" updated and synced live across all devices!`);
        } else if (res && !res.success) {
          alert(`Project updated locally, but GitHub deployment error: ${res.error}`);
        }
      } else {
        const res = await addProject(projectData, Boolean(githubToken));
        setIsAddingProject(false);
        if (res && res.success && githubToken) {
          setLastDeployInfo(res);
          alert(`Project "${projectData.title}" published and synced live across all devices!`);
        } else if (res && !res.success) {
          alert(`Project published locally, but GitHub deployment error: ${res.error}`);
        }
      }
    } finally {
      setIsDeployingGlobal(false);
    }

    if (!githubToken) {
      if (confirm(`Project saved in this browser, but NOT yet on GitHub!\n\nTo make this update visible on all mobile devices worldwide, you need to connect your GitHub Token once.\n\nWould you like to open the "GitHub & Vercel Live" tab to connect now?`)) {
        setActiveTab('deployment');
      }
    }
  };

  const unreadCount = inquiries.filter(i => !i.read).length;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('public')}
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <AMLogo size="sm" interactive={false} />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-black font-semibold uppercase">
              Admin CMS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('public')}
              className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              View Live Website
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
              activeTab === 'projects'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-zinc-950 border-white/15 text-zinc-200 hover:text-white hover:border-white/40 font-medium'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
              activeTab === 'contact'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-zinc-950 border-white/15 text-zinc-200 hover:text-white hover:border-white/40 font-medium'
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>Studio & Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
              activeTab === 'inquiries'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-zinc-950 border-white/15 text-zinc-200 hover:text-white hover:border-white/40 font-medium'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'inquiries' ? 'bg-black text-white' : 'bg-white text-black'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('deployment')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
              activeTab === 'deployment'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-zinc-950 border-white/15 text-zinc-200 hover:text-white hover:border-white/40 font-medium'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>GitHub &amp; Vercel Live</span>
            {githubToken ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
              activeTab === 'security'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-zinc-950 border-white/15 text-zinc-200 hover:text-white hover:border-white/40 font-medium'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>

        </div>

        {/* Tab 1: Projects Management */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                  Portfolio Works ({projects.length})
                </h3>
                <p className="text-zinc-300 text-xs font-mono mt-0.5 font-medium">
                  Manage showcased projects displayed on the homepage across all devices
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveTab('deployment')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 text-xs font-mono uppercase transition-all"
                  title="Deploy changes live to GitHub & Vercel across all devices"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish Live</span>
                </button>

                <button
                  onClick={() => {
                    setAddingType('poster');
                    setIsAddingProject(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono uppercase transition-all shadow-lg border border-purple-400/30"
                  title="Upload and showcase a new poster or invitation card"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New Poster / Card</span>
                </button>

                <button
                  onClick={() => {
                    setAddingType('website');
                    setIsAddingProject(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase hover:bg-zinc-200 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New Website</span>
                </button>
              </div>
            </div>

            {/* Projects Table / List */}
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 hover:border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className={`${project.isPoster ? 'w-14 h-20 object-cover' : 'w-20 h-14 object-cover'} rounded-xl border border-white/10 bg-zinc-900 flex-shrink-0`}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display font-bold text-base text-white">
                          {project.title}
                        </h4>
                        {project.isPoster ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                            Poster / Card
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                            Website
                          </span>
                        )}
                        {project.featured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/15 text-white border border-white/20">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 font-mono mt-0.5 font-medium">
                        {project.category} • {project.year}
                      </p>
                      <p className="text-xs text-zinc-200 line-clamp-1 mt-1 max-w-xl font-normal">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                        title="Open Live Project"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                        title="Open GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-2 rounded-lg border border-white/10 hover:bg-white text-zinc-300 hover:text-black transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project)}
                      disabled={deletingId === project.id}
                      className="p-2 rounded-lg border border-red-500/20 hover:bg-red-950/40 text-red-400 transition-colors disabled:opacity-50"
                      title="Delete Project"
                    >
                      {deletingId === project.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Studio & Contact Info */}
        {activeTab === 'contact' && <ContactEditor />}

        {/* Tab 3: Client Inquiries */}
        {activeTab === 'inquiries' && <InquiriesManager />}

        {/* Tab 4: Security & Password */}
        {activeTab === 'security' && <PasswordEditor />}

        {/* Tab 5: GitHub & Vercel Live Deployment */}
        {activeTab === 'deployment' && <GitHubSyncManager />}


        {/* Modal: Project Form (Add or Edit) */}
        {(isAddingProject || editingProject) && (
          <ProjectForm
            project={editingProject}
            initialType={addingType}
            onSave={handleSaveProject}
            onCancel={() => {
              setIsAddingProject(false);
              setEditingProject(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
