import assert from 'node:assert/strict';
const base='http://127.0.0.1:43140';
const session=await fetch(base+'/office-api/session').then(r=>r.json());
const headers={'x-office-token':session.token,'Content-Type':'application/json'};
async function post(route,payload){const r=await fetch(base+'/office-api/'+route,{method:'POST',headers,body:JSON.stringify(payload)});const data=await r.json();assert.ok(r.ok,JSON.stringify(data));return data;}
const parent=session.tasks.find(t=>t.provider==='codex'&&t.files.length);
const review=await post('tasks',{prompt:'실제 교차 검수 검증입니다. 제공된 HTML에서 실제 확인 가능한 오류 또는 개선점 3개와 브라우저 확인 항목을 간결하게 정리해주세요.',provider:'claude',roleId:'june',mode:'review',parentId:parent.id});
const queued=await post('tasks',{prompt:'대기 취소 검증용입니다.',provider:'codex',roleId:'noah',mode:'analyze'});
const current=await fetch(base+'/office-api/state',{headers}).then(r=>r.json());
assert.equal(current.tasks.filter(t=>t.status==='running').length,1);
assert.equal(current.tasks.find(t=>t.id===queued.id).status,'queued');
const cancelled=await post(`tasks/${queued.id}/cancel`,{});assert.equal(cancelled.status,'cancelled');
console.log(JSON.stringify({checks:3,passed:true,reviewId:review.id,cancelledId:queued.id},null,2));
