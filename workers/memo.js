// workers/memo.js

/**
 * @typedef { import('@cloudflare/workers-types').Env } Env
 */

/**
 * Cloudflare Workers モジュール形式のエントリポイント
 * @param {Request} request
 * @param {Env} env
 */
export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const name = url.searchParams.get('name');

    if (request.method === 'GET') {
      const memo = await env.MEMOS.get(name) || '';
      return new Response(JSON.stringify({ memo }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (request.method === 'POST') {
      const { memo } = await request.json();
      await env.MEMOS.put(name, memo);
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
};
