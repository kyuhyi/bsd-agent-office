import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,writeFile,mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { projectSnapshot } from '../services/runner/projects.mjs';
test('프로젝트 스냅샷은 숨김 파일·의존성·인증 파일을 제외하고 크기를 제한한다',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'bsd-office-fixture-'));
 await mkdir(path.join(root,'node_modules'));
 await writeFile(path.join(root,'README.md'),'공개 설명');
 await writeFile(path.join(root,'.env'),'TEST_ONLY=excluded');
 await writeFile(path.join(root,'credentials.json'),'excluded');
 await writeFile(path.join(root,'node_modules','index.js'),'excluded');
 await writeFile(path.join(root,'big.txt'),'x'.repeat(80000));
 const result=await projectSnapshot(root);
 assert.deepEqual(result.files.map(f=>f.path),['README.md']);
 assert.equal(result.files[0].text,'공개 설명');
});
test('파일 시스템 루트와 인증 설정 폴더를 프로젝트로 선택하지 못한다',async()=>{
 await assert.rejects(projectSnapshot(path.parse(process.cwd()).root));
 await assert.rejects(projectSnapshot(path.join(os.homedir(),'.codex')));
});
