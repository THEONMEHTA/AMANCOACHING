import { readFile } from 'node:fs/promises';
import { get } from '@vercel/blob';

export const keys = ['site','snapshot'];
export function validateContent(key, data) {
  const text = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 1500;
  if (key === 'site') {
    if (!Array.isArray(data?.credentials) || !data.credentials.every(text) || data.credentials.length>6 ||
        !(data.sessions === null || Number.isInteger(data.sessions) && data.sessions>0 && data.sessions<=52) ||
        typeof data.reportEmailEnabled !== 'boolean' || typeof data.bookingUrl !== 'string' ||
        (data.bookingUrl && new URL(data.bookingUrl).protocol !== 'https:')) throw new Error('Invalid site settings.');
  } else if (key === 'snapshot') {
    const ids=['clarity','influence','strategy','delegation','sustainable'];
    if (!text(data?.version) || data.choices?.length !== 5 || !data.choices.every(text) ||
      data.dimensions?.length!==5 || !data.dimensions.every((d,i)=>d.id===ids[i] && [d.label,d.strength,d.growth,d.action].every(text) && d.statements?.length===3 && d.statements.every(text))) throw new Error('Invalid quiz content.');
  } else throw new Error('Unknown content key.');
  return data;
}
export async function readContent(key) {
  if (!keys.includes(key)) throw new Error('Unknown content key.');
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const override=await get('configuration/'+key+'.json',{access:'private',useCache:false});
    if (override?.statusCode===200) return validateContent(key,await new Response(override.stream).json());
  }
  return validateContent(key,JSON.parse(await readFile(new URL('../public/content/'+key+'.json',import.meta.url),'utf8')));
}
