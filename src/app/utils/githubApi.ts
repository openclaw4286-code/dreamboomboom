export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGithubCopilot(
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.message || errorData.error || "알 수 없는 오류";
    throw new Error(`API 오류 (${response.status}): ${errorMsg}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 서버 토큰 설정 여부 확인
export async function checkTokenStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/token-status");
    const data = await res.json();
    return data.configured;
  } catch {
    return false;
  }
}

// Admin API
export async function adminLogin(password: string): Promise<string> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "로그인 실패");
  }
  const data = await res.json();
  return data.sessionId;
}

export async function adminCheckSession(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/check", {
      headers: { "x-admin-session": sessionId },
    });
    const data = await res.json();
    return data.authenticated;
  } catch {
    return false;
  }
}

export async function adminGetToken(sessionId: string) {
  const res = await fetch("/api/admin/token", {
    headers: { "x-admin-session": sessionId },
  });
  if (!res.ok) throw new Error("인증 실패");
  return res.json();
}

export async function adminSetToken(sessionId: string, token: string) {
  const res = await fetch("/api/admin/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-session": sessionId,
    },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "토큰 저장 실패");
  }
  return res.json();
}

export async function adminGetModel(sessionId: string) {
  const res = await fetch("/api/admin/model", {
    headers: { "x-admin-session": sessionId },
  });
  if (!res.ok) throw new Error("인증 실패");
  return res.json();
}

export async function adminSetModel(sessionId: string, model: string) {
  const res = await fetch("/api/admin/model", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-session": sessionId,
    },
    body: JSON.stringify({ model }),
  });
  return res.json();
}

export async function adminLogout(sessionId: string) {
  await fetch("/api/admin/logout", {
    method: "POST",
    headers: { "x-admin-session": sessionId },
  });
}

export const AVAILABLE_MODELS = [
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini (빠름, 추천)" },
  { value: "openai/gpt-4o", label: "GPT-4o (고성능)" },
  { value: "openai/gpt-4.1", label: "GPT-4.1 (최신)" },
  { value: "openai/o1-mini", label: "o1 Mini (추론 특화)" },
];
