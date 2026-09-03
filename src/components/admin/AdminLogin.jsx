import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';

import AMLogo from '../AMLogo';

export default function AdminLogin() {
  const { loginAdmin, setCurrentView } = useStudio();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the administrative password.');
      return;
    }

    const success = loginAdmin(password);
    if (!success) {
      setError('Invalid studio administrative password.');
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl relative">
        
        {/* Back to website button */}
        <button
          onClick={() => setCurrentView('public')}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Showcase</span>
        </button>

        <div className="flex flex-col items-center justify-center text-center mb-8">
          <AMLogo size="lg" withText={false} className="mb-4" />
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            AM STUDIO ADMIN
          </h2>
          <p className="text-zinc-400 text-xs font-mono mt-1">
            Executive Content Management System
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full glass-input px-4 py-3 rounded-xl text-sm pr-11"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate Session</span>
          </button>
        </form>
      </div>
    </div>
  );
}
