export type TaskStatus='queued'|'running'|'review'|'approved'|'cancelled'|'failed';
export type OfficeTask={id:string;prompt:string;provider:'claude'|'codex';roleId:string;roleName:string;mode:'analyze'|'create'|'review';status:TaskStatus;createdAt:string;startedAt?:string;finishedAt?:string;phase?:string;error?:string;result?:string;files:string[];contextFiles?:string[];parentId?:string};
export type OfficeState={tasks:OfficeTask[];providers:Record<string,{installed:boolean;loggedIn:boolean;error?:string}>;project:{root:string;name:string;fileCount:number}|null;workspace:string;activeId:string|null};
export const statusLabels:Record<TaskStatus,string>={queued:'순서 대기',running:'작업 중',review:'검토 대기',approved:'확인 완료',cancelled:'중지됨',failed:'실행 실패'};
