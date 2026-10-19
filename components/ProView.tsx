'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Users, Clock, CheckCircle, Stethoscope } from 'lucide-react';

export default function ProView() {
  const { currentUser, updateProProfile, procurements, appointments, updateProcurementStatus, updateClientProgress, usersRegistry } = useApp();
  const [quals, setQuals] = useState(currentUser?.qualifications || '');
  const [mot, setMot] = useState(currentUser?.motivation || '');
  const [progressEdits, setProgressEdits] = useState<Record<string, { p: number, m: string }>>({});

  if (!currentUser?.isVetted) {
    return (
      <div className="bg-black/60 p-6 rounded-xl border border-medical-merlot/50 max-w-xl mx-auto space-y-4 backdrop-blur-sm">
        <h2 className="text-medical-merlot font-bold uppercase">Awaiting Supervisor Vetting</h2>
        <p className="text-xs text-neutral-400">Please detail your clinical qualifications for supervisor review.</p>
        <textarea placeholder="Medical Qualifications & Certifications..." value={quals} onChange={e => setQuals(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-xs" rows={3} />
        <textarea placeholder="Professional Motivation..." value={mot} onChange={e => setMot(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-xs" rows={3} />
        <button onClick={() => { updateProProfile(currentUser!.username, quals, mot); alert('Profile updated.'); }} className="bg-medical-periwinkle w-full py-2 rounded text-black text-xs font-bold uppercase hover:bg-white">Submit for Clearance</button>
      </div>
    );
  }

  const assignedProcurements = procurements.filter(p => p.status === 'Pending Clearance');
  const myAppts = appointments.filter(a => a.proName === currentUser.username);
  const myClients = usersRegistry.filter(u => u.role === 'Client' && u.assignedPro === currentUser.username);

  const handleEditChange = (username: string, field: 'p' | 'm', value: any) => {
    setProgressEdits(prev => ({ ...prev, [username]: { ...prev[username], [field]: value } }));
  };

  const submitProgress = (clientName: string, currentP: number, currentM: string) => {
    const p = progressEdits[clientName]?.p !== undefined ? progressEdits[clientName].p : currentP;
    const m = progressEdits[clientName]?.m !== undefined ? progressEdits[clientName].m : currentM;
    updateClientProgress(clientName, p, m);
    alert(`${clientName}'s progress updated to ${p}%`);
  };

  return (
    <div className="relative space-y-8 p-6 bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.08] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url("/Physiotherapist.png")' }}
      />
      
      <div className="relative z-10 space-y-6">
        
        {/* Specialist Profile Header */}
        <div className="bg-black/80 p-5 rounded-xl border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-white font-bold text-xl uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-medical-cerulean" /> Dr. {currentUser?.username}
            </h2>
            <p className="text-medical-periwinkle text-xs font-mono mt-1.5">
              <span className="font-bold">DISCIPLINE:</span> {currentUser?.specialtyType || 'Clinical Specialist'}
            </p>
          </div>
          <div className="md:text-right bg-white/5 px-4 py-2 rounded-lg border border-white/5">
            <p className="text-[10px] text-medical-periwinkle uppercase font-bold">Clearance Status</p>
            <p className={`text-sm font-bold mt-1 ${currentUser?.isVetted ? 'text-green-400' : 'text-medical-merlot'}`}>
              {currentUser?.isVetted ? 'Active Clinical License' : 'Pending Review'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/80 p-4 rounded-xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
            <div className="p-3 bg-medical-cerulean/20 rounded-lg"><Users className="text-medical-cerulean w-5 h-5"/></div>
            <div><p className="text-[10px] text-medical-periwinkle uppercase font-bold">Assigned Patients</p><p className="text-xl font-mono">{myClients.length}</p></div>
          </div>
          <div className="bg-black/80 p-4 rounded-xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
            <div className="p-3 bg-medical-merlot/20 rounded-lg"><Clock className="text-medical-merlot w-5 h-5"/></div>
            <div><p className="text-[10px] text-medical-periwinkle uppercase font-bold">Upcoming Sessions</p><p className="text-xl font-mono">{myAppts.length}</p></div>
          </div>
          <div className="bg-black/80 p-4 rounded-xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
            <div className="p-3 bg-green-900/20 rounded-lg"><CheckCircle className="text-green-500 w-5 h-5"/></div>
            <div><p className="text-[10px] text-medical-periwinkle uppercase font-bold">Status</p><p className="text-sm font-bold mt-1 text-green-400">Cleared & Active</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
            <h3 className="text-medical-periwinkle font-bold mb-4 uppercase text-xs flex justify-between">Pending Equipment Clearances <span className="bg-medical-merlot/20 text-medical-merlot px-2 rounded">{assignedProcurements.length}</span></h3>
            <div className="space-y-3 h-64 overflow-y-auto pr-2">
              {assignedProcurements.length === 0 && <p className="text-xs text-neutral-500 italic">No pending clearances.</p>}
              {assignedProcurements.map(p => (
                <div key={p.id} className="p-4 bg-white/5 rounded border border-white/5 text-xs flex justify-between items-center">
                  <div><span className="font-bold text-white block">{p.itemName}</span><span className="text-neutral-400">Client: <span className="text-medical-cerulean">{p.clientName}</span></span></div>
                  <button onClick={() => updateProcurementStatus(p.id, 'Approved')} className="bg-medical-cerulean px-3 py-1.5 rounded text-white font-bold hover:bg-medical-cerulean/80 transition-colors">Authorize</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
              <h3 className="text-medical-periwinkle font-bold mb-4 uppercase text-xs">Patient Roster & Progress Update</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {myClients.length === 0 && <p className="text-xs text-neutral-500 italic">No patients assigned.</p>}
                {myClients.map(c => {
                  const currentP = c.rehabProgress || 0;
                  const currentM = c.nextMilestone || '';
                  return (
                    <div key={c.username} className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white uppercase">{c.username}</span>
                        <span className="text-medical-cerulean font-mono">{currentP}%</span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="number" min="0" max="100" placeholder="%" 
                          defaultValue={currentP}
                          onChange={(e) => handleEditChange(c.username, 'p', parseInt(e.target.value))}
                          className="w-16 bg-black border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-medical-cerulean" 
                        />
                        <input 
                          type="text" placeholder="Next Milestone..." 
                          defaultValue={currentM}
                          onChange={(e) => handleEditChange(c.username, 'm', e.target.value)}
                          className="flex-1 bg-black border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-medical-cerulean" 
                        />
                        <button 
                          onClick={() => submitProgress(c.username, currentP, currentM)}
                          className="bg-medical-cerulean text-white font-bold px-3 py-1 rounded hover:bg-medical-cerulean/80"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-black/80 p-6 rounded-xl border border-white/10 backdrop-blur-md">
              <h3 className="text-medical-periwinkle font-bold mb-4 uppercase text-xs">Clinical Timetable</h3>
              <div className="space-y-2 h-32 overflow-y-auto">
                {myAppts.length === 0 && <p className="text-xs text-neutral-500 italic">Schedule empty.</p>}
                {myAppts.map(a => (
                  <div key={a.id} className="p-3 bg-white/5 rounded border border-white/5 text-xs font-mono flex justify-between">
                    <div><span className="text-medical-cerulean font-bold">{a.date}</span> <br/> {a.type}</div>
                    <div className="text-right text-medical-periwinkle">Client: {a.clientName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}