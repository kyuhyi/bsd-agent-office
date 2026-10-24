import * as THREE from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';

// 본의 로컬 축이 제각각인 외부 리깅을 월드 방향 기준으로 안전하게 포즈한다.
export function prepareSeatedRig(source,height=2.05){
 const model=clone(source);model.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3()),scale=height/size.y;
 model.scale.setScalar(scale);model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);model.updateMatrixWorld(true);
 /** @type {Record<string,THREE.Bone>} */
 const bones={};model.traverse(o=>{if(o.isBone)bones[o.name]=o;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false}});
 const hips=bones.Hips,standingHips=hips.position.clone();
 function aim(name,childName,direction){const bone=bones[name],child=bones[childName];const from=child.getWorldPosition(new THREE.Vector3()).sub(bone.getWorldPosition(new THREE.Vector3())).normalize();const delta=new THREE.Quaternion().setFromUnitVectors(from,new THREE.Vector3(...direction).normalize());const world=bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(delta);bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(world));model.updateMatrixWorld(true)}
 for(const [side,sign] of [['Left',1],['Right',-1]]){
  aim(side+'Arm',side+'ForeArm',[sign*.12,-1,.03]);aim(side+'ForeArm',side+'Hand',[0,-1,.12]);
 }
 const standing=Object.fromEntries(Object.entries(bones).map(([name,bone])=>[name,bone.quaternion.clone()]));
 const swingAxes=Object.fromEntries(Object.entries(bones).map(([name,bone])=>[name,new THREE.Vector3(1,0,0).applyQuaternion(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert())]));
 hips.position.y-=.2/hips.parent.getWorldScale(new THREE.Vector3()).y;model.updateMatrixWorld(true);
 for(const [side,sign] of [['Left',1],['Right',-1]]){
  aim(side+'UpLeg',side+'Leg',[sign*.07,-.06,1]);aim(side+'Leg',side+'Foot',[0,-1,.02]);aim(side+'Foot',side+'ToeBase',[sign*.04,0,1]);
  aim(side+'Arm',side+'ForeArm',[sign*.08,-.15,.98]);aim(side+'ForeArm',side+'Hand',[-sign*.06,.13,.99]);
 }
 const rest=Object.fromEntries(Object.entries(bones).map(([name,bone])=>[name,bone.quaternion.clone()]));
 return {model,bones,rest,standing,standingHips,seatedHips:hips.position.clone(),swingAxes};
}
