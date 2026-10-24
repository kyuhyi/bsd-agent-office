export type CharacterCommand={kind:'move'|'home';destination?:number[];serial:number};
export type CharacterCommands=Record<string,CharacterCommand>;
