import React, { useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { Activity, Users, ClipboardList, FlaskConical, Wallet, LogOut, HeartPulse, UserCog, Stethoscope, FileText, ShieldCheck, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import type { User } from './types';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import VisitsPage from './pages/VisitsPage';
import DoctorPage from './pages/DoctorPage';
import LaboratoryPage from './pages/LaboratoryPage';
import BillingPage from './pages/BillingPage';
import UsersPage from './pages/UsersPage';
import RecordsPage from './pages/RecordsPage';

const roleLinks: Record<string,string[]> = {
 ADMIN:['Overview','Patients','Visits','Doctor','Laboratory','Billing','Users','Records'],
 MANAGER:['Overview','Patients','Visits','Laboratory','Billing','Users','Records'],
 RECEPTIONIST:['Overview','Patients','Visits'],
 NURSE:['Overview','Visits'],
 DOCTOR:['Overview','Doctor','Laboratory','Records'],
 LAB_TECHNICIAN:['Overview','Laboratory'],
 CASHIER:['Overview','Billing'],
 ACCOUNTANT:['Overview','Billing'],
 PHARMACIST:['Overview'],
 RECORDS_OFFICER:['Overview','Patients','Visits','Records']
};
const permissions: Record<string,string[]> = {
 '/patients':['ADMIN','MANAGER','RECEPTIONIST','RECORDS_OFFICER','DOCTOR','NURSE'],
 '/visits':['ADMIN','MANAGER','RECEPTIONIST','DOCTOR','NURSE','RECORDS_OFFICER'],
 '/doctor':['ADMIN','DOCTOR'],
 '/laboratory':['ADMIN','MANAGER','DOCTOR','LAB_TECHNICIAN','RECORDS_OFFICER'],
 '/billing':['ADMIN','MANAGER','CASHIER','ACCOUNTANT','RECORDS_OFFICER'],
 '/users':['ADMIN','MANAGER'],
 '/records':['ADMIN','MANAGER','DOCTOR','RECORDS_OFFICER']
};
export default function App() {
 const [user,setUser]=useState<User|null>(()=>{try{return JSON.parse(localStorage.getItem('mediflow-user')||'null')}catch{return null}});
 const [menu,setMenu]=useState(false); const nav=useNavigate(); const {t}=useTranslation();
 const logout=()=>{localStorage.removeItem('mediflow-token');localStorage.removeItem('mediflow-user');setUser(null);nav('/login');};
 const allowed=(path:string)=>!!user&&(permissions[path]||[]).includes(user.role);
 const guarded=(path:string,element:React.ReactNode)=><Route path={path} element={allowed(path)?element:<Navigate to="/" replace/>}/>;
 const iconFor=(label:string)=>label==='Overview'?<Activity/>:label==='Patients'?<Users/>:label==='Visits'?<ClipboardList/>:label==='Doctor'?<Stethoscope/>:label==='Laboratory'?<FlaskConical/>:label==='Billing'?<Wallet/>:label==='Records'?<FileText/>:<UserCog/>;
 return <div className="app-shell">{user?<><aside className={`sidebar ${menu?'show':''}`}>
  <div className="brand"><div className="brand-mark"><HeartPulse/></div><div><b>MEDIFLOW</b><small>CONNECTED CARE SYSTEM</small></div></div>
  <div className="facility"><span className="facility-dot"/> DISPENSARY WORKSPACE</div>
  <nav>{(roleLinks[user.role]||['Overview']).map(x=><NavLink key={x} to={x==='Overview'?'/':`/${x.toLowerCase()}`} onClick={()=>setMenu(false)} className={({isActive})=>isActive?'active':''}>{iconFor(x)}<span>{x==='Overview'?t('overview'):x==='Patients'?t('patients'):x==='Visits'?t('visits'):x==='Laboratory'?t('laboratory'):x==='Billing'?t('billing'):x}</span></NavLink>)}</nav>
  <div className="sidebar-bottom"><div className="security-note"><ShieldCheck/><span>Protected workspace<br/><small>Role-based access enabled</small></span></div><button className="logout" onClick={logout}><LogOut size={17}/>{t('logout')}</button></div>
 </aside><main className="main"><header className="topbar"><button className="icon-button mobile-menu" onClick={()=>setMenu(!menu)}><Menu/></button><div className="crumb">MEDIFLOW <span>/</span> <b>{t('dashboard')}</b></div><div className="top-actions"><select aria-label="Language" value={i18n.language} onChange={e=>i18n.changeLanguage(e.target.value)}><option value="en">English</option><option value="sw">Kiswahili</option><option value="ar">العربية</option></select><div className="user-chip"><div className="avatar">{user.fullName.slice(0,1).toUpperCase()}</div><div><b>{user.fullName}</b><small>{user.role.replaceAll('_',' ')}</small></div></div></div></header>
 <Routes><Route path="/" element={<DashboardPage user={user}/>}/>{guarded('/patients',<PatientsPage user={user}/>)}{guarded('/visits',<VisitsPage user={user}/>)}{guarded('/doctor',<DoctorPage user={user}/>)}{guarded('/laboratory',<LaboratoryPage user={user}/>)}{guarded('/billing',<BillingPage/>)}{guarded('/users',<UsersPage user={user}/>)}{guarded('/records',<RecordsPage user={user}/>)}<Route path="*" element={<Navigate to="/" replace/>}/></Routes>
 </main></>:<Routes><Route path="/login" element={<LoginPage onLogin={u=>setUser(u)}/>}/><Route path="*" element={<Navigate to="/login" replace/>}/></Routes>}</div>;
}
