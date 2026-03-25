import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import crypto from 'crypto'

// Dev middleware: 개발 서버에서 API 엔드포인트 처리
function devApiPlugin() {
  // .env 로드
  function loadEnv() {
    const envPath = path.resolve(__dirname, '.env');
    const env: Record<string, string> = {};
    if (existsSync(envPath)) {
      const lines = readFileSync(envPath, 'utf-8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
      }
    }
    return env;
  }

  let aiToken = '';
  let selectedModel = 'openai/gpt-4o-mini';
  const adminPassword = loadEnv().ADMIN_PASSWORD || 'changeme123';
  const adminSessions = new Map<string, { createdAt: number }>();
  const SESSION_TTL = 60 * 60 * 1000;

  // 초기 토큰 로드
  const initEnv = loadEnv();
  aiToken = initEnv.AI_TOKEN || '';

  function cleanSessions() {
    const now = Date.now();
    for (const [id, s] of adminSessions) {
      if (now - s.createdAt > SESSION_TTL) adminSessions.delete(id);
    }
  }

  function isValidSession(req: any) {
    cleanSessions();
    const sid = req.headers['x-admin-session'];
    return sid && adminSessions.has(sid);
  }

  function parseBody(req: any): Promise<any> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk: any) => (body += chunk));
      req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
    });
  }

  function sendJson(res: any, status: number, data: any) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = status;
    res.end(JSON.stringify(data));
  }

  return {
    name: 'dev-api',
    configureServer(server: any) {
      // Token status (public)
      server.middlewares.use('/api/token-status', (req: any, res: any, next: any) => {
        if (req.method !== 'GET') { next(); return; }
        sendJson(res, 200, { configured: !!aiToken });
      });

      // Admin login
      server.middlewares.use('/api/admin/login', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') { next(); return; }
        const body = await parseBody(req);
        if (body.password !== adminPassword) {
          sendJson(res, 401, { error: '비밀번호가 올바르지 않습니다.' });
          return;
        }
        const sessionId = crypto.randomBytes(32).toString('hex');
        adminSessions.set(sessionId, { createdAt: Date.now() });
        sendJson(res, 200, { sessionId });
      });

      // Admin logout
      server.middlewares.use('/api/admin/logout', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') { next(); return; }
        const sid = req.headers['x-admin-session'];
        if (sid) adminSessions.delete(sid);
        sendJson(res, 200, { ok: true });
      });

      // Admin check
      server.middlewares.use('/api/admin/check', (req: any, res: any, next: any) => {
        if (req.method !== 'GET') { next(); return; }
        sendJson(res, 200, { authenticated: isValidSession(req) });
      });

      // Admin token (GET/POST)
      server.middlewares.use('/api/admin/token', async (req: any, res: any, next: any) => {
        if (req.method === 'GET') {
          if (!isValidSession(req)) { sendJson(res, 401, { error: '인증 필요' }); return; }
          const masked = aiToken ? aiToken.slice(0, 8) + '****' + aiToken.slice(-4) : '';
          sendJson(res, 200, { configured: !!aiToken, masked });
        } else if (req.method === 'POST') {
          if (!isValidSession(req)) { sendJson(res, 401, { error: '인증 필요' }); return; }
          const body = await parseBody(req);
          if (!body.token?.trim()) { sendJson(res, 400, { error: '토큰 필요' }); return; }
          aiToken = body.token.trim();
          // .env에 저장
          try {
            const envPath = path.resolve(__dirname, '.env');
            let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';
            if (envContent.includes('AI_TOKEN=')) {
              envContent = envContent.replace(/AI_TOKEN=.*/g, `AI_TOKEN=${aiToken}`);
            } else {
              envContent += `\nAI_TOKEN=${aiToken}\n`;
            }
            writeFileSync(envPath, envContent);
          } catch (e) { console.error('.env 저장 실패:', e); }
          sendJson(res, 200, { ok: true });
        } else { next(); }
      });

      // Admin model (GET/POST)
      server.middlewares.use('/api/admin/model', async (req: any, res: any, next: any) => {
        if (req.method === 'GET') {
          if (!isValidSession(req)) { sendJson(res, 401, { error: '인증 필요' }); return; }
          sendJson(res, 200, { model: selectedModel });
        } else if (req.method === 'POST') {
          if (!isValidSession(req)) { sendJson(res, 401, { error: '인증 필요' }); return; }
          const body = await parseBody(req);
          if (body.model) selectedModel = body.model;
          sendJson(res, 200, { ok: true, model: selectedModel });
        } else { next(); }
      });

      // Chat proxy (token from server)
      server.middlewares.use('/api/chat', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') { next(); return; }
        const body = await parseBody(req);
        if (!aiToken) {
          sendJson(res, 400, { error: 'AI 토큰이 설정되지 않았습니다.' });
          return;
        }
        try {
          const response = await fetch('https://models.github.ai/inference/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github+json',
              'Authorization': `Bearer ${aiToken}`,
              'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: body.messages,
              temperature: body.temperature ?? 0.7,
              max_tokens: body.max_tokens ?? 1024,
            }),
          });
          const data = await response.json();
          sendJson(res, response.status, data);
        } catch {
          sendJson(res, 500, { error: '서버 오류' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    devApiPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
