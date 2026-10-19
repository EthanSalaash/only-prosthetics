'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Calendar, Activity, TrendingUp, Award, User, Zap, Car, Shield, Brain, HandMetal, Package } from 'lucide-react';

export default function ClientView() {
  const { currentUser, usersRegistry, procurements, appointments, inventory, requestProcurement, updateProcurementStatus, bookAppointment } = useApp();
  const [apptDate, setApptDate] = useState('');
  const [apptType, setApptType] = useState('Physiotherapy');

  const liveUserData = usersRegistry.find(u => u.username === currentUser?.username);
  const rehabProgress = liveUserData?.rehabProgress || 0;
  const nextMilestone = liveUserData?.nextMilestone || 'Assessment Pending';

  const myProcurements = procurements.filter(p => p.clientName === currentUser?.username);
  const myAppts = appointments.filter(a => a.clientName === currentUser?.username);

  const getIcon = (name: string) => {
    if (name.includes('Wheelchair')) return Zap;
    if (name.includes('Liner')) return Activity;
    if (name.includes('Glove')) return HandMetal;
    if (name.includes('Matrix')) return Car;
    if (name.includes('Exo')) return Shield;
    if (name.includes('BCI')) return Brain;
    return Package; 
  };

  return (
    <div className="relative space-y-8 p-6 bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.07] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url("/Pta.png")' }}
      />
      
      <div className="relative z-10 space-y-6">
        
        {/* Patient Profile Header */}
        <div className="bg-black/60 p-5 rounded-xl border border-white/10 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-white font-bold text-xl uppercase tracking-wider flex items-center gap-2">
              <User className="w-5 h-5 text-medical-periwinkle" /> {currentUser?.username}
            </h2>
            <p className="text-medical-cerulean text-xs font-mono mt-1.5 flex items-center gap-2">
              <span className="font-bold">DIAGNOSIS:</span> {liveUserData?.injuryCause || 'Condition Details Pending'} 
              <span className="text-neutral-600">|</span> 
              Est. {liveUserData?.injuryYear || 'N/A'}
            </p>
          </div>
          <div className="md:text-right bg-white/5 px-4 py-2 rounded-lg border border-white/5">
            <p className="text-[10px] text-medical-periwinkle uppercase font-bold">Assigned Specialist</p>
            <p className="text-sm font-bold text-white mt-1">{liveUserData?.assignedPro || 'Awaiting Assignment'}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex items-center gap-4 backdrop-blur-sm">
            <div className="p-3 bg-medical-cerulean/20 rounded-lg"><Activity className="text-medical-cerulean w-5 h-5"/></div>
            <div><p className="text-[10px] text-medical-periwinkle uppercase font-bold">Active Clearances</p><p className="text-xl font-mono">{myProcurements.length}</p></div>
          </div>
          <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex items-center gap-4 backdrop-blur-sm">
            <div className="p-3 bg-medical-merlot/20 rounded-lg"><TrendingUp className="text-medical-merlot w-5 h-5"/></div>
            <div><p className="text-[10px] text-medical-periwinkle uppercase font-bold">Rehab Progress</p><p className="text-xl font-mono">{rehabProgress}%</p></div>
          </div>
          <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex items-center gap-4 backdrop-blur-sm">
            <div className="p-3 bg-green-900/20 rounded-lg"><Award className="text-green-500 w-5 h-5"/></div>
            <div><p className="text-[10px] text-medical-periwinkle uppercase font-bold">Next Milestone</p><p className="text-sm font-bold mt-1 text-white truncate max-w-[150px]">{nextMilestone}</p></div>
          </div>
        </div>

        {/* Marketplace Grid w/ Stock Management */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inventory.map((item) => {
            const Icon = getIcon(item.name);
            const inStock = item.stock > 0;
            return (
              <div key={item.id} className={`bg-black/80 rounded-xl border border-white/5 overflow-hidden flex flex-col backdrop-blur-md transition-opacity ${!inStock ? 'opacity-70 grayscale-[50%]' : ''}`}>
                <div className="w-full h-40 bg-black relative">
                  <img src={item.imgSrc} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] text-medical-periwinkle font-mono border border-medical-periwinkle/30">{item.category}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><Icon className="w-4 h-4 text-medical-cerulean" /> {item.name}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-medical-merlot font-mono font-bold text-sm">KES {item.cost.toLocaleString()}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${inStock ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {inStock ? `${item.stock} IN STOCK` : 'OUT OF STOCK'}
                      </span>
                    </div>
                    <button 
                      disabled={!inStock}
                      onClick={() => { requestProcurement(item.name, item.cost, item.requiresClearance); alert('Request logged.'); }} 
                      className={`w-full text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-colors ${inStock ? 'bg-medical-cerulean hover:bg-medical-cerulean/80' : 'bg-neutral-800 cursor-not-allowed text-neutral-500'}`}
                    >
                      {item.requiresClearance ? 'Request Clearance' : 'Procure Direct'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
            <h3 className="text-medical-periwinkle font-bold mb-4 uppercase text-xs">My Orders & Clearances</h3>
            <div className="space-y-2">
              {myProcurements.length === 0 && <p className="text-xs text-neutral-500 italic">No procurements on file.</p>}
              {myProcurements.map(p => (
                <div key={p.id} className="p-3 bg-white/5 rounded flex justify-between items-center text-xs border border-white/5">
                  <span>{p.itemName}</span>
                  <span className={`px-2 py-1 rounded font-mono text-[10px] ${p.status === 'Approved' ? 'bg-green-900/50 text-green-400' : p.status === 'Procured' ? 'bg-medical-cerulean/20 text-medical-cerulean' : 'bg-medical-merlot/20 text-white'}`}>{p.status}</span>
                  {p.status === 'Approved' && <button onClick={() => updateProcurementStatus(p.id, 'Procured')} className="bg-medical-cerulean px-2 py-1 rounded text-white font-bold">Finalize</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
            <h3 className="text-medical-periwinkle font-bold mb-4 uppercase text-xs">Book Specialist {currentUser?.assignedPro ? `(${currentUser.assignedPro})` : ''}</h3>
            {currentUser?.assignedPro ? (
              <>
                <div className="flex gap-2 mb-4">
                  <input type="datetime-local" value={apptDate} onChange={e => setApptDate(e.target.value)} className="bg-black border border-white/10 rounded px-3 py-2 text-xs text-white" />
                  <select value={apptType} onChange={e => setApptType(e.target.value)} className="bg-black border border-white/10 rounded px-3 py-2 text-xs text-white flex-1">
                    <option>Physiotherapy</option><option>Prosthetic Fitting</option><option>Mental Health Therapy</option>
                  </select>
                  <button onClick={() => { if (!apptDate) return alert('Select date.'); bookAppointment(currentUser.assignedPro!, apptDate, apptType); setApptDate(''); }} className="bg-medical-periwinkle px-4 py-2 rounded text-xs font-bold text-black hover:bg-white"><Calendar className="w-4 h-4" /></button>
                </div>
                <div className="space-y-2">
                  {myAppts.length === 0 && <p className="text-xs text-neutral-500 italic">No upcoming appointments.</p>}
                  {myAppts.map(a => <div key={a.id} className="p-3 bg-white/5 rounded text-xs border border-white/5 font-mono"><span className="text-medical-cerulean">{a.date}</span> - {a.type}</div>)}
                </div>
              </>
            ) : (
              <p className="text-xs text-neutral-500 italic">Awaiting supervisor assignment to a professional.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}