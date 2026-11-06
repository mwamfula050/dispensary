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

function Visits({user}:{user:User}) {
 const [rows,setRows]=useState<any[]>([]);
 const [patients,setPatients]=useState<Patient[]>([]);
 const [pid,setPid]=useState('');
 const [message,setMessage]=useState('');
 const [selected,setSelected]=useState<any>(null);
 const [form,setForm]=useState<any>({bloodPressure:'',temperature:'',weight:'',height:'',pulseRate:'',respiratoryRate:'',oxygenSaturation:'',nurseNotes:'',priority:'NORMAL'});
 const load=()=>api.get('/visits').then(r=>setRows(r.data)).catch(()=>setMessage('Unable to load visits. Check your connection and permissions.'));
 useEffect(()=>{load();api.get('/patients').then(r=>setPatients(r.data)).catch(()=>{});},[]);
 async function createVisit(){if(!pid)return;setMessage('');try{await api.post('/visits',{patientId:Number(pid)});setPid('');setMessage('New visit created and added to the triage queue.');load();}catch{setMessage('Unable to create visit. Check your permissions.');}}
 function openTriage(v:any){setSelected(v);setForm({bloodPressure:v.bloodPressure||'',temperature:v.temperature??'',weight:v.weight??'',height:v.height??'',pulseRate:v.pulseRate??'',respiratoryRate:v.respiratoryRate??'',oxygenSaturation:v.oxygenSaturation??'',nurseNotes:v.nurseNotes||v.triageNotes||'',priority:v.priority||'NORMAL'});}
 async function saveTriage(e:React.FormEvent){e.preventDefault();if(!selected)return;try{await api.patch(`/visits/${selected.id}/triage`,{...form,notes:form.nurseNotes});setMessage('Triage saved. This visit is now available in the doctor queue.');setSelected(null);load();}catch{setMessage('Unable to save triage. Confirm you are signed in as a Nurse or Admin.');}}
 const canCreate=['ADMIN','MANAGER','RECEPTIONIST'].includes(user.role);
 const canTriage=['ADMIN','MANAGER','NURSE'].includes(user.role);
 const visibleRows=user.role==='NURSE'?rows.filter(v=>['WAITING_FOR_TRIAGE','WAITING_FOR_DOCTOR'].includes(v.status)):rows;
 return <div className="content">
  <PageTitle eyebrow="CARE COORDINATION" title={user.role==='NURSE'?'Nursing triage queue':'Patient visits'} desc={user.role==='NURSE'?'Open a patient VISIT, record vital signs and hand the encounter to the doctor.':'Create follow-up visits and monitor each patient encounter.'} action={<button className="secondary" onClick={load}><RefreshCw size={15}/> Refresh queue</button>}/>
  {canCreate&&<section className="panel"><h3>Create a visit for an existing patient</h3><p className="helper">A patient is the person’s permanent record. A visit is one attendance and has its own clinical history.</p><div className="inline-form"><select value={pid} onChange={e=>setPid(e.target.value)}><option value="">Select patient</option>{patients.map(p=><option key={p.id} value={p.id}>{p.patientNumber} — {p.fullName}</option>)}</select><button className="primary" onClick={createVisit} disabled={!pid}><Plus size={16}/> Create new visit</button></div></section>}
  {selected&&<form className="panel form-grid clinical-form" onSubmit={saveTriage}>
   <div className="span-all panel-head"><div><h3>Nursing assessment — {selected.patient?.fullName}</h3><p>{selected.patient?.patientNumber} · Visit #{selected.id} · {selected.status}</p></div><button type="button" className="secondary" onClick={()=>setSelected(null)}>Close</button></div>
   <label>Blood pressure (mmHg)<input value={form.bloodPressure} onChange={e=>setForm({...form,bloodPressure:e.target.value})} placeholder="120/80"/></label>
   <label>Temperature (°C)<input type="number" step="0.1" value={form.temperature} onChange={e=>setForm({...form,temperature:e.target.value})} placeholder="36.8"/></label>
   <label>Weight (kg)<input type="number" step="0.1" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="65"/></label>
   <label>Height (cm)<input type="number" step="0.1" value={form.height} onChange={e=>setForm({...form,height:e.target.value})} placeholder="165"/></label>
   <label>Pulse rate (bpm)<input type="number" value={form.pulseRate} onChange={e=>setForm({...form,pulseRate:e.target.value})} placeholder="80"/></label>
   <label>Respiratory rate (/min)<input type="number" value={form.respiratoryRate} onChange={e=>setForm({...form,respiratoryRate:e.target.value})} placeholder="18"/></label>
   <label>Oxygen saturation (%)<input type="number" step="0.1" value={form.oxygenSaturation} onChange={e=>setForm({...form,oxygenSaturation:e.target.value})} placeholder="98"/></label>
   <label>Priority<select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="NORMAL">Normal</option><option value="URGENT">Urgent</option><option value="EMERGENCY">Emergency</option></select></label>
   <label className="span-all">Nurse assessment / observations<textarea value={form.nurseNotes} onChange={e=>setForm({...form,nurseNotes:e.target.value})} placeholder="Record observations, symptoms reported and immediate nursing notes."/></label>
   <div className="span-all"><button className="primary">Save triage and send to doctor</button></div>
  </form>}
  {message&&<p className="success-text">{message}</p>}
  <section className="panel table-panel"><div className="table-toolbar"><div><h3>{user.role==='NURSE'?'Patients awaiting triage':'Patient visit worklist'}</h3><p className="helper">Each row represents a visit, not a permanent patient record.</p></div></div>
   <DataTable headers={['Visit ID','Patient ID','Patient','Status','Priority','Blood pressure','Temperature','Action']} rows={visibleRows.map(v=>[v.id,v.patient?.patientNumber,v.patient?.fullName,v.status,v.priority||'NORMAL',v.bloodPressure||'—',v.temperature?`${v.temperature} °C`:'—',canTriage&&v.status!=='COMPLETED'?<button className="small-action" onClick={()=>openTriage(v)}>{v.status==='WAITING_FOR_TRIAGE'?'Record triage':'View / edit triage'}</button>:'—'])}/>
  </section>
 </div>;
}
export default Visits;
