// 원본을 보존하고 리깅 서비스가 요구하는 +Z 정면으로 좌표를 굽는다.
import fs from 'node:fs';
const source='public/models/modular-v2/kyu-static.glb',target='public/models/modular-v2/kyu-forward.glb';
const bytes=fs.readFileSync(source),jsonLength=bytes.readUInt32LE(12),json=JSON.parse(bytes.toString('utf8',20,20+jsonLength));
const binary=Buffer.from(bytes.subarray(28+jsonLength));
const changed=new Set();
for(const mesh of json.meshes)for(const p of mesh.primitives)for(const key of ['POSITION','NORMAL','TANGENT']){
 const id=p.attributes[key];if(id===undefined||changed.has(id))continue;changed.add(id);
 const a=json.accessors[id],v=json.bufferViews[a.bufferView];if(a.componentType!==5126)throw Error('부동소수점 좌표가 필요합니다.');
 const offset=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||(a.type==='VEC4'?16:12),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<a.count;i++){const o=offset+i*stride,x=binary.readFloatLE(o),y=binary.readFloatLE(o+4),z=binary.readFloatLE(o+8);const values=[-z,y,x];values.forEach((n,j)=>{binary.writeFloatLE(n,o+j*4);min[j]=Math.min(min[j],n);max[j]=Math.max(max[j],n)})}
 if(key==='POSITION'){a.min=min;a.max=max}
}
let text=Buffer.from(JSON.stringify(json));text=Buffer.concat([text,Buffer.alloc((4-text.length%4)%4,32)]);const head=Buffer.alloc(20),binHead=Buffer.alloc(8);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+text.length+binary.length,8);head.writeUInt32LE(text.length,12);head.writeUInt32LE(0x4e4f534a,16);binHead.writeUInt32LE(binary.length);binHead.writeUInt32LE(0x004e4942,4);fs.writeFileSync(target,Buffer.concat([head,text,binHead,binary]));console.log({target,bytes:fs.statSync(target).size});
