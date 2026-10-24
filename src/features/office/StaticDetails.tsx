'use client';
import {useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// 정적인 소품은 재질별로 합쳐 소품 밀도를 높여도 그리기 호출이 비례해 늘지 않게 한다.
export function StaticDetails({children}:{children:ReactNode}){
 const source=useRef<THREE.Group>(null),[batch,setBatch]=useState<THREE.Group|null>(null);
 useLayoutEffect(()=>{
  const root=source.current!;root.updateWorldMatrix(true,true);
  const inverse=root.matrixWorld.clone().invert(),result=new THREE.Group(),groups=new Map<string,{material:THREE.Material;geometries:THREE.BufferGeometry[];shadow:boolean;receive:boolean;order:number}>();
  root.traverse(o=>{
   const transform=new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld);
   if(o instanceof THREE.Light){const light=o.clone();light.position.setFromMatrixPosition(transform);result.add(light);return}
   if(!(o instanceof THREE.Mesh))return;
   const m=o.material as THREE.MeshStandardMaterial;
   if(Array.isArray(m))return;
   const key=[m.type,m.color?.getHex(),m.roughness,m.metalness,m.emissive?.getHex(),m.emissiveIntensity,m.opacity,m.transparent,m.side,m.map?.uuid,m.depthWrite,m.toneMapped,o.castShadow,o.receiveShadow,o.renderOrder].join('|');
   if(!groups.has(key))groups.set(key,{material:m,geometries:[],shadow:o.castShadow,receive:o.receiveShadow,order:o.renderOrder});
   // 색을 가진 잎 인스턴스는 그대로 복제하여 버텍스 확장을 피한다.
   if(o instanceof THREE.InstancedMesh){const clone=o.clone();clone.matrix.copy(transform);clone.matrixAutoUpdate=false;result.add(clone);return}
   const g=o.geometry.clone().applyMatrix4(transform);for(const attr of Object.keys(g.attributes))if(!['position','normal','uv'].includes(attr))g.deleteAttribute(attr);
   if(!g.attributes.normal)g.computeVertexNormals();if(!g.attributes.uv)g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
   const flat=g.index?g.toNonIndexed():g;if(flat!==g)g.dispose();groups.get(key)!.geometries.push(flat);
  });
  for(const {material,geometries,shadow,receive,order} of groups.values()){
   if(!geometries.length)continue;
   const geometry=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());if(!geometry)continue;
   const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=shadow;mesh.receiveShadow=receive;mesh.renderOrder=order;result.add(mesh);
  }
  result.name='Batched_static_decor';setBatch(result);
  return()=>{result.traverse(o=>{if(o instanceof THREE.Mesh&&!(o instanceof THREE.InstancedMesh))o.geometry.dispose()})};
 },[]);
 return <><group ref={source} visible={!batch}>{children}</group>{batch&&<primitive object={batch}/>}</>;
}
