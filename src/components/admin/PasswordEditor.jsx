import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function PasswordEditor() {
  const { updatePassword } = useStudio();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [status, setStatus] = useState({ type: '', message: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    if (result.success) {
      setStatus({ type: 'success', message: 'Master administrative password successfully updated and synced across all devices.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="pb-6 border-b border-white/10">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight">
          Administrative Security & Credentials
        </h3>
        <p className="text-zinc-400 text-xs font-mono mt-1">
          Modify the master access key used to authenticate into AM Studio CMS
        </p>
      </div>

      {status.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-mono border ${
            status.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/40 border-red-500/40 text-red-200'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="p-6 md:p-8 rounded-2xl glass-panel border border-white/10 space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              required
              placeholder="Enter current password..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm pr-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              New Password *
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              required
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Confirm New Password *
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              required
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{showPasswords ? 'Hide Password Characters' : 'Reveal Passwords'}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Update Admin Password</span>
          </button>
        </div>
      </form>

      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-start gap-3 text-zinc-400 text-xs font-mono">
        <ShieldAlert className="w-4 h-4 text-zinc-300 flex-shrink-0 mt-0.5" />
        <p>
          Your password is encrypted and saved directly in your browser's persistent storage.
          Make sure to store your new password in your password manager.
        </p>
      </div>
    </div>
  );
}
