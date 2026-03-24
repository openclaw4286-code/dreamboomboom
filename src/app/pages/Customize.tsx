import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Save, RotateCcw } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { Agent, defaultAgents } from "../types/agent";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

export default function Customize() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);

  useEffect(() => {
    const savedAgents = localStorage.getItem("solomon-agents-v2");
    if (savedAgents) {
      const parsed = JSON.parse(savedAgents);
      setAgents(parsed);
    } else {
      setAgents(defaultAgents);
      localStorage.setItem("solomon-agents-v2", JSON.stringify(defaultAgents));
    }
  }, []);

  const handleKnowledgeChange = (agentId: string, knowledge: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, knowledge } : agent
      )
    );
  };

  const handleSave = () => {
    localStorage.setItem("solomon-agents-v2", JSON.stringify(agents));
    toast.success("Agent 정보가 저장되었습니다", {
      description: "학습한 내용이 적용되었습니다.",
    });
  };

  const handleReset = (agentId: string) => {
    const defaultAgent = defaultAgents.find((a) => a.id === agentId);
    if (defaultAgent) {
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === agentId ? { ...agent, knowledge: "" } : agent
        )
      );
      toast.info("Agent 정보가 초기화되었습니다");
    }
  };

  const handleResetAll = () => {
    setAgents(defaultAgents);
    localStorage.setItem("solomon-agents-v2", JSON.stringify(defaultAgents));
    toast.info("모든 Agent 정보가 초기화되었습니다");
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster />
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Agent 관리</h1>
              <p className="text-sm text-slate-400">Agent Customization</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleResetAll}
                className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
                전체 초기화
              </Button>
              <Button
                onClick={handleSave}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-4 h-4" />
                저장
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">전문 지식 학습</h2>
              <p className="text-slate-400">
                각 Agent에게 전문 지식을 학습시켜 더 정확한 답변을 받으세요
              </p>
            </div>

            {/* Agent Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">
                          {agent.emoji}
                        </div>
                        <div>
                          <CardTitle className="text-white">
                            {agent.name}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            {agent.role}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReset(agent.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">
                          전문 지식 입력
                        </label>
                        <span className="text-xs text-slate-500">
                          {agent.knowledge?.length || 0} 자
                        </span>
                      </div>
                      <Textarea
                        value={agent.knowledge}
                        onChange={(e) => handleKnowledgeChange(agent.id, e.target.value)}
                        onFocus={() => setEditingAgent(agent.id)}
                        onBlur={() => setEditingAgent(null)}
                        placeholder={`${agent.name}에게 학습시킬 전문 지식을 입력하세요...\n\n예시:\n- 관련 규정 및 지침\n- 업무 프로세스\n- 참고 자료\n- 전문 용어 및 개념`}
                        className={`min-h-[200px] resize-none bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500 transition-all ${
                          editingAgent === agent.id ? "ring-2 ring-indigo-500/20" : ""
                        }`}
                      />
                      {agent.knowledge && (
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>학습 완료</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-indigo-950/30 border border-indigo-900/50 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-indigo-400">💡</span>
                활용 팁
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>구체적인 규정, 지침, 매뉴얼을 입력하면 더 정확한 답변을 받을 수 있습니다</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>전문 용어와 그 의미를 함께 입력하면 맥락을 이해한 답변을 제공합니다</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>실제 업무 사례나 예시를 포함하면 실무에 적용 가능한 조언을 받을 수 있습니다</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}