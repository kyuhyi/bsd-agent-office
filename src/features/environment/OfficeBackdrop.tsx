'use client';
import type {CSSProperties} from 'react';
export function OfficeBackdrop({background,phase,daylight}:{background:{id:string;src:string;position:string};phase:string;daylight:number}){
 const style={'--backdrop-image':`url("${background.src}")`,'--backdrop-position':background.position,'--photo-brightness':.45+daylight*.57,'--photo-saturation':.7+daylight*.2} as CSSProperties;
 return <div className="office-backdrop" data-background={background.id} data-phase={phase} style={style} aria-hidden="true"><div className="backdrop-atmosphere"/><div className="backdrop-photo"/><div className="backdrop-tint"/><div className="backdrop-fade"/></div>;
}
