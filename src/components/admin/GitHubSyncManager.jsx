import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  GitBranch, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  UploadCloud, 
  Globe,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { verifyGitHubAccess, pushToGitHub, GITHUB_CONFIG } from '../../services/githubSync';

export default function GitHubSyncManager() {
  const { 
    projects, 
    profile, 
    githubToken, 
    setGithubToken, 
    lastDeployInfo, 
    setLastDeployInfo 
  } = useStudio();

  const [inputToken, setInputToken] = useState(githubToken || '');
  const [showToken, setShowToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);

  useEffect(() => {
    setInputToken(githubToken || '');
  }, [githubToken]);

  const handleSaveToken = async (e) => {
    e.preventDefault();
    if (!inputToken.trim()) return;

    setIsVerifying(true);
    setVerifyResult(null);

    const res = await verifyGitHubAccess(inputToken.trim());
    setIsVerifying(false);
    setVerifyResult(res);

    if (res.success) {
      setGithubToken(inputToken.trim());
    }
  };

  const handleRemoveToken = () => {
    if (confirm('Remove saved GitHub token? You will need to re-enter it to deploy live.')) {
      setGithubToken('');
      setInputToken('');
      setVerifyResult(null);
      setDeployResult(null);
    }
  };

  const handleDeployNow = async () => {
    if (!githubToken) {
      alert('Please save your GitHub token first to enable live deployment.');
      return;
    }

    setIsDeploying(true);
    setDeployResult(null);

    const res = await pushToGitHub({
      token: githubToken,
      projects,
      profile,
      commitMessage: `chore(cms): update projects (${projects.length} works) via Admin Dashboard`,
    });

    setIsDeploying(false);
    setDeployResult(res);

    if (res.success) {
      setLastDeployInfo(res);
    }
  };

  const isConnected = Boolean(githubToken && githubToken.length > 10);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <UploadCloud className="w-6 h-6 text-white" />
            <span>GitHub &amp; Vercel Live Deployment</span>
          </h3>
          <p className="text-zinc-400 text-xs font-mono mt-1">
            Push wedding invitation projects directly to GitHub and automatically deploy live on Vercel across all devices
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GitHub Connected</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Token Needed for Live Sync</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Deployment Action Card */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/15 relative overflow-hidden bg-zinc-950/70">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Globe className="w-4 h-4 text-white" />
              <span>Global Multi-Device Deployment</span>
            </div>
            <h4 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Publish All Projects to Live Website
            </h4>
            <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
              When you click this button, your current {projects.length} wedding projects are uploaded directly to the 
              <strong className="text-white font-mono"> {GITHUB_CONFIG.OWNER}/{GITHUB_CONFIG.REPO}</strong> repository. 
              Vercel will detect the update, build the website, and make all new invitation links visible on every mobile phone and device worldwide.
            </p>

            {lastDeployInfo?.deployedAt && (
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Last live deploy: {new Date(lastDeployInfo.deployedAt).toLocaleString()} (commit {lastDeployInfo.commitSha})</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
            <button
              onClick={handleDeployNow}
              disabled={isDeploying || !isConnected}
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} />
              <span>{isDeploying ? 'Deploying to Vercel...' : 'Publish & Deploy Live'}</span>
            </button>

            <a
              href={GITHUB_CONFIG.LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white transition-colors text-center font-semibold"
            >
              <span>Open Live Website (Instant)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={GITHUB_CONFIG.VERCEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors text-center"
            >
              <span>Open Vercel URL</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Live Deploy Result Notification */}
        {deployResult && (
          <div className={`mt-6 p-4 rounded-xl border text-xs font-mono animate-fade-in ${
            deployResult.success 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-950/30 border-red-500/30 text-red-300'
          }`}>
            {deployResult.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success! Synced to GitHub & Live Cloud (commit {deployResult.commitSha})</span>
                </div>
                <p className="text-zinc-300">
                  Your wedding projects and details have been published. All mobile phones, tablets, and devices worldwide will immediately display the updated projects!
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={deployResult.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-400 hover:text-white flex items-center gap-1"
                  >
                    <span>View GitHub Commit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-zinc-600">•</span>
                  <a
                    href={GITHUB_CONFIG.VERCEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Check Vercel Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Deployment Failed</span>
                  <span className="text-zinc-300">{deployResult.error}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GitHub Token Configuration Card */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-white" />
              <span>GitHub Personal Access Token</span>
            </h4>
            <p className="text-zinc-400 text-xs font-mono mt-1">
              Your token is stored safely only in your browser's private storage to authenticate commits to your repo
            </p>
          </div>

          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=AM+Studio+Auto+Deploy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
          >
            <span>Create Token on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Step Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 1</span>
            <p className="text-xs text-zinc-300 font-medium">Click "Create Token on GitHub"</p>
            <p className="text-[11px] text-zinc-500 font-light">The <code className="text-zinc-400">repo</code> scope is pre-selected for you.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 2</span>
            <p className="text-xs text-zinc-300 font-medium">Click "Generate token" &amp; Copy</p>
            <p className="text-[11px] text-zinc-500 font-light">Copy the token that starts with <code className="text-zinc-400">ghp_...</code></p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 3</span>
            <p className="text-xs text-zinc-300 font-medium">Paste &amp; Save Below</p>
            <p className="text-[11px] text-zinc-500 font-light">You're ready to deploy live with 1 click anytime!</p>
          </div>
        </div>

        {/* Token Input Form */}
        <form onSubmit={handleSaveToken} className="space-y-4 pt-2">
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              placeholder="Paste your GitHub token here (e.g. ghp_xxxxxxxxxxxxxxxxxxxx)"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="w-full glass-input px-4 py-3 pr-12 rounded-xl text-sm font-mono"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isVerifying || !inputToken.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase hover:bg-zinc-200 transition-all disabled:opacity-40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying Token...' : 'Save & Connect GitHub'}</span>
              </button>

              {githubToken && (
                <button
                  type="button"
                  onClick={handleRemoveToken}
                  className="px-4 py-2.5 rounded-xl border border-red-500/20 hover:bg-red-950/40 text-red-400 text-xs font-mono transition-colors"
                >
                  Disconnect Token
                </button>
              )}
            </div>

            <span className="text-[11px] font-mono text-zinc-500">
              Repository: <strong className="text-zinc-300">MALLIK122/AMStudio</strong> (branch: <strong className="text-zinc-300">main</strong>)
            </span>
          </div>

          {verifyResult && (
            <div className={`p-3.5 rounded-xl border text-xs font-mono ${
              verifyResult.success 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                : 'bg-red-950/30 border-red-500/30 text-red-300'
            }`}>
              {verifyResult.success ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Authenticated as <strong>@{verifyResult.username}</strong> with write access to <strong>{verifyResult.repoName}</strong>!</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{verifyResult.error}</span>
                </span>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
