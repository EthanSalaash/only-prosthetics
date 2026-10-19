'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PROSTHETIC_INVENTORY } from './MarketData';

export type UserRole = 'Client' | 'Professional' | 'Supervisor';

export interface UserAccount {
  username: string;
  passwordHash: string;
  role: UserRole;
  isVetted?: boolean;
  qualifications?: string;
  motivation?: string;
  assignedPro?: string;
  injuryCause?: string;
  injuryYear?: string;
  specialtyType?: string;
  rehabProgress?: number;
  nextMilestone?: string;
}

export interface Procurement {
  id: string;
  clientName: string;
  itemName: string;
  cost: number;
  status: 'Pending Clearance' | 'Approved' | 'Procured';
  timestamp: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  proName: string;
  date: string;
  type: string;
  status: 'Scheduled' | 'Completed';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imgSrc: string;
  requiresClearance: boolean;
  cost: number;
  stock: number; // New stock tracking property
}

interface AppContextType {
  currentUser: UserAccount | null;
  usersRegistry: UserAccount[];
  procurements: Procurement[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  signUp: (username: string, pass: string, role: UserRole, extraDetails?: any) => { success: boolean; msg: string };
  login: (username: string, pass: string) => { success: boolean; msg: string };
  logout: () => void;
  updateProProfile: (username: string, quals: string, motivation: string) => void;
  vetProfessional: (username: string, approved: boolean) => void;
  assignClientToPro: (clientName: string, proName: string) => void;
  updateClientProgress: (clientName: string, progress: number, milestone: string) => void;
  requestProcurement: (itemName: string, cost: number, requiresClearance: boolean) => void;
  updateProcurementStatus: (id: string, status: 'Approved' | 'Procured') => void;
  bookAppointment: (proName: string, date: string, type: string) => void;
  updateItemStock: (id: string, delta: number) => void; // Replaced complex CRUD with simple +/-
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [usersRegistry, setUsersRegistry] = useState<UserAccount[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('op_users');
    const savedProcurements = localStorage.getItem('op_procurements');
    const savedAppts = localStorage.getItem('op_appointments');
    const savedInventory = localStorage.getItem('op_inventory');
    const sessionUser = sessionStorage.getItem('op_current_user');

    if (savedUsers) setUsersRegistry(JSON.parse(savedUsers));
    else setUsersRegistry([{ username: 'admin', passwordHash: 'admin123', role: 'Supervisor' }]);
    
    if (savedProcurements) setProcurements(JSON.parse(savedProcurements));
    if (savedAppts) setAppointments(JSON.parse(savedAppts));
    if (sessionUser) setCurrentUser(JSON.parse(sessionUser));
    
    if (savedInventory) {
      const parsedInv = JSON.parse(savedInventory);
      // Ensure existing databases get the new stock property appended to them
      setInventory(parsedInv.map((item: any) => ({ ...item, stock: item.stock ?? 10 })));
    } else {
      const initialInventory = PROSTHETIC_INVENTORY.map(({ icon, ...rest }) => ({ ...rest, stock: 10 }));
      setInventory(initialInventory);
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('op_users', JSON.stringify(usersRegistry));
      localStorage.setItem('op_procurements', JSON.stringify(procurements));
      localStorage.setItem('op_appointments', JSON.stringify(appointments));
      localStorage.setItem('op_inventory', JSON.stringify(inventory));
    }
  }, [usersRegistry, procurements, appointments, inventory, isLoaded]);

  const signUp = (username: string, pass: string, role: UserRole, extraDetails: any = {}) => {
    const cleanName = username.trim().toLowerCase();
    if (usersRegistry.some(u => u.username === cleanName)) return { success: false, msg: 'Username taken.' };
    
    const newUser: UserAccount = { 
      username: cleanName, passwordHash: pass, role, 
      isVetted: role === 'Professional' ? false : undefined,
      rehabProgress: role === 'Client' ? 0 : undefined,
      nextMilestone: role === 'Client' ? 'Pending Initial Assessment' : undefined,
      ...extraDetails
    };
    
    setUsersRegistry(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    sessionStorage.setItem('op_current_user', JSON.stringify(newUser));
    return { success: true, msg: 'Registered successfully.' };
  };

  const login = (username: string, pass: string) => {
    const cleanName = username.trim().toLowerCase();
    const user = usersRegistry.find(u => u.username === cleanName);
    if (!user || user.passwordHash !== pass) return { success: false, msg: 'Invalid credentials.' };
    setCurrentUser(user);
    sessionStorage.setItem('op_current_user', JSON.stringify(user));
    return { success: true, msg: 'Login successful.' };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('op_current_user');
  };

  const updateProProfile = (un: string, q: string, m: string) => setUsersRegistry(prev => prev.map(u => u.username === un ? { ...u, qualifications: q, motivation: m } : u));
  const vetProfessional = (un: string, approved: boolean) => setUsersRegistry(prev => prev.map(u => u.username === un ? { ...u, isVetted: approved } : u));
  const assignClientToPro = (cn: string, pn: string) => setUsersRegistry(prev => prev.map(u => u.username === cn ? { ...u, assignedPro: pn } : u));
  const updateClientProgress = (clientName: string, progress: number, milestone: string) => setUsersRegistry(prev => prev.map(u => u.username === clientName ? { ...u, rehabProgress: progress, nextMilestone: milestone } : u));

  const requestProcurement = (itemName: string, cost: number, reqClearance: boolean) => {
    if (!currentUser) return;
    const newProc: Procurement = { id: `PRC-${Math.floor(1000 + Math.random() * 9000)}`, clientName: currentUser.username, itemName, cost, status: reqClearance ? 'Pending Clearance' : 'Approved', timestamp: new Date().toLocaleDateString() };
    setProcurements(prev => [...prev, newProc]);
  };

  // If a purchase is finalized, deduct 1 from the stock automatically
  const updateProcurementStatus = (id: string, status: 'Approved' | 'Procured') => {
    setProcurements(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    if (status === 'Procured') {
      const proc = procurements.find(p => p.id === id);
      if (proc) {
        setInventory(prev => prev.map(inv => inv.name === proc.itemName ? { ...inv, stock: Math.max(0, inv.stock - 1) } : inv));
      }
    }
  };
  
  const bookAppointment = (pn: string, date: string, type: string) => {
    if (!currentUser) return;
    setAppointments(prev => [...prev, { id: `APT-${Math.floor(1000+Math.random()*9000)}`, clientName: currentUser.username, proName: pn, date, type, status: 'Scheduled' }]);
  };

  // Simple +/- stock function
  const updateItemStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i));
  };

  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{ currentUser, usersRegistry, procurements, appointments, inventory, signUp, login, logout, updateProProfile, vetProfessional, assignClientToPro, updateClientProgress, requestProcurement, updateProcurementStatus, bookAppointment, updateItemStock }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};