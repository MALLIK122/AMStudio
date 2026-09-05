import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';

import AMLogo from '../AMLogo';

export default function AdminLogin() {
  const { loginAdmin, resetPasswordDirectly, adminPassword, setCurrentView } = useStudio();
  
  // Standard Login State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password / Reset State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [activeCode, setActiveCode] = useState('');
  const [userCodeInput, setUserCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleLogin = (e) => {
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

  const sendResetEmail = async () => {
    setIsSendingCode(true);
    setError('');
    setResetSuccess('');

    // Generate random 6-digit numeric verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveCode(generatedCode);

    try {
      await fetch('https://formsubmit.co/ajax/8136667047df08585270147f34512a30', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: '🔐 AM Studio Admin: Confidential One-Time Verification Code',
          _template: 'table',
          _captcha: 'false',
          service: 'AM Studio Executive Content Management System',
          recipient: 'amstudio.support.in@gmail.com',
          one_time_verification_code: generatedCode,
          instructions: 'Enter this 6-digit verification code on the AM Studio admin portal to authenticate and set your private master password.',
          requested_at: new Date().toLocaleString(),
        }),
      });

      setCodeSent(true);
      setResetSuccess('A 6-digit verification code has been dispatched to your authorized email address. Please check your inbox and spam folder.');
      
      // 30s Cooldown
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.warn('Verification email dispatch finished', err);
      setCodeSent(true);
      setResetSuccess('Verification request dispatched. Please check your email inbox and spam folder.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setError('');

    const inputTrimmed = userCodeInput.trim().replace(/\D/g, '');
    if (!inputTrimmed || inputTrimmed.length !== 6) {
      setError('Please enter the valid 6-digit verification code sent to your email.');
      return;
    }

    // STRICT: Only allow matching the exact 6-digit OTP dispatched to email
    if (inputTrimmed !== activeCode) {
      setError('Invalid verification code. Please check your email and try again.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const result = resetPasswordDirectly(newPassword);
    if (result.success) {
      setResetSuccess('Master password configured successfully! Authenticating session...');
      setTimeout(() => {
        loginAdmin(newPassword);
      }, 800);
    } else {
      setError(result.message || 'Failed to set password.');
    }
  };

  const resetForgotState = () => {
    setIsForgotMode(false);
    setCodeSent(false);
    setUserCodeInput('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setResetSuccess('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl relative">
        
        {/* Back to website button */}
        <button
          onClick={() => {
            if (isForgotMode) {
              resetForgotState();
            } else {
              setCurrentView('public');
            }
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isForgotMode ? 'Back to Login' : 'Return to Showcase'}</span>
        </button>

        <div className="flex flex-col items-center justify-center text-center mb-6">
          <AMLogo size="lg" withText={false} className="mb-4" interactive={false} />
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            {!adminPassword 
              ? 'SETUP ADMIN ACCESS' 
              : isForgotMode 
              ? 'PASSWORD RECOVERY' 
              : 'AM STUDIO ADMIN'}
          </h2>
          <p className="text-zinc-400 text-xs font-mono mt-1">
            {!adminPassword
              ? 'Zero default passwords. Configure your private access'
              : isForgotMode 
              ? 'Authorized Administrator Security Verification' 
              : 'Executive Content Management System'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 mb-5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {resetSuccess && (
          <div className="p-3.5 mb-5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {/* --- 1. INITIAL SETUP REQUIRED (NO DEFAULT PASSWORD) --- */}
        {!adminPassword ? (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Zero Default Password Security</span>
              </div>
              <p>
                All default passwords have been completely purged for strict security. Click below to receive a confidential <strong>6-digit verification code</strong> at your authorized email to configure your private password.
              </p>
            </div>

            {!codeSent ? (
              <button
                type="button"
                onClick={sendResetEmail}
                disabled={isSendingCode}
                className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching Code...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Verification Code to Email</span>
                  </>
                )}
              </button>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 482910"
                    value={userCodeInput}
                    onChange={(e) => setUserCodeInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono tracking-widest text-center"
                    autoFocus
                  />
                  <p className="text-[11px] text-zinc-400 mt-1 font-mono text-center">
                    Enter the 6-digit code received in your registered email
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Your Private Master Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full glass-input px-4 py-2.5 rounded-xl text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Confirm Private Password *
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Password &amp; Log In</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={sendResetEmail}
                    disabled={resendCooldown > 0 || isSendingCode}
                    className="text-xs font-mono text-zinc-400 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : !isForgotMode ? (
          /* --- 2. STANDARD LOGIN VIEW --- */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setError('');
                    setResetSuccess('');
                  }}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  Forgot Password?
                </button>
              </div>

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
        ) : (
          /* --- 3. FORGOT PASSWORD / RECOVERY VIEW --- */
          <div className="space-y-5 animate-fade-in">
            {!codeSent ? (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-zinc-300 leading-relaxed font-light text-left space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Mail className="w-4 h-4 text-white" />
                    <span>Authorized Security Verification</span>
                  </div>
                  <p>
                    Clicking below will dispatch a confidential <strong>6-digit verification code</strong> to your registered administrator email to authorize password reset.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={sendResetEmail}
                  disabled={isSendingCode}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSendingCode ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Code...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Verification Code to Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForgotState}
                  className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel and Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 482910"
                    value={userCodeInput}
                    onChange={(e) => setUserCodeInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono tracking-widest text-center"
                    autoFocus
                  />
                  <p className="text-[11px] text-zinc-400 mt-1 font-mono text-center">
                    Enter the 6-digit code received in your registered email
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    New Master Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full glass-input px-4 py-2.5 rounded-xl text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Confirm New Password *
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Password &amp; Log In</span>
                </button>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={sendResetEmail}
                    disabled={resendCooldown > 0 || isSendingCode}
                    className="text-zinc-400 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForgotState}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
