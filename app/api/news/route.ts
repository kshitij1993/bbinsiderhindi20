import {NextResponse} from 'next/server';
import {XMLParser} from 'fast-xml-parser';
import type {Category,Story} from '../../../lib/types';
export const revalidate=600;
const queries=[
 {q:'"Bigg Boss 20" "Hindi" when:7d',lang:'en' as const},
 {q:'"Bigg Boss 20" eviction OR nomination OR wildcard OR captaincy when:14d',lang:'en' as const},
 {q:'"Bigg Boss 20" "Weekend Ka Vaar" when:14d',lang:'en' as const},
 {q:'बिग बॉस 20 when:7d',lang:'hi' as const},
 {q:'बिग बॉस 20 एलिमिनेशन नॉमिनेशन वाइल्ड कार्ड when:14d',lang:'hi' as const}
];
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@_'});
function classify(title:string):Category{const t=title.toLowerCase();if(/evict|eliminat|बाहर|बेघर/.test(t))return 'Evictions';if(/nominat|नामांक/.test(t))return 'Nominations';if(/weekend ka vaar|salman khan|वीकेंड का वार/.test(t))return 'Weekend Ka Vaar';if(/wild.?card|entry|entrant|वाइल्ड/.test(t))return 'Wild cards';if(/fight|clash|argument|controvers|feud|slap|झगड़|लड़ाई/.test(t))return 'Fights & drama';if(/captain|task|ration|टास्क|कप्तान/.test(t))return 'Tasks & captaincy';return 'Other'}
// Show only coverage of the Hindi television edition, Season 20.
// News language (Hindi/English) remains an independent display filter.
const otherEdition=/\b(?:bigg\s*boss|big\s*boss|bb)\s*(?:telugu|tamil|kannada|malayalam|marathi|bengali|bangla|odia|ott)\b|\b(?:telugu|tamil|kannada|malayalam|marathi|bengali|bangla|odia)\s*(?:bigg\s*boss|big\s*boss)\b|बिग\s*बॉस\s*(?:मराठी|तमिल|तेलुगु|कन्नड़|मलयालम|बांग्ला|ओटीटी)|(?:பிக் பாஸ்|బిగ్ బాస్|ಬಿಗ್ ಬಾಸ್|ബിഗ് ബോസ്)/i;
const hindiSeason20=/(?:\bbigg?\s*boss\s*(?:hindi\s*)?(?:season\s*)?20\b|\bbb\s*20\b|बिग\s*बॉस\s*(?:हिंदी\s*)?(?:सीजन\s*)?20\b)/i;
function isHindiSeason20(title:string):boolean{
  return hindiSeason20.test(title) && !otherEdition.test(title);
}
function list<T>(x:T|T[]|undefined):T[]{return x==null?[]:Array.isArray(x)?x:[x]}
function clean(x:unknown):string{return typeof x==='string'?x:typeof x==='number'?String(x):''}
function safeDate(d:string){const n=Date.parse(d);return Number.isFinite(n)?new Date(n).toISOString():new Date(0).toISOString()}
async function fetchFeed({q,lang}:{q:string;lang:'en'|'hi'}):Promise<Story[]>{const url=`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang}-IN&gl=IN&ceid=IN:${lang}`;const r=await fetch(url,{next:{revalidate:600},headers:{'User-Agent':'BB20Insider/1.0 (+news-aggregation)'}});if(!r.ok)throw new Error('News feed unavailable');const xml=parser.parse(await r.text());const items=list<any>(xml?.rss?.channel?.item);return items.map((i:any)=>{const title=clean(i.title).trim();const source=clean(i?.source?.['#text']??i?.source) || title.split(' - ').pop() || 'News source';const category=classify(title);const link=clean(i.link);return {id:clean(i.guid?.['#text']??i.guid??link),title:title.replace(new RegExp(` - ${source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`),''),summary:'Headline from the linked publisher. Open the article for full reporting.',source,published:safeDate(clean(i.pubDate)),url:link,category,language:/[\u0900-\u097f]/.test(title)?'Hindi':'English',important:category!=='Other',spoiler:/evict|eliminat|nomina|बाहर|बेघर/i.test(title)} as Story}).filter((s:Story)=>s.title&&s.url.startsWith('https://')&&isHindiSeason20(s.title))}
export async function GET(){try{const results=await Promise.allSettled(queries.map(fetchFeed));const stories=results.filter(r=>r.status==='fulfilled').flatMap(r=>(r as PromiseFulfilledResult<Story[]>).value);if(!stories.length)throw new Error('No accessible news feeds');const seen=new Set<string>();const unique=stories.filter(s=>{const key=s.title.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]/g,'').slice(0,100);if(seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>Date.parse(b.published)-Date.parse(a.published)).slice(0,90);return NextResponse.json({stories:unique,updatedAt:new Date().toISOString(),partial:results.some(r=>r.status==='rejected')},{headers:{'Cache-Control':'public, s-maxage=600, stale-while-revalidate=900'}})}catch{return NextResponse.json({stories:[],error:'News feeds are temporarily unavailable. Retry shortly.',updatedAt:new Date().toISOString()},{status:503})}}
