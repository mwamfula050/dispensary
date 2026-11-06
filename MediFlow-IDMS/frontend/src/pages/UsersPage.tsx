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

function UsersPage({user}:{user:User}){const [rows,setRows]=useState<any[]>([]);const [username,U]=useState('');const [name,N]=useState('');const [password,P]=useState('');const [role,R]=useState('RECEPTIONIST');const [msg,M]=useState('');const load=()=>api.get('/users').then(r=>setRows(r.data)).catch(()=>{});useEffect(()=>{load()},[]);async function create(e:React.FormEvent){e.preventDefault();try{await api.post('/users',{username,fullName:name,password,role});M('User created successfully.');U('');N('');P('');load()}catch{M('Could not create user. Check permissions, username and password length.')}}async function toggle(id:number,enabled:boolean){try{await api.patch(`/users/${id}/enabled`,{enabled:!enabled});load()}catch{M('Only ADMIN can enable or disable accounts.')}}return <div className="content"><PageTitle eyebrow="ACCESS CONTROL" title="User management" desc="Create staff accounts and disable access when a staff member is not authorized."/><form className="panel form-grid" onSubmit={create}><h3 className="span-all">Create staff account</h3><label>Full name<input required value={name} onChange={e=>N(e.target.value)}/></label><label>Username<input required minLength={3} value={username} onChange={e=>U(e.target.value)}/></label><label>Password (14+ characters)<input required minLength={14} type="password" value={password} onChange={e=>P(e.target.value)}/></label><label>Role<select value={role} onChange={e=>R(e.target.value)}>{['MANAGER','RECEPTIONIST','CASHIER','DOCTOR','LAB_TECHNICIAN','PHARMACIST','NURSE','ACCOUNTANT','RECORDS_OFFICER'].map(x=><option key={x}>{x}</option>)}</select></label><div className="span-all"><button className="primary">Create account</button> <span className="helper">{msg}</span></div></form><section className="panel table-panel"><DataTable headers={['Name','Username','Role','Status','Account access']} rows={rows.map(x=>[x.fullName,x.username,x.role,x.enabled?'Active':'Disabled',user.role==='ADMIN'?<button className="small-action" onClick={()=>toggle(x.id,x.enabled)}>{x.enabled?'Disable':'Enable'}</button>:'Admin only'])}/></section></div>}
export default UsersPage;
