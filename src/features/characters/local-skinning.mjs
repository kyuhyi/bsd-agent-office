import * as THREE from 'three';

// 정적인 A 포즈 직원 메시를 로컬 스켈레톤에 결합한다. 유료 자동 리깅 결과와 구분한다.
export function skinHumanoid(source,{height=1.85,facing=-Math.PI/2,id='staff'}={}){
 const root=new THREE.Group(),bones=[],segments=[];
 source.updateWorldMatrix(true,true);
 const input=[];source.traverse(o=>{if(o.isMesh)input.push(o)});
 const orientation=new THREE.Matrix4().makeRotationY(facing);
 const copies=input.map(o=>({geometry:o.geometry.clone().applyMatrix4(o.matrixWorld).applyMatrix4(orientation),material:o.material}));
 const box=new THREE.Box3();for(const p of copies){p.geometry.computeBoundingBox();box.union(p.geometry.boundingBox)}
 const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),scale=height/size.y;
 for(const p of copies){p.geometry.translate(-center.x,-box.min.y,-center.z);p.geometry.scale(scale,scale,scale)}
 function bone(name,position,parent,end){const b=new THREE.Bone();b.name=id+'_'+name;const pos=new THREE.Vector3(...position).multiplyScalar(height);b.position.copy(pos);if(parent){parent.updateWorldMatrix(true,false);b.position.sub(parent.getWorldPosition(new THREE.Vector3()));parent.add(b)}else root.add(b);bones.push(b);segments.push({name,a:pos,b:new THREE.Vector3(...end).multiplyScalar(height)});return b}
 const body=bone('body',[0,0,0],null,[0,.43,0]);
 const hips=bone('hips',[0,.45,0],body,[0,.54,0]);
 const spine=bone('spine',[0,.54,0],hips,[0,.68,0]);
 const head=bone('head',[0,.72,0],spine,[0,.92,0]);
 for(const [side,sign] of [['L',-1],['R',1]]){
  const arm=bone('arm'+side,[sign*.135,.685,0],spine,[sign*.23,.545,.005]);
  const forearm=bone('forearm'+side,[sign*.23,.545,.005],arm,[sign*.31,.405,.01]);
  bone('hand'+side,[sign*.31,.405,.01],forearm,[sign*.34,.36,.015]);
  const leg=bone('leg'+side,[sign*.082,.45,0],hips,[sign*.085,.25,0]);
  const shin=bone('shin'+side,[sign*.085,.25,0],leg,[sign*.085,.065,0]);
  bone('foot'+side,[sign*.085,.065,0],shin,[sign*.085,.04,.075]);
 }
 root.updateMatrixWorld(true);const skeleton=new THREE.Skeleton(bones),v=new THREE.Vector3(),d=new THREE.Vector3(),q=new THREE.Vector3();
 for(const p of copies){const a=p.geometry.attributes.position,indices=new Uint16Array(a.count*4),weights=new Float32Array(a.count*4);
  for(let i=0;i<a.count;i++){
   v.fromBufferAttribute(a,i);const y=v.y/height,ax=Math.abs(v.x)/height;
   const candidates=[];
   segments.forEach((s,j)=>{
    if(s.name==='body')return;
    const arm=/arm|hand/.test(s.name),leg=/leg|shin|foot/.test(s.name),head=s.name==='head';
    if(y>.735&&!head)return;if(y<.43&&!leg&&!(arm&&ax>.18))return;
    if(arm&&(ax<.115||y>.74||y<.30))return;
    if(leg&&y>.51)return;if(head&&y<.65)return;
    d.subVectors(s.b,s.a);const t=THREE.MathUtils.clamp(q.subVectors(v,s.a).dot(d)/d.lengthSq(),0,1);q.copy(s.a).addScaledVector(d,t);const distance=v.distanceToSquared(q);
    candidates.push([j,1/Math.pow(distance+.0008,3)]);
   });
   candidates.sort((a,b)=>b[1]-a[1]);const top=candidates.slice(0,4),sum=top.reduce((n,a)=>n+a[1],0);
   if(!sum)throw new Error('스킨 가중치를 계산하지 못했습니다.');
   top.forEach(([j,w],k)=>{indices[i*4+k]=j;weights[i*4+k]=w/sum});
  }
  p.geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));p.geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
  const mesh=new THREE.SkinnedMesh(p.geometry,p.material);mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;root.add(mesh);mesh.bind(skeleton);
 }
 const rig=Object.fromEntries(bones.map(b=>[b.name.slice(id.length+1),b]));
 rig.armL.rotation.z=.52;rig.armR.rotation.z=-.52;
 root.userData.rigMethod='local-segment-weighting';return {model:root,rig};
}
