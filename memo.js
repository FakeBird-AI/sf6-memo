addEventListener('fetch', event => {
    event.respondWith(handle(event.request));
  });
  
  /** @type {import('@cloudflare/workers-types').Env} */
  async function handle(request) {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    if (request.method === 'GET') {
      const memo = await MEMOS.get(name) || '';
      return new Response(JSON.stringify({ memo }), { headers: { 'Content-Type': 'application/json' } });
    } else if (request.method === 'POST') {
      const { memo } = await request.json();
      await MEMOS.put(name, memo);
      return new Response(null, { status: 204 });
    }
    return new Response('Method Not Allowed', { status: 405 });
  }
  