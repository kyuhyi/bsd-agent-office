import * as THREE from 'three';

export function furnitureFinish(url){
 if(/task-chair\.glb$/.test(url))return 'fabric';
 if(/(?:leather-sofa|meeting-chair|executive-chair)\.glb$/.test(url))return 'leather';
 return null;
}

// 원본 텍스처와 금속 다리는 유지하고 색으로 분리한 쿠션 영역만 보정한다.
export function createFurnitureMaterial(source,finish,tint){
 const material=new THREE.MeshPhysicalMaterial();
 THREE.MeshStandardMaterial.prototype.copy.call(material,source);
 material.normalScale=source.normalScale.clone().multiplyScalar(finish==='fabric'?.45:.5);
 material.sheen=finish==='fabric'?.26:.06;material.sheenColor.set('#cec4b4');material.sheenRoughness=.9;
 material.specularIntensity=finish==='fabric'?.28:.42;material.clearcoat=0;material.envMapIntensity=.85;
 material.onBeforeCompile=shader=>{
  shader.uniforms.furnitureTint={value:new THREE.Color(tint||'#6d8997')};
  shader.vertexShader='varying vec3 finishPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfinishPosition=position;');
  shader.fragmentShader='varying vec3 finishPosition; uniform vec3 furnitureTint;\n'+shader.fragmentShader;
  const fabric=finish==='fabric';
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float surfaceMask=${fabric?'smoothstep(.005,.045,diffuseColor.b-diffuseColor.r)*smoothstep(.0,.025,diffuseColor.b-diffuseColor.g)':'max(smoothstep(.008,.07,diffuseColor.r-diffuseColor.b),1.0-smoothstep(.025,.065,max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b))))'};
   float surfaceLuma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
   ${fabric&&tint?'diffuseColor.rgb=mix(diffuseColor.rgb,furnitureTint*clamp(surfaceLuma*7.5,.3,1.6),surfaceMask);':fabric?'diffuseColor.rgb=mix(diffuseColor.rgb,vec3(surfaceLuma)*vec3(.85,1.03,1.17),surfaceMask*.25);':'diffuseColor.rgb=mix(diffuseColor.rgb,vec3(surfaceLuma)*vec3(1.32,.97,.75),surfaceMask*.24);'}
   float grain=sin(finishPosition.x*950.0)*sin(finishPosition.y*870.0)*sin(finishPosition.z*1010.0);
  `);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
   roughnessFactor=mix(roughnessFactor,clamp(${fabric?'.72+roughnessFactor*.14':'.56+roughnessFactor*.24'}+grain*.018,.52,.9),surfaceMask);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor*=1.0-surfaceMask;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_SHEEN\nmaterial.sheenColor*=surfaceMask;\n#endif');
 };
 material.customProgramCacheKey=()=>`soft-furniture-v4-${finish}-${tint||'original'}`;
 return material;
}
