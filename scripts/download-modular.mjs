import fs from 'node:fs/promises';
const ledger=JSON.parse(await fs.readFile('docs/modular-generation-ledger.json','utf8'));
await Promise.all(ledger.jobs.map(async job=>{
 const path=`public/models/modular-v2/${job.name}.glb`;
 try{await fs.access(path);console.log(job.name,'보존');return}catch{}
 if(!job.url)throw Error(`${job.name}: 공개 저장소에 포함된 모델 파일이 없습니다. Git에서 ${path}를 복원해주세요. 개인 다운로드 주소는 공개하지 않습니다.`);
 const response=await fetch(job.url);if(!response.ok)throw Error(`${job.name}: ${response.status}`);
 const bytes=Buffer.from(await response.arrayBuffer());if(bytes.toString('ascii',0,4)!=='glTF'||bytes.readUInt32LE(8)!==bytes.length)throw Error('GLB 검증 실패');
 await fs.writeFile(path,bytes);console.log(job.name,bytes.length);
}));
