import React, { useEffect, useState } from 'react';
import {
  Activity, Users, ClipboardList, FlaskConical, Wallet, LogOut, Languages,
  Plus, Search, ShieldCheck, Stethoscope, ArrowUpRight, Download, Menu,
  HeartPulse, UserCog, TestTube2, FileText, CheckCircle2, Clock3, Package,
  LockKeyhole, RefreshCw, FileSpreadsheet, FileDown, Eye, EyeOff, Heart,
  Thermometer, Weight, Ruler, Droplets, Wind, Gauge, CalendarDays, UserRound,
  ChevronRight, Sparkles, ShieldCheck as ShieldIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, downloadCsv } from '../api';
import { PageTitle, Stat, DataTable } from '../components/shared';
import type { User, Patient } from '../types';

function Dashboard({user}:{user:User}){
 const {t}=useTranslation();const [patients,setPatients]=useState<Patient[]>([]);const [visits,setVisits]=useState<any[]>([]);const [labs,setLabs]=useState<any[]>([]);const [bills,setBills]=useState<any[]>([]);
 const refresh=()=>{api.get('/patients').then(r=>setPatients(r.data)).catch(()=>{});api.get('/visits').then(r=>setVisits(r.data)).catch(()=>{});api.get('/lab/orders').then(r=>setLabs(r.data)).catch(()=>{});api.get('/billing/invoices').then(r=>setBills(r.data)).catch(()=>{})};
 useEffect(()=>{refresh()},[]);
 const waiting=visits.filter(v=>['WAITING_FOR_DOCTOR','AWAITING_LAB','RESULTS_READY_FOR_DOCTOR'].includes(v.status)).length;
 const pending=labs.filter(x=>x.status!=='VERIFIED').length;const unpaid=bills.filter(x=>x.status!=='PAID').length;
 return <div className="content"><PageTitle eyebrow="DISPENSARY OVERVIEW" title={`${t('welcome')}, ${user.fullName.split(' ')[0]}`} desc="A live view of patient care, department handovers and daily operations." action={<button className="secondary" onClick={refresh}><RefreshCw size={15}/> Refresh</button>}/><div className="welcome-banner"><div><span className="banner-tag"><span/> CONNECTED CARE</span><h2>Every handover matters.<br/>Every patient comes first.</h2><p>One secure patient journey from reception to final medical record.</p></div><div className="banner-graphic"><div className="orb"><HeartPulse size={54}/></div><div className="orbit orbit1"/><div className="orbit orbit2"/></div></div><div className="section-heading"><div><h2>Operational snapshot</h2><p>Information available to your assigned role</p></div><span className="live-label"><i/> SYSTEM OVERVIEW</span></div><div className="stat-grid"><Stat icon={<Users/>} label="Registered patients" value={patients.length} tone="cyan" note="Patient records"/><Stat icon={<ClipboardList/>} label="Total visits" value={visits.length} tone="blue" note="Recorded encounters"/><Stat icon={<Clock3/>} label="Active patient flow" value={waiting} tone="purple" note="Awaiting next department"/><Stat icon={<FlaskConical/>} label="Pending lab work" value={pending+unpaid} tone="amber" note="Lab items + unpaid invoices"/></div><div className="dashboard-grid"><section className="panel"><div className="panel-head"><div><h3>Patient care pathway</h3><p>Connected departmental handovers</p></div><Activity/></div><div className="workflow">{[['01','Reception','Register patient and create visit','cyan'],['02','Doctor','Document symptoms and request tests','blue'],['03','Laboratory','Enter and submit test results','purple'],['04','Doctor review','Review results and finalize advice','amber'],['05','Billing & records','Payment and complete patient file','green']].map(a=><div className="workflow-row" key={a[0]}><span className={`step ${a[3]}`}>{a[0]}</span><div><b>{a[1]}</b><small>{a[2]}</small></div><span className="flow-line"/></div>)}</div></section><section className="panel"><div className="panel-head"><div><h3>Recent patients</h3><p>Latest registered records</p></div><Users/></div><div className="mini-list">{patients.slice(0,6).map(p=><div className="mini-row" key={p.id}><div className="avatar soft">{p.fullName.slice(0,1)}</div><div><b>{p.fullName}</b><small>{p.patientNumber}</small></div><span>{p.sex||'—'}</span></div>)}{!patients.length&&<div className="empty">{t('noData')}</div>}</div></section></div></div>
}
export default Dashboard;
