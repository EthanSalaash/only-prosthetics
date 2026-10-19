'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { ShieldCheck, User, Stethoscope, Briefcase } from 'lucide-react';

export default function AuthPortal() {
  const { login, signUp } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Client' | 'Professional' | 'Supervisor'>('Client');
  
  // Role-specific fields
  const [injuryCause, setInjuryCause] = useState('');
  const [injuryYear, setInjuryYear] = useState('');
  const [specialtyType, setSpecialtyType] = useState('');
  
  const [statusMessage, setStatusMessage] = useState({ isError: false, text: '' });

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => currentYear - index);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ isError: false, text: '' });

    if (!username.trim() || !password) return;

    if (isSignUp) {
      if (password !== confirmPassword) {
        return setStatusMessage({ isError: true, text: 'Passwords do not match.' });
      }
      if (role === 'Client' && (!injuryCause || !injuryYear)) {
        return setStatusMessage({ isError: true, text: 'Please fill out all medical history fields.' });
      }
      if (role === 'Professional' && !specialtyType) {
        return setStatusMessage({ isError: true, text: 'Please select your medical specialty.' });
      }

      const extraDetails = {
        ...(role === 'Client' && { injuryCause, injuryYear }),
        ...(role === 'Professional' && { specialtyType })
      };

      const response = signUp(username, password, role, extraDetails);
      if (!response.success) setStatusMessage({ isError: true, text: response.msg });
    } else {
      const response = login(username, password);
      if (!response.success) setStatusMessage({ isError: true, text: response.msg });
    }
  };

  return (
    <div className="relative min-h-screen bg-medical-dark flex items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Dynamic Background Collage - Fully Visible & Seamlessly Blended */}
      <div className="absolute inset-0 flex flex-col md:flex-row z-0 pointer-events-none">
        
        {/* Left Pane */}
        <div className="relative h-full w-full md:w-1/3 flex-1">
          <img src="/Physio.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          {/* Gradient blends the right edge into the next image */}
          <div className="absolute inset-0 bg-gradient-to-r from-medical-dark/40 via-transparent to-medical-dark border-r border-transparent" />
        </div>
        
        {/* Center Pane */}
        <div className="relative h-full w-full md:w-1/3 flex-1">
          <img src="/Physiotherapist.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          {/* Gradients blend both left and right edges seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-r from-medical-dark via-transparent to-medical-dark" />
        </div>
        
        {/* Right Pane */}
        <div className="relative h-full w-full md:w-1/3 flex-1">
          <img src="/Pta.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          {/* Gradient blends the left edge into the center image */}
          <div className="absolute inset-0 bg-gradient-to-l from-medical-dark/40 via-transparent to-medical-dark" />
        </div>

      </div>

      {/* Global Dark Overlay to ensure the white text remains readable over bright photos */}
      <div className="absolute inset-0 bg-medical-dark/40 z-0 pointer-events-none" />

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-md p-8 bg-medical-dark/85 border border-medical-periwinkle/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)] text-white backdrop-blur-xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold tracking-wide text-medical-cerulean">onlyPROsthetics</h3>
          <p className="text-xs text-neutral-300 mt-1">{isSignUp ? 'Initialize Access Node' : 'Secure Portal Login'}</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {statusMessage.text && (
            <div className={`p-3 rounded-lg text-xs font-mono text-center border ${statusMessage.isError ? 'bg-red-900/40 text-red-300 border-red-900/50' : 'bg-medical-cerulean/30 text-medical-cerulean border-medical-cerulean/50'}`}>
              {statusMessage.text}
            </div>
          )}
          
          {isSignUp && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button type="button" onClick={() => setRole('Client')} className={`p-2 rounded-lg border text-[10px] font-bold uppercase flex flex-col items-center gap-1 ${role === 'Client' ? 'bg-medical-cerulean border-medical-cerulean text-white shadow-lg' : 'bg-black/40 border-white/10 text-neutral-400 hover:bg-white/5'}`}><User className="w-4 h-4" /> Client</button>
              <button type="button" onClick={() => setRole('Professional')} className={`p-2 rounded-lg border text-[10px] font-bold uppercase flex flex-col items-center gap-1 ${role === 'Professional' ? 'bg-medical-periwinkle border-medical-periwinkle text-medical-dark shadow-lg' : 'bg-black/40 border-white/10 text-neutral-400 hover:bg-white/5'}`}><Stethoscope className="w-4 h-4" /> Specialist</button>
              <button type="button" onClick={() => setRole('Supervisor')} className={`p-2 rounded-lg border text-[10px] font-bold uppercase flex flex-col items-center gap-1 ${role === 'Supervisor' ? 'bg-medical-merlot border-medical-merlot text-white shadow-lg' : 'bg-black/40 border-white/10 text-neutral-400 hover:bg-white/5'}`}><Briefcase className="w-4 h-4" /> Supervisor</button>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-medical-periwinkle uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              required 
              autoComplete="off"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-medical-cerulean transition-colors" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-medical-periwinkle uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required 
              autoComplete="new-password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-medical-cerulean transition-colors" 
            />
          </div>

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-medical-periwinkle uppercase tracking-wider">Confirm Password</label>
              <input 
                type="password" 
                required 
                autoComplete="new-password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-medical-cerulean transition-colors" 
              />
            </div>
          )}

          {/* Client Specific Fields */}
          {isSignUp && role === 'Client' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-medical-cerulean uppercase tracking-wider">Primary Cause of Condition</label>
                <select required value={injuryCause} onChange={(e) => setInjuryCause(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-medical-cerulean">
                  <option value="">-- Select Cause --</option>
                  <option value="Traumatic Amputation (Accident/Injury)">Traumatic Amputation (Accident/Injury)</option>
                  <option value="Combat / Military Altercation">Combat / Military Altercation</option>
                  <option value="Congenital / Genetic Condition">Congenital / Genetic Condition</option>
                  <option value="Disease / Infection (e.g., Diabetes, Sepsis)">Disease / Infection (e.g., Diabetes, Sepsis)</option>
                  <option value="Neurological Disorder">Neurological Disorder</option>
                  <option value="Spinal Cord Injury">Spinal Cord Injury</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-medical-cerulean uppercase tracking-wider">Year of Occurrence / Diagnosis</label>
                <select required value={injuryYear} onChange={(e) => setInjuryYear(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-medical-cerulean">
                  <option value="">-- Select Year --</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Specialist Specific Fields */}
          {isSignUp && role === 'Professional' && (
            <div className="space-y-1 pt-2">
              <label className="text-[10px] font-bold text-medical-cerulean uppercase tracking-wider">Medical Specialty</label>
              <select required value={specialtyType} onChange={(e) => setSpecialtyType(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-medical-cerulean">
                <option value="">-- Select Profession --</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                <option value="Prosthetist / Orthotist">Prosthetist / Orthotist</option>
                <option value="Physiotherapist">Physiotherapist</option>
                <option value="Occupational Therapist">Occupational Therapist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Driver Rehabilitation Specialist (DRS)">Driver Rehabilitation Specialist (DRS)</option>
                <option value="Psychiatrist / Mental Health Counselor">Psychiatrist / Mental Health Counselor</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-medical-cerulean hover:bg-medical-cerulean/80 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all mt-4 flex items-center justify-center gap-2 text-white cursor-pointer shadow-lg shadow-medical-cerulean/20">
            <ShieldCheck className="w-4 h-4" /> {isSignUp ? 'Initialize Profile' : 'Authenticate'}
          </button>
          
          <div className="pt-2 text-center">
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-medical-periwinkle hover:text-white transition-colors cursor-pointer">
              {isSignUp ? 'Already registered? Log in here' : "Need an account? Register here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}