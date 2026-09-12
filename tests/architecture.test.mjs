import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
test('secrets are represented only as empty env keys',()=>{const env=read('.env.example');assert.match(env,/TELEGRAM_BOT_TOKEN=\r?\n/);assert.match(env,/TELEGRAM_ADMIN_CHAT_ID=\r?\n/);assert.doesNotMatch(read('lib/platform.ts'),/bot\d{6,}:/)});
test('lead persistence precedes notification',()=>{const source=read('app/api/leads/route.ts');assert.ok(source.indexOf('INSERT INTO leads')<source.lastIndexOf('recordEvent'))});
test('chat persists messages and supports close and ratings',()=>{const source=read('app/api/chat/route.ts');for(const needle of ['INSERT INTO messages',"status='CLOSED'",'INSERT OR REPLACE INTO ratings'])assert.match(source,new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))) });
test('approved project statuses only',()=>{const schema=read('db/schema.ts');assert.match(schema,/IN_PROGRESS/);assert.doesNotMatch(schema,/ON_SUPPORT|PAUSED|PLANNED/)});
test('telegram failure does not reject domain operation',()=>{const source=read('lib/platform.ts');assert.match(source,/void dispatchTelegram/);assert.match(source,/catch \(error\)/)});
test('admin authorization is server-side',()=>{assert.match(read('app/admin/page.tsx'),/requireChatGPTUser/);assert.match(read('app/admin/[section]/page.tsx'),/requireChatGPTUser/)});
