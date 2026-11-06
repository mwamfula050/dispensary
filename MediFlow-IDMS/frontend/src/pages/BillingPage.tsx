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

function Billing(){const [rows,setRows]=useState<any[]>([]);const load=()=>api.get('/billing/invoices').then(r=>setRows(r.data)).catch(()=>{});useEffect(()=>{load()},[]);return <div className="content"><PageTitle eyebrow="REVENUE & PAYMENTS" title="Billing" desc="Review invoices, payment status and outstanding balances." action={<button className="secondary" onClick={()=>downloadCsv('mediflow-invoices.csv',rows)}><Download size={16}/> Export CSV</button>}/><DataTable headers={['Invoice','Patient','Visit','Amount (TZS)','Paid (TZS)','Status']} rows={rows.map(x=>[x.id,x.visit?.patient?.fullName,x.visit?.id,Number(x.amount).toLocaleString(),Number(x.paid).toLocaleString(),x.status])}/></div>}
export default Billing;
