import { timingSafeEqual } from 'node:crypto';

export function safeArtifactPath(input) {
  if (typeof input!=='string' || input.length>180 || /[\\:\x00-\x1f]/.test(input) || input.startsWith('/')) throw new Error('허용되지 않은 결과 파일 경로입니다.');
  const parts=input.split('/');
  if(parts.some(p=>!p || p==='.' || p==='..' || p.startsWith('.') || /[ .]$/.test(p) || /^(node_modules|CON|PRN|AUX|NUL|COM\d|LPT\d)(\.|$)/i.test(p))) throw new Error('허용되지 않은 결과 파일 경로입니다.');
  return input;
}
export function redact(value) {
  return String(value??'').replace(/Bearer\s+[^\s"']+/gi,'Bearer [보호됨]').replace(/\b(?:sk-|ghp_|github_pat_)[a-zA-Z0-9_-]{10,}/g,'[보호됨]').replace(/\b([A-Z_]*(?:KEY|TOKEN|SECRET|PASSWORD))\s*[=:]\s*[^\s,"']+/g,'$1=[보호됨]');
}
const transitions={queued:['running','cancelled','failed'],running:['review','failed','cancelled'],review:['approved'],approved:[],failed:[],cancelled:[]};
export const canTransition=(from,to)=>transitions[from]?.includes(to)??false;
export function validateLocalRequest(headers,token,port) {
  const host=headers.host;
  if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(host)) return false;
  if(headers.origin && headers.origin!==`http://${host}`) return false;
  if(headers['sec-fetch-site']==='cross-site') return false;
  const given=String(headers['x-office-token']??'');
  return Buffer.byteLength(given)===Buffer.byteLength(token) && timingSafeEqual(Buffer.from(given),Buffer.from(token));
}
export function parseProviderLine(provider,line) {
  let data;try{data=JSON.parse(line);}catch{return null;}
  if(provider==='codex') {
    if(data.type==='item.completed' && data.item?.type==='agent_message') return {kind:'answer',text:redact(data.item.text)};
    if(data.type==='error' || data.type==='turn.failed') return {kind:'error',text:redact(data.message??data.error?.message??'실행 실패')};
    if(data.type==='thread.started') return {kind:'session',sessionId:data.thread_id};
    return null;
  }
  if(data.type==='result') return {kind:data.is_error?'error':'answer',text:redact(data.result??''),sessionId:data.session_id};
  if(data.type==='assistant') return {kind:'progress',text:redact((data.message?.content??[]).filter(x=>x.type==='text').map(x=>x.text).join('\n'))};
  return null;
}
export function parseDeliverable(text) {
  const cleaned=text.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,'');
  let data;try{data=JSON.parse(cleaned);}catch{return {summary:text,files:[]};}
  if(!data || typeof data.summary!=='string' || !Array.isArray(data.files)) return {summary:text,files:[]};
  if(data.files.length>24) throw new Error('한 번에 생성할 수 있는 파일은 24개입니다.');
  const names=new Set();let size=0;
  const files=data.files.map(file=>{
    const path=safeArtifactPath(file.path);
    if(names.has(path.toLowerCase())) throw new Error('중복된 파일 경로입니다.');
    names.add(path.toLowerCase());
    if(typeof file.content!=='string') throw new Error('파일 내용이 올바르지 않습니다.');
    size+=Buffer.byteLength(file.content);
    if(size>1500000) throw new Error('결과 파일 크기가 제한을 초과했습니다.');
    return {path,content:redact(file.content)};
  });
  return {summary:redact(data.summary),files};
}
