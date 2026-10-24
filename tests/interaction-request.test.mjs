import test from 'node:test';
import assert from 'node:assert/strict';
import {interactionRequest} from '../src/features/characters/interaction-request.mjs';
const base={recipient:'sora',provider:'claude',screen:'chat',kind:'analyze',draft:' 이어서 설명해줘 '};
test('직원 질문은 선택된 담당자의 완료된 대화에만 이어진다',()=>{
 const conversations=[{id:'a',roleId:'sora',prompt:'[대화] 첫 질문',status:'review'},{id:'b',roleId:'leo',prompt:'[대화] 다른 직원',status:'approved'},{id:'c',roleId:'sora',prompt:'[대화] 아직 실행 중',status:'running'}];
 assert.deepEqual(interactionRequest({...base,conversations}),{roleId:'sora',provider:'claude',mode:'analyze',prompt:'[대화] 이어서 설명해줘',parentId:'a'});
});
test('결과물 지시는 대화 이력을 붙이지 않고 선택한 Codex 직원에게 보낸다',()=>{
 assert.deepEqual(interactionRequest({...base,screen:'task',kind:'create',recipient:'leo',provider:'codex',draft:'페이지 제작'}),{roleId:'leo',provider:'codex',mode:'create',prompt:'페이지 제작'});
 assert.throws(()=>interactionRequest({...base,recipient:'kyu'}));assert.throws(()=>interactionRequest({...base,draft:' '}));assert.throws(()=>interactionRequest({...base,draft:'가'.repeat(6000)}));
});
