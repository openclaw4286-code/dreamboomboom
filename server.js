import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// /api/chat → GitHub Models API 프록시
app.post('/api/chat', async (req, res) => {
  const { token, model, messages, temperature, max_tokens } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'GitHub 토큰이 필요합니다.' });
  }

  try {
    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-4o-mini',
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
});
