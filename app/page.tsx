'use client';

import React from 'react';
import { AppProvider, useApp } from '../components/AppContext';
import AuthPortal from '../components/AuthPortal';
import ClientView from '../components/ClientView';
import ProView from '../components/ProView';
import SupervisorView from '../components/SupervisorView';
import { LogOut, LayoutDashboard } from 'lucide-react';

function DashboardRouter() {
  const { currentUser, logout } = useApp();

  if (!currentUser) return <AuthPortal />;

  return (
    <div className="min-h-screen bg-medical-dark text-white p-6 md:p-12 selection:bg-medical-cerulean">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-medical-cerulean/20 p-2.5 rounded-xl border border-medical-cerulean/50">
              <LayoutDashboard className="w-6 h-6 text-medical-cerulean" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">onlyPROsthetics</h1>
              <p className="text-xs text-neutral-400 font-mono mt-1">Logged in as: <span className="text-medical-periwinkle">{currentUser.username}</span> [{currentUser.role}]</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-xs bg-black/40 border border-white/10 hover:border-medical-merlot hover:text-medical-merlot px-4 py-2 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </header>

        {currentUser.role === 'Client' && <ClientView />}
        {currentUser.role === 'Professional' && <ProView />}
        {currentUser.role === 'Supervisor' && <SupervisorView />}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardRouter />
    </AppProvider>
  );
}