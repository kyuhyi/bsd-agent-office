import {SCENE_OBSTACLES,HOMES} from '../office/scene-layout.mjs';
import {ROSTER} from './roster.mjs';
export type TeamMember={id:string;name:string;role:string;title:string;initial:string;color:string;light:string;hair:string;skin:string;style:number;provider:'claude'|'codex';desk:[number,number];bio:string;stationary?:boolean};
export const TEAM:TeamMember[]=ROSTER.map(m=>({...m,provider:m.provider as 'claude'|'codex',desk:HOMES[m.id as keyof typeof HOMES] as [number,number]}));
export const OBSTACLES=SCENE_OBSTACLES;
