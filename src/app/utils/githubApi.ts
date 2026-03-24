export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGithubCopilot(
  messages: ChatMessage[],
  token: string,
  model: string = "openai/gpt-4o-mini"
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      model,
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

export const GITHUB_TOKEN_KEY = "solomon-github-token";
export const GITHUB_MODEL_KEY = "solomon-github-model";

export const AVAILABLE_MODELS = [
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini (빠름, 추천)" },
  { value: "openai/gpt-4o", label: "GPT-4o (고성능)" },
  { value: "openai/gpt-4.1", label: "GPT-4.1 (최신)" },
  { value: "openai/o1-mini", label: "o1 Mini (추론 특화)" },
];
