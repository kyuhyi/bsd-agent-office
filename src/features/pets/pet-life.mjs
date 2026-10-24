import {manualRoute} from '../characters/character-control.mjs';
export const PET_STOPS=[[-7,6],[-6,10.8],[2,10.5],[7.5,7],[7.5,0],[0,.5],[-7.7,0],[-5,-6],[3,-5.5]];
export const petRoute=(from,to)=>manualRoute(from,to,'pet');
