import type { MarketingRequest,Status } from '../types';
const KEY='frontier-marketing-requests';
const seed:MarketingRequest[]=[
 {id:'1',requestNumber:'MKT-2026-0001',typeSlug:'marketing-materials',typeTitle:'Marketing Material',workflow:'standard',requesterName:'Jordan Lee',requesterEmail:'jordan@example.com',branchDepartment:'Round Rock',dueDate:'2026-10-08',submittedAt:'2026-09-28T14:00:00Z',status:'Submitted',assignedTo:'',details:{materialType:'Flyer',campaign:'Small Business Event'},submitterNote:'',privateNote:''},
 {id:'2',requestNumber:'MKT-2026-0002',typeSlug:'moody-center',typeTitle:'Moody Center Request',workflow:'moody',requesterName:'Taylor Smith',requesterEmail:'taylor@example.com',branchDepartment:'Austin',dueDate:'2026-10-15',submittedAt:'2026-09-28T15:00:00Z',status:'Submitted',assignedTo:'',details:{event:'Concert',tickets:'2',businessPurpose:'Customer appreciation'},submitterNote:'',privateNote:''}
];
export function list():MarketingRequest[]{ const raw=localStorage.getItem(KEY); if(!raw){localStorage.setItem(KEY,JSON.stringify(seed));return seed;} return JSON.parse(raw); }
function save(items:MarketingRequest[]){localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event('requests-changed'));}
export function create(input:Omit<MarketingRequest,'id'|'requestNumber'|'submittedAt'|'status'>){const items=list(); const n=items.length+1; const item:MarketingRequest={...input,id:crypto.randomUUID(),requestNumber:`MKT-${new Date().getFullYear()}-${String(n).padStart(4,'0')}`,submittedAt:new Date().toISOString(),status:'Submitted'};save([item,...items]);return item;}
export function updateStatus(id:string,status:Status,note:string){const items=list().map(r=>r.id===id?{...r,status,submitterNote:note}:r);save(items);}
