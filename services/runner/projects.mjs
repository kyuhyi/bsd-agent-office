import fs from 'node:fs/promises';
import path from 'node:path';
import { redact } from './contracts.mjs';
const extensions=new Set(['.md','.txt','.html','.css','.js','.jsx','.ts','.tsx','.json','.sql']);
const excluded=new Set(['node_modules','dist','build','coverage','vendor','research','output']);
export async function projectSnapshot(root) {
  if(typeof root!=='string'||!path.isAbsolute(root)) throw new Error('프로젝트의 절대 경로를 입력해주세요.');
  const real=await fs.realpath(root);
  if(!((await fs.stat(real)).isDirectory())||real===path.parse(real).root||/(^|[\\/])\.(?:codex|ssh|aws|azure|config|claude)([\\/]|$)/i.test(real)) throw new Error('일반 프로젝트 폴더를 선택해주세요.');
  const files=[];let length=0;
  async function walk(dir,depth=0) {
    if(depth>3||files.length>=16||length>=32000)return;
    for(const entry of (await fs.readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
      if(entry.name.startsWith('.')||entry.isSymbolicLink()||excluded.has(entry.name.toLowerCase())||/lock\.(json|yaml)$|secret|credential|token|password|auth\.json/i.test(entry.name))continue;
      const full=path.join(dir,entry.name);
      if(entry.isDirectory()){await walk(full,depth+1);continue;}
      if(files.length>=16||length>=32000)break;
      if(!extensions.has(path.extname(entry.name)))continue;
      const info=await fs.stat(full);if(info.size>70000)continue;
      const text=redact((await fs.readFile(full,'utf8')).slice(0,Math.min(6000,32000-length)));
      files.push({path:path.relative(real,full).split(path.sep).join('/'),text});length+=text.length;
    }
  }
  await walk(real);
  return {root:real,name:path.basename(real),files};
}
