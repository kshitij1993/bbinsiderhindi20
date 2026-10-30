import {NextResponse} from 'next/server';
import type {Episode} from '../../../lib/types';
export const revalidate=3600;
export async function GET(){try{const r=await fetch('https://api.tvmaze.com/shows/8514/episodes',{next:{revalidate:3600}});if(!r.ok)throw new Error('TVmaze unavailable');const data:any[]=await r.json();const episodes:Episode[]=data.filter(x=>x.season===20).map(x=>({id:x.id,number:x.number,title:x.name&&x.name!=='TBD'?x.name:`Episode ${x.number}`,airdate:x.airdate,url:x.url})).sort((a,b)=>b.number-a.number);return NextResponse.json({episodes,source:'TVmaze',updatedAt:new Date().toISOString()})}catch{return NextResponse.json({episodes:[],error:'Episode guide temporarily unavailable.'},{status:503})}}
