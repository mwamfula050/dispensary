import React from 'react';

export function PageTitle({eyebrow,title,desc,action}:{eyebrow:string;title:string;desc:string;action?:React.ReactNode}) {
  return <div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>{action}</div>;
}
export function Stat({icon,label,value,tone,note}:{icon:React.ReactNode;label:string;value:number;tone:string;note:string}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><span>{label}</span><strong>{value.toLocaleString()}</strong><small>{note}</small></div>;
}
export function DataTable({headers,rows}:{headers:string[];rows:any[][]}) {
  return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v??'—'}</td>)}</tr>)}</tbody></table>{!rows.length&&<div className="empty">No records found</div>}</div>;
}
