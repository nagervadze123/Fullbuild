'use client'
import { useEffect, useState } from 'react'; import { useParams } from 'next/navigation'; import { api } from '@/lib/api';
export default function Project(){ const {id}=useParams<{id:string}>(); const [tab,setTab]=useState('opps'); const [data,setData]=useState<any>({}); const load=async()=>{const [opps,strategy,assets,listings,cals,runs]=await Promise.all([
api(`/api/projects/${id}/opportunities`).catch(()=>[]),api(`/api/projects/${id}/strategy`).catch(()=>null),api(`/api/projects/${id}/assets`).catch(()=>[]),api(`/api/projects/${id}/listings`).catch(()=>[]),api(`/api/projects/${id}/content-calendars`).catch(()=>[]),api(`/api/projects/${id}/runs`).catch(()=>[])
]); setData({opps,strategy,assets,listings,cals,runs})}; useEffect(()=>{load(); const i=setInterval(load,3000); return ()=>clearInterval(i)},[id]);
const run=async(run_type:string)=>{await api(`/api/projects/${id}/run`,{method:'POST',body:JSON.stringify({run_type,opportunity_ids:[]})});await load()};
return <div className='space-y-3'><h1 className='text-xl'>Project {id}</h1><button className='border p-2' onClick={()=>run('build_all')}>Build All</button><div className='flex gap-2'>{['opps','strategy','assets','listings','distribution','runs'].map(t=><button key={t} className='border p-1' onClick={()=>setTab(t)}>{t}</button>)}</div>
{tab==='opps'&&<pre>{JSON.stringify(data.opps,null,2)}</pre>}
{tab==='strategy'&&<pre>{JSON.stringify(data.strategy?.strategy_json||{},null,2)}</pre>}
{tab==='assets'&&<div>{(data.assets||[]).map((a:any)=><div key={a.id}><a className='underline' href={`${process.env.NEXT_PUBLIC_API_URL||'http://localhost:8000'}/api/assets/${a.id}/download`}>Download {a.asset_type}</a></div>)}</div>}
{tab==='listings'&&<pre>{JSON.stringify(data.listings,null,2)}</pre>}
{tab==='distribution'&&<pre>{JSON.stringify(data.cals,null,2)}</pre>}
{tab==='runs'&&<pre>{JSON.stringify(data.runs,null,2)}</pre>}
</div> }
