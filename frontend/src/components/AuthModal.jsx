import React, { useState } from 'react';
import { authApi, ApiException } from '../api';

export const AuthModal = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentUser = null,
  onLogout = null,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSwitchForm, setShowSwitchForm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('Please enter a valid email address.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        res = await authApi.register(name.trim(), email.trim(), password);
      } else {
        if (!email.trim()) {
          setError('Please enter your email address.');
          setLoading(false);
          return;
        }
        if (!password) {
          setError('Please enter your password.');
          setLoading(false);
          return;
        }
        res = await authApi.login(email.trim(), password);
      }
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.validationErrors && Object.keys(err.validationErrors).length > 0) {
          const firstErr = Object.values(err.validationErrors)[0];
          setError(firstErr);
        } else {
          setError(err.message);
        }
      } else {
        setError(err?.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsDemoLoading(true);
    const demoEmail = 'alex.rivera@example.com';
    const demoPass = 'password123';
    const demoName = 'Alex Rivera';

    try {
      // Attempt login first with the seeded demo credentials
      const res = await authApi.login(demoEmail, demoPass);
      onAuthSuccess(res.user);
      onClose();
    } catch (loginErr) {
      // If user does not exist in database, register demo user
      if (loginErr.status === 401 || loginErr.status === 404) {
        try {
          const res = await authApi.register(demoName, demoEmail, demoPass);
          onAuthSuccess(res.user);
          onClose();
          return;
        } catch (regErr) {
          setError(regErr.message || 'Could not initialize demo user account.');
          return;
        }
      }
      setError(
        loginErr.message ||
          'Unable to connect to backend server. Please verify Spring Boot is running.'
      );
    } finally {
      setIsDemoLoading(false);
    }
  };

  // If user is already authenticated and has not requested switching accounts, show profile card
  if (currentUser && !showSwitchForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
        <div className="bg-white rounded-xl border border-[#c9d8be] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 border-b border-[#c9d8be]/60 flex items-center justify-between bg-[#f5fbf1]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#326b00]">account_circle</span>
              <h3 className="font-serif font-bold text-lg text-[#111f09]">User Profile</h3>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="text-[#526b3e] hover:text-[#111f09] p-1 rounded hover:bg-[#eef7e8]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-[#f5fbf1] p-3.5 rounded-xl border border-[#c9d8be]/60">
              <div className="w-12 h-12 rounded-full bg-[#77c73d]/25 border border-[#77c73d] flex items-center justify-center text-[#255400] font-bold text-lg">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-serif font-bold text-base text-[#111f09] truncate">
                  {currentUser.name}
                </div>
                <div className="font-sans text-xs text-[#526b3e] truncate">
                  {currentUser.email}
                </div>
                <div className="inline-flex items-center gap-1 mt-1 font-sans text-[10px] text-[#2d6300] bg-[#77c73d]/20 px-2 py-0.5 rounded border border-[#77c73d]/40 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2d6300]"></span>
                  Authenticated Account
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onLogout) onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] font-serif font-bold text-xs rounded-lg border border-[#ffdad6] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Sign Out of Current Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSwitchForm(true);
                  setError(null);
                }}
                className="w-full py-2.5 px-4 bg-[#f5fbf1] hover:bg-[#eef7e8] text-[#111f09] font-serif font-bold text-xs rounded-lg border border-[#c9d8be] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#326b00] text-[16px]">
                  switch_account
                </span>
                <span>Switch / Sign In with Another Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-[#c9d8be] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#c9d8be]/60 flex items-center justify-between bg-[#f5fbf1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">lock</span>
            <h3 className="font-serif font-bold text-lg text-[#111f09]">
              {isRegister ? 'Create Workspace Account' : 'Sign in to DSA Revision OS'}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-[#526b3e] hover:text-[#111f09] p-1 rounded hover:bg-[#eef7e8]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5">
          {error && (
            <div className="p-3 rounded-lg bg-[#ffdad6]/60 border border-[#ba1a1a]/40 text-[#ba1a1a] text-xs font-serif flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-sm font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
              />
            </div>
          )}

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. alex@example.com"
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-sm font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Minimum 6 characters"
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-sm font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs font-serif text-[#326b00] hover:underline cursor-pointer"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Register"}
            </button>

            <button
              type="submit"
              disabled={loading || isDemoLoading}
              className="px-4 py-2 rounded-lg bg-[#77c73d] text-[#112600] font-serif font-bold text-xs hover:bg-[#89db4f] transition-colors border border-[#64b02d] shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading
                ? isRegister
                  ? 'Creating Account...'
                  : 'Signing In...'
                : isRegister
                ? 'Register & Enter'
                : 'Sign In'}
            </button>
          </div>

          {/* Quick Demo Section */}
          <div className="mt-3 pt-3 border-t border-[#c9d8be]/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e] font-semibold">
                Instant Evaluator Access
              </span>
              <span className="font-sans text-[10px] text-[#2d6300] font-bold">
                demo / password123
              </span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading || isDemoLoading}
              className="w-full py-2 px-3 bg-[#eef7e8] hover:bg-[#e2f2da] text-[#111f09] font-serif font-bold text-xs rounded-lg border border-[#c9d8be] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[#326b00] text-[16px]">bolt</span>
              <span>
                {isDemoLoading
                  ? 'Authenticating Demo User...'
                  : '1-Click Demo Login (Alex Rivera)'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

