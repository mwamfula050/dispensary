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

function Patients({user}:{user:User}){
 const {t}=useTranslation();const [rows,setRows]=useState<Patient[]>([]);const [q,setQ]=useState('');const [form,setForm]=useState(false);const [name,N]=useState('');const [phone,P]=useState('');const [dob,D]=useState('');const [sex,S]=useState('');const [address,A]=useState('');const [error,E]=useState('');
 const load=()=>api.get('/patients',{params:{q}}).then(r=>setRows(r.data)).catch(()=>{});useEffect(()=>{load()},[q]);
 async function save(e:React.FormEvent){e.preventDefault();E('');try{await api.post('/patients',{fullName:name,phone,dateOfBirth:dob||null,sex,address});N('');P('');D('');S('');A('');setForm(false);load()}catch{E('Unable to save patient. Check required fields and permissions.')}}
 const canRegister=['ADMIN','MANAGER','RECEPTIONIST','RECORDS_OFFICER'].includes(user.role);
 return <div className="content"><PageTitle eyebrow="PATIENT RECORDS" title={t('patients')} desc="Register patients and automatically open their first visit for nursing triage." action={canRegister?<button className="primary" onClick={()=>setForm(!form)}><Plus size={17}/> Register patient</button>:undefined}/>{form&&<form className="panel form-grid" onSubmit={save}><h3 className="span-all">New patient registration</h3><label>Full name<input required value={name} onChange={e=>N(e.target.value)}/></label><label>Phone number<input value={phone} onChange={e=>P(e.target.value)}/></label><label>Date of birth<input type="date" value={dob} onChange={e=>D(e.target.value)}/></label><label>Sex<select required value={sex} onChange={e=>S(e.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></label><label className="span-all">Address<input value={address} onChange={e=>A(e.target.value)}/></label>{error&&<p className="error span-all">{error}</p>}<div className="span-all"><button className="primary">Register patient & create visit</button></div></form>}<section className="panel table-panel"><div className="table-toolbar"><div className="searchbox"><Search/><input placeholder={t('search')} value={q} onChange={e=>setQ(e.target.value)}/></div><button className="secondary" onClick={()=>downloadCsv('mediflow-patients.csv',rows as any)}><Download size={16}/> Export CSV</button></div><DataTable headers={['Patient ID','Patient name','Phone','Sex','Date of birth']} rows={rows.map(p=>[p.patientNumber,p.fullName,p.phone,p.sex,p.dateOfBirth])}/></section></div>
}
export default Patients;
