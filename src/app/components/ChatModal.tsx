import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Agent } from "../types/agent";
import { motion, AnimatePresence } from "motion/react";
import { callGithubCopilot, checkTokenStatus } from "../utils/githubApi";

interface ChatModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskComplete: (agentId: string, task: string) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  taskStatus?: "processing" | "completed";
}

export default function ChatModal({ agent, isOpen, onClose, onTaskComplete }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTaskProgress, setCurrentTaskProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && agent) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `${agent.name}입니다. 무엇을 도와드릴까요?`,
          timestamp: new Date(),
        },
      ]);
      setCurrentTaskProgress(0);
    }
  }, [isOpen, agent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !agent || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const taskInput = input;
    setInput("");
    setIsProcessing(true);
    setCurrentTaskProgress(0);

    const processingId = (Date.now() + 1).toString();
    const processingMessage: Message = {
      id: processingId,
      role: "system",
      content: `"${taskInput}" 작업을 진행중입니다...`,
      timestamp: new Date(),
      taskStatus: "processing",
    };
    setMessages((prev) => [...prev, processingMessage]);

    // Indeterminate progress animation while waiting for API
    const progressInterval = setInterval(() => {
      setCurrentTaskProgress((prev) => (prev >= 90 ? 90 : prev + 5));
    }, 300);

    try {
      let responseContent: string;

      const tokenConfigured = await checkTokenStatus();

      if (tokenConfigured) {
        // Build conversation history for the API call
        const conversationHistory = messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

        const systemPrompt = [
          `당신은 대한민국 군대의 ${agent.name} (${agent.rank})입니다.`,
          `역할: ${agent.role}`,
          agent.knowledge ? `\n전문 지식 및 참고 데이터:\n${agent.knowledge}` : "",
          "\n명령에 따라 전문적이고 군사적인 방식으로 응답하십시오.",
          "한국어로 응답하십시오. 필요한 경우 명확한 구조와 항목으로 정리하여 답변하십시오.",
        ]
          .filter(Boolean)
          .join("\n");

        responseContent = await callGithubCopilot([
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: taskInput },
        ]);
      } else {
        // Fallback when no token is configured on server
        await new Promise((resolve) => setTimeout(resolve, 1500));
        responseContent = `"${taskInput}" 작업을 수신했습니다.\n\n⚠️ AI 토큰이 서버에 설정되지 않았습니다.\n관리자에게 문의해주십시오.`;
      }

      clearInterval(progressInterval);
      setCurrentTaskProgress(100);

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== processingId);
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            role: "system",
            content: `✅ "${taskInput}" 작업을 완료했습니다`,
            timestamp: new Date(),
            taskStatus: "completed",
          },
          {
            id: (Date.now() + 3).toString(),
            role: "assistant",
            content: responseContent,
            timestamp: new Date(),
          },
        ];
      });

      onTaskComplete(agent.id, taskInput);
    } catch (error) {
      clearInterval(progressInterval);

      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== processingId);
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            role: "system",
            content: `❌ 오류: ${errorMessage}`,
            timestamp: new Date(),
            taskStatus: "completed",
          },
        ];
      });
    } finally {
      setIsProcessing(false);
      setCurrentTaskProgress(0);
    }
  };

  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl h-[85dvh] sm:h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${agent.color} relative`}>
                {agent.emoji}
                {isProcessing && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {agent.name} {agent.rank}
                </DialogTitle>
                <p className="text-sm text-gray-500">{agent.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <AnimatePresence key={message.id} mode="wait">
                {message.role === "system" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-center"
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.taskStatus === "processing"
                        ? "bg-amber-50 border border-amber-200"
                        : message.content.startsWith("❌")
                        ? "bg-red-50 border border-red-200"
                        : "bg-green-50 border border-green-200"
                    }`}>
                      <div className="flex items-center gap-3">
                        {message.taskStatus === "processing" ? (
                          <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                        ) : message.content.startsWith("❌") ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            message.taskStatus === "processing"
                              ? "text-amber-900"
                              : message.content.startsWith("❌")
                              ? "text-red-900"
                              : "text-green-900"
                          }`}>
                            {message.content}
                          </p>
                          {message.taskStatus === "processing" && (
                            <div className="mt-2 w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                className="h-full bg-amber-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${currentTaskProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <span className={`text-xs mt-1 block ${
                        message.role === "user" ? "text-indigo-200" : "text-gray-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex gap-3">
            <Textarea
              placeholder={isProcessing ? "작업 진행 중..." : "명령을 입력하세요..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isProcessing}
              className="min-h-[60px] resize-none bg-white"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="h-[60px] w-[60px] shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}