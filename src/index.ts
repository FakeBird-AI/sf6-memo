// src/index.ts
export interface Env {
  MEMOS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    // segments の例: ['api','characters'] あるいは ['api','characters','aki','memos',...]

    // CORS preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const jsonHeaders = { 'Content-Type': 'application/json' };

    //
    // キャラ一覧 CRUD
    //
    if (
      segments[0] === 'api' &&
      segments[1] === 'characters' &&
      segments.length === 2
    ) {
      // GET /api/characters
      if (request.method === 'GET') {
        const list = await env.MEMOS.get('characters');
        return new Response(list ?? '[]', { headers: jsonHeaders });
      }
      // POST /api/characters
      if (request.method === 'POST') {
        const { id, name, iconUrl, order } = await request.json();
        const prev = await env.MEMOS.get('characters');
        const arr = prev ? JSON.parse(prev) : [];
        arr.push({ id, name, iconUrl, order });
        await env.MEMOS.put('characters', JSON.stringify(arr));
        return new Response(JSON.stringify({ id, name, iconUrl, order }), { headers: jsonHeaders });
      }
      // PUT /api/characters/:id
      if (request.method === 'PUT') {
        const { id, name, iconUrl, order } = await request.json();
        const prev = await env.MEMOS.get('characters');
        const arr = prev ? JSON.parse(prev) : [];
        const idx = arr.findIndex((c: any) => c.id === id);
        if (idx < 0) return new Response('Not Found', { status: 404 });
        arr[idx] = { id, name, iconUrl, order };
        await env.MEMOS.put('characters', JSON.stringify(arr));
        return new Response(JSON.stringify(arr[idx]), { headers: jsonHeaders });
      }
      // DELETE /api/characters/:id
      if (request.method === 'DELETE') {
        const delId = segments[2];
        const prev = await env.MEMOS.get('characters');
        const arr = prev ? JSON.parse(prev) : [];
        const filtered = arr.filter((c: any) => c.id !== delId);
        await env.MEMOS.put('characters', JSON.stringify(filtered));
        return new Response(null, { status: 204 });
      }
    }

    //
    // メモ一覧 CRUD for each character
    //
    if (
      segments[0] === 'api' &&
      segments[1] === 'characters' &&
      segments.length >= 4 &&
      segments[3] === 'memos'
    ) {
      const charId = segments[2];

      // GET /api/characters/:id/memos
      if (request.method === 'GET' && segments.length === 4) {
        // ここで JSON 配列を文字列として返す
        const list = await env.MEMOS.get(`memos:${charId}`);
        return new Response(list ?? '[]', { headers: jsonHeaders });
      }

      // POST /api/characters/:id/memos
      if (request.method === 'POST' && segments.length === 4) {
        const { content } = await request.json();
        const newMemo = {
          memoId: Date.now().toString(),
          content,
          createdAt: new Date().toISOString(),
        };
        const prev = await env.MEMOS.get(`memos:${charId}`);
        const arr = prev ? JSON.parse(prev) : [];
        arr.push(newMemo);
        await env.MEMOS.put(`memos:${charId}`, JSON.stringify(arr));
        return new Response(JSON.stringify(newMemo), { headers: jsonHeaders });
      }

      // PUT /api/characters/:id/memos/order
      if (
        request.method === 'PUT' &&
        segments.length === 5 &&
        segments[4] === 'order'
      ) {
        const memoIdOrder: string[] = await request.json();
        const prev = await env.MEMOS.get(`memos:${charId}`);
        const arr: any[] = prev ? JSON.parse(prev) : [];
        // order 配列に合わせて並べ替え
        const sorted = memoIdOrder
          .map((mid) => arr.find((m) => m.memoId === mid))
          .filter(Boolean);
        await env.MEMOS.put(`memos:${charId}`, JSON.stringify(sorted));
        return new Response(JSON.stringify(sorted), { headers: jsonHeaders });
      }

      // PUT /api/characters/:id/memos/:memoId
      if (request.method === 'PUT' && segments.length === 5) {
        const memoId = segments[4];
        const { content } = await request.json();
        const prev = await env.MEMOS.get(`memos:${charId}`);
        const arr: any[] = prev ? JSON.parse(prev) : [];
        const idx = arr.findIndex((m) => m.memoId === memoId);
        if (idx < 0) return new Response('Not Found', { status: 404 });
        arr[idx].content = content;
        await env.MEMOS.put(`memos:${charId}`, JSON.stringify(arr));
        return new Response(JSON.stringify(arr[idx]), { headers: jsonHeaders });
      }

      // DELETE /api/characters/:id/memos/:memoId
      if (request.method === 'DELETE' && segments.length === 5) {
        const memoId = segments[4];
        const prev = await env.MEMOS.get(`memos:${charId}`);
        const arr: any[] = prev ? JSON.parse(prev) : [];
        const filtered = arr.filter((m) => m.memoId !== memoId);
        await env.MEMOS.put(`memos:${charId}`, JSON.stringify(filtered));
        return new Response(null, { status: 204 });
      }
    }

    // どれにも該当しない場合は 404
    return new Response('Not Found', { status: 404 });
  },
};
