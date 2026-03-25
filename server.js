import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync } from 'fs';

// .env 파싱 (dotenv 없이)
function loadEnv() {
  const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// --- 서버 측 토큰 저장 (메모리 + .env 파일) ---
let aiToken = process.env.AI_TOKEN || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';

// 활성 admin 세션 (메모리)
const adminSessions = new Map(); // sessionId -> { createdAt }
const SESSION_TTL = 60 * 60 * 1000; // 1시간

function cleanExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of adminSessions) {
    if (now - session.createdAt > SESSION_TTL) adminSessions.delete(id);
  }
}

function isValidSession(req) {
  cleanExpiredSessions();
  const sessionId = req.headers['x-admin-session'];
  return sessionId && adminSessions.has(sessionId);
}

app.use(express.json());

// --- 공개 API: 토큰 설정 여부 확인 (토큰 값은 노출 안 됨) ---
app.get('/api/token-status', (req, res) => {
  res.json({ configured: !!aiToken });
});

// --- Admin API ---

// 로그인
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
  }
  const sessionId = crypto.randomBytes(32).toString('hex');
  adminSessions.set(sessionId, { createdAt: Date.now() });
  res.json({ sessionId });
});

// 로그아웃
app.post('/api/admin/logout', (req, res) => {
  const sessionId = req.headers['x-admin-session'];
  if (sessionId) adminSessions.delete(sessionId);
  res.json({ ok: true });
});

// 세션 확인
app.get('/api/admin/check', (req, res) => {
  res.json({ authenticated: isValidSession(req) });
});

// 토큰 상태 (마스킹된 값)
app.get('/api/admin/token', (req, res) => {
  if (!isValidSession(req)) return res.status(401).json({ error: '인증이 필요합니다.' });
  const masked = aiToken
    ? aiToken.slice(0, 8) + '****' + aiToken.slice(-4)
    : '';
  res.json({ configured: !!aiToken, masked });
});

// 토큰 저장
app.post('/api/admin/token', (req, res) => {
  if (!isValidSession(req)) return res.status(401).json({ error: '인증이 필요합니다.' });
  const { token } = req.body;
  if (!token || !token.trim()) {
    return res.status(400).json({ error: '토큰을 입력해주세요.' });
  }
  aiToken = token.trim();

  // .env 파일에도 저장 (서버 재시작 시 유지)
  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';
    if (envContent.includes('AI_TOKEN=')) {
      envContent = envContent.replace(/AI_TOKEN=.*/g, `AI_TOKEN=${aiToken}`);
    } else {
      envContent += `\nAI_TOKEN=${aiToken}\n`;
    }
    writeFileSync(envPath, envContent);
  } catch (e) {
    console.error('.env 저장 실패:', e);
  }

  res.json({ ok: true, message: '토큰이 저장되었습니다.' });
});

// 모델 설정 (서버 측)
let selectedModel = process.env.AI_MODEL || 'openai/gpt-4o-mini';

app.get('/api/admin/model', (req, res) => {
  if (!isValidSession(req)) return res.status(401).json({ error: '인증이 필요합니다.' });
  res.json({ model: selectedModel });
});

app.post('/api/admin/model', (req, res) => {
  if (!isValidSession(req)) return res.status(401).json({ error: '인증이 필요합니다.' });
  const { model } = req.body;
  if (model) selectedModel = model;
  res.json({ ok: true, model: selectedModel });
});

// --- Chat API (토큰은 서버에서 주입) ---
app.post('/api/chat', async (req, res) => {
  const { messages, temperature, max_tokens } = req.body;

  if (!aiToken) {
    return res.status(400).json({ error: 'AI 토큰이 설정되지 않았습니다. 관리자에게 문의하세요.' });
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
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1024,
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('GitHub API 오류:', error);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
});

// Vite 빌드 결과물 (dist/) 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// SPA 라우팅 - 모든 경로를 index.html로 폴백
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  console.log(`AI 토큰: ${aiToken ? '설정됨' : '미설정'}`);
  console.log(`Admin 비밀번호: 설정됨`);
});
