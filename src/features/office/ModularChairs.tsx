'use client';
import {ModularAsset} from './ModularAsset';
import {HOMES} from './scene-layout.mjs';
export const CHAIR_SEATS=Object.values(HOMES);
export function ModularChairs(){return <group name="Independent_Task_Chairs">{CHAIR_SEATS.map(([x,z],i)=><ModularAsset key={i} url="/models/modular-v2/task-chair.glb" height={1.45} position={[x,.035,z]} rotation={z>8?-Math.PI/2:Math.PI/2} upholstery={z>2?'#b26b4d':x>7?'#526b4b':undefined}/>)}</group>}
