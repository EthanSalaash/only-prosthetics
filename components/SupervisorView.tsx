'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { ShieldAlert, BarChart3, Stethoscope, Activity, Link as LinkIcon, Package } from 'lucide-react';

export default function SupervisorView() {
  const { usersRegistry, procurements, appointments, inventory, vetProfessional, assignClientToPro, updateItemStock } = useApp();
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPro, setSelectedPro] = useState('');

  const professionals = usersRegistry.filter(u => u.role === 'Professional');
  const clients = usersRegistry.filter(u => u.role === 'Client');
  const totalRevenue = procurements.filter(p => p.status === 'Procured').reduce((acc, curr) => acc + curr.cost, 0);

  const activeClientData = clients.find(c => c.username === selectedClient);
  const activeProData = professionals.find(p => p.username === selectedPro);

  return (
    <div className="relative space-y-6 p-6 bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.06] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url("/Physio.png")' }}
      />

      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/80 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-medical-periwinkle uppercase font-bold mb-1">Registered Clients</p>
            <p className="text-2xl font-mono text-white">{clients.length}</p>
          </div>
          <div className="bg-black/80 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-medical-periwinkle uppercase font-bold mb-1">Active Specialists</p>
            <p className="text-2xl font-mono text-white">{professionals.filter(p => p.isVetted).length} <span className="text-xs text-medical-merlot">/ {professionals.length}</span></p>
          </div>
          <div className="bg-black/80 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-medical-periwinkle uppercase font-bold mb-1">Procurement Revenue</p>
            <p className="text-xl font-mono text-medical-cerulean">KES {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-black/80 p-4 rounded-xl border border-medical-merlot/30 backdrop-blur-md flex flex-col justify-center items-center text-center">
            <ShieldAlert className="w-5 h-5 text-medical-merlot mb-1" />
            <p className="text-[10px] text-medical-merlot uppercase font-bold">System Secure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            
            <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
              <h3 className="text-medical-merlot font-bold mb-4 uppercase text-xs flex items-center gap-2"><Stethoscope className="w-4 h-4"/> Vetting Center</h3>
              <div className="grid grid-cols-1 gap-4 h-64 overflow-y-auto pr-2">
                {professionals.filter(p => !p.isVetted).length === 0 && <p className="text-xs text-neutral-500 italic">No professionals awaiting clearance.</p>}
                {professionals.filter(p => !p.isVetted).map(p => (
                  <div key={p.username} className="p-4 bg-white/5 rounded border border-medical-merlot/30 text-xs relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-medical-merlot"></div>
                    <span className="font-bold text-white text-sm block mb-2">{p.username} <span className="text-[10px] font-normal text-medical-periwinkle border border-medical-periwinkle/30 px-2 py-0.5 rounded ml-2">{p.specialtyType}</span></span>
                    <p className="text-neutral-400 mb-1"><strong>Quals:</strong> {p.qualifications || 'Pending'}</p>
                    <p className="text-neutral-400 mb-3"><strong>Motivation:</strong> {p.motivation || 'Pending'}</p>
                    <button onClick={() => vetProfessional(p.username, true)} className="bg-medical-merlot px-4 py-2 rounded text-white font-bold uppercase text-[10px] hover:bg-medical-merlot/80 transition-colors">Approve Specialist</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
              <h3 className="text-medical-cerulean font-bold mb-4 uppercase text-xs">Assign Clients to Specialists</h3>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="bg-black border border-white/10 rounded px-3 py-2 text-xs text-white flex-1 truncate">
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.username} value={c.username}>{c.username} - {c.injuryCause || 'No Details'}</option>)}
                  </select>
                  <select value={selectedPro} onChange={e => setSelectedPro(e.target.value)} className="bg-black border border-white/10 rounded px-3 py-2 text-xs text-white flex-1 truncate">
                    <option value="">Select Specialist</option>
                    {professionals.filter(p => p.isVetted).map(p => <option key={p.username} value={p.username}>{p.username} - {p.specialtyType}</option>)}
                  </select>
                </div>
                {(selectedClient || selectedPro) && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg border border-white/10 text-xs">
                    <div>
                      <span className="text-medical-periwinkle font-bold uppercase block mb-2 border-b border-white/10 pb-1">Client Diagnosis</span>
                      {activeClientData ? (
                        <><p className="text-white font-bold uppercase">{activeClientData.username}</p><p className="text-neutral-400 mt-1 leading-relaxed"><strong className="text-medical-periwinkle">Condition:</strong> {activeClientData.injuryCause}</p><p className="text-neutral-400 leading-relaxed"><strong className="text-medical-periwinkle">Year:</strong> {activeClientData.injuryYear}</p></>
                      ) : <p className="text-neutral-600 italic">None selected</p>}
                    </div>
                    <div>
                      <span className="text-medical-cerulean font-bold uppercase block mb-2 border-b border-white/10 pb-1">Specialist Profile</span>
                      {activeProData ? (
                        <><p className="text-white font-bold uppercase">{activeProData.username}</p><p className="text-neutral-400 mt-1 leading-relaxed"><strong className="text-medical-cerulean">Discipline:</strong> {activeProData.specialtyType}</p></>
                      ) : <p className="text-neutral-600 italic">None selected</p>}
                    </div>
                  </div>
                )}
                <button onClick={() => { if(selectedClient && selectedPro) { assignClientToPro(selectedClient, selectedPro); alert('Account mapping synchronized.'); setSelectedClient(''); setSelectedPro(''); } else { alert('Select both a Client and a Specialist.'); } }} className="bg-medical-cerulean px-4 py-3 rounded-lg text-xs font-bold text-white hover:bg-medical-cerulean/80 flex items-center justify-center gap-2 transition-colors"><LinkIcon className="w-4 h-4" /> Link Profiles</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
              <h3 className="text-medical-periwinkle font-bold mb-4 uppercase text-xs flex items-center gap-2"><Activity className="w-4 h-4"/> Global Patient Progress</h3>
              <div className="h-[200px] overflow-y-auto space-y-2 pr-2">
                {clients.length === 0 && <p className="text-xs text-neutral-500 italic">No clients registered.</p>}
                {clients.map(c => (
                  <div key={c.username} className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white uppercase">{c.username}</span>
                      <p className="text-neutral-500 mt-1">Specialist: {c.assignedPro || 'Unassigned'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-medical-cerulean font-mono text-sm">{c.rehabProgress || 0}%</span>
                      <p className="text-[10px] text-neutral-400 mt-1 max-w-[120px] truncate">{c.nextMilestone || 'Pending'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
              <h3 className="text-medical-periwinkle font-bold mb-4 uppercase text-xs flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Registry Activity</h3>
              <div className="h-[200px] overflow-y-auto space-y-2 text-[10px] font-mono pr-2">
                <h4 className="text-white border-b border-white/10 pb-1 mb-2 bg-black/40 sticky top-0 p-1">Procurement Pipeline</h4>
                {procurements.length === 0 && <p className="text-neutral-600">No active procurements.</p>}
                {procurements.slice().reverse().map(p => (
                  <div key={p.id} className="text-neutral-400 p-2 bg-white/5 rounded flex justify-between">
                    <span><span className={p.status === 'Procured' ? 'text-green-400' : 'text-medical-merlot'}>[{p.status}]</span> {p.clientName}</span>
                    <span className="truncate ml-2">{p.itemName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Inventory Stock Controls */}
        <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
          <h3 className="text-medical-cerulean font-bold mb-4 uppercase text-xs flex items-center gap-2">
            <Package className="w-4 h-4"/> Inventory Stock Controller
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center text-xs hover:bg-white/10 transition-colors">
                <div className="flex-1 truncate pr-4">
                  <span className="font-bold text-white block uppercase truncate">{item.name}</span>
                  <span className="text-medical-periwinkle font-mono text-[10px]">KES {item.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-lg border border-white/10">
                  <button onClick={() => updateItemStock(item.id, -1)} disabled={item.stock === 0} className="text-medical-merlot hover:bg-medical-merlot/20 disabled:opacity-30 disabled:hover:bg-transparent w-7 h-7 rounded flex items-center justify-center font-bold text-lg leading-none transition-colors">-</button>
                  <span className="text-white font-mono font-bold w-6 text-center">{item.stock}</span>
                  <button onClick={() => updateItemStock(item.id, 1)} className="text-medical-cerulean hover:bg-medical-cerulean/20 w-7 h-7 rounded flex items-center justify-center font-bold text-lg leading-none transition-colors">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}