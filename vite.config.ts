import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Dev middleware: /api/chat을 GitHub Models API로 프록시 (Vite 개발 서버 전용)
function devApiPlugin() {
  return {
    name: 'dev-api-chat',
    configureServer(server: any) {
      server.middlewares.use('/api/chat', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') { next(); return; }

        let body = '';
        req.on('data', (chunk: any) => (body += chunk));
        req.on('end', async () => {
          try {
            const { token, model, messages, temperature, max_tokens } = JSON.parse(body);
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
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = response.status;
            res.end(JSON.stringify(data));
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: '서버 오류' }));
          }
        });
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
