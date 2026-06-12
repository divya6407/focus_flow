import React, { useState } from 'react';
import { CheckSquare, Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InputField = ({ icon: Icon, type, placeholder, value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1">
      <div className={`flex items-center gap-3 bg-[#1a1a1a] border ${error ? 'border-red-500/60' : 'border-[#2a2a2a]'} rounded-xl px-4 py-3 focus-within:border-[#22c55e] transition-colors`}>
        <Icon size={16} className="text-[#555] shrink-0" />
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent text-white text-sm placeholder-[#444] outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#555] hover:text-[#888] transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs pl-1">{error}</p>}
    </div>
  );
};

const AuthPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (mode === 'register' && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (mode === 'register' && form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    let result;
    if (mode === 'login') {
      result = await login(form.email, form.password);
    } else {
      result = await register(form.name, form.email, form.password);
    }
    setLoading(false);

    if (!result.success) {
      setServerError(result.msg || 'Something went wrong. Please try again.');
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setForm({ name: '', email: '', password: '', confirm: '' });
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">

      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-lg shadow-[#22c55e]/20">
            <CheckSquare size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none tracking-widest uppercase">Focus Flow</h1>
            <p className="text-[#555] text-[10px] mt-0.5 tracking-wider">Stay organized, get more done.</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161616] border border-[#222] rounded-2xl p-8 shadow-2xl">

          {/* Tab switcher */}
          <div className="flex bg-[#111] rounded-xl p-1 mb-8">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => switchMode()}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-[#22c55e] text-black shadow-sm'
                    : 'text-[#666] hover:text-[#999]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-white font-bold text-xl">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-[#555] text-sm mt-1">
              {mode === 'login'
                ? 'Sign in to continue managing your tasks.'
                : 'Get started with Focus Flow for free.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <InputField
                icon={User}
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={set('name')}
                error={errors.name}
              />
            )}
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
            />
            <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
            />
            {mode === 'register' && (
              <InputField
                icon={Lock}
                type="password"
                placeholder="Confirm password"
                value={form.confirm}
                onChange={set('confirm')}
                error={errors.confirm}
              />
            )}

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {serverError}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-sm rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#22c55e]/10"
              >
                {loading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer switch */}
          <p className="text-center text-[#555] text-sm mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={switchMode}
              className="text-[#22c55e] hover:text-[#4ade80] font-semibold transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-[#333] text-xs mt-6">
          © {new Date().getFullYear()} Focus Flow · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
