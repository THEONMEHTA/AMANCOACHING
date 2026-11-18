import { keys, readContent } from '../server/content.js';
export default { async fetch(request) {
  if(request.method!=='GET') return new Response(null,{status:405,headers:{Allow:'GET'}});
  const key=new URL(request.url).searchParams.get('key');
  if(!keys.includes(key)) return new Response(null,{status:404});
  try {return Response.json(await readContent(key),{headers:{'Cache-Control':'no-store'}});}
  catch {return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}});}
}};
