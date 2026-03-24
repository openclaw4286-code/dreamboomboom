import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import ChatModal from "../components/ChatModal";
import Sidebar from "../components/Sidebar";
import { Agent, defaultAgents } from "../types/agent";

export default function SituationRoom() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    // Load agents from localStorage or use defaults
    const savedAgents = localStorage.getItem("solomon-agents-v2");
    if (savedAgents) {
      const parsed = JSON.parse(savedAgents);
      setAgents(parsed);
    } else {
      setAgents(defaultAgents);
      localStorage.setItem("solomon-agents-v2", JSON.stringify(defaultAgents));
    }
  }, []);

  const handleAgentClick = (agent: Agent) => {
    if (agent.isWorking) return; // 작업 중이면 클릭 불가
    setSelectedAgent(agent);
    setIsModalOpen(true);
    
    // Update last used time
    const updatedAgents = agents.map((a) =>
      a.id === agent.id ? { ...a, lastUsed: new Date() } : a
    );
    setAgents(updatedAgents);
    localStorage.setItem("solomon-agents-v2", JSON.stringify(updatedAgents));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAgent(null), 300);
  };

  const handleTaskComplete = (agentId: string, task: string) => {
    const updatedAgents = agents.map((a) =>
      a.id === agentId ? { ...a, isWorking: false, currentTask: undefined } : a
    );
    setAgents(updatedAgents);
    localStorage.setItem("solomon-agents-v2", JSON.stringify(updatedAgents));
  };

  const toggleFavorite = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedAgents = agents.map((a) =>
      a.id === agentId ? { ...a, isFavorite: !a.isFavorite } : a
    );
    setAgents(updatedAgents);
    localStorage.setItem("solomon-agents-v2", JSON.stringify(updatedAgents));
  };

  const getTimeAgo = (date?: Date) => {
    if (!date) return "미사용";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const favoriteAgents = agents.filter(a => a.isFavorite);
  const displayAgents = showFavorites ? favoriteAgents : agents;

  // Create grid layout - now 3 rows
  const maxRow = displayAgents.length > 0 ? Math.max(...displayAgents.map(a => a.position.row)) : 0;
  const grid = Array(maxRow + 1).fill(null).map(() => Array(3).fill(null));
  displayAgents.forEach(agent => {
    grid[agent.position.row][agent.position.col] = agent;
  });

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">상황실</h1>
                <p className="text-sm text-slate-400">Operation Center</p>
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    showFavorites
                      ? "bg-amber-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Star className={`w-4 h-4 ${showFavorites ? "fill-white" : ""}`} />
                  <span>즐겨찾기 {favoriteAgents.length > 0 && `(${favoriteAgents.length})`}</span>
                </button>
                <div>
                  <p className="text-slate-400 text-sm mb-1">현재 시각</p>
                  <p className="text-white text-lg font-mono">
                    {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">대기중인 Agent</p>
                  <p className="text-white text-lg font-semibold">{agents.filter(a => !a.isWorking).length}명</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {showFavorites && favoriteAgents.length === 0 ? (
              <div className="text-center py-20">
                <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">즐겨찾기한 Agent가 없습니다</p>
                <p className="text-slate-500 text-sm mt-2">Agent 카드의 별 아이콘을 클릭하여 추가하세요</p>
              </div>
            ) : (
              <div className="space-y-6">
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-3 gap-6">
                    {row.map((agent, colIndex) => {
                      if (!agent) return <div key={colIndex} />;
                      return (
                        <motion.button
                          key={agent.id}
                          onClick={() => handleAgentClick(agent)}
                          disabled={agent.isWorking}
                          className={`group relative bg-slate-800/50 backdrop-blur-sm border-2 rounded-xl p-6 transition-all duration-300 ${
                            agent.isWorking
                              ? "border-amber-500 cursor-not-allowed"
                              : "border-slate-700 hover:border-indigo-500 hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/20"
                          }`}
                          whileHover={agent.isWorking ? {} : { scale: 1.05 }}
                          whileTap={agent.isWorking ? {} : { scale: 0.98 }}
                        >
                          {/* Favorite Star */}
                          <button
                            onClick={(e) => toggleFavorite(agent.id, e)}
                            className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-slate-700 transition-all"
                          >
                            <Star
                              className={`w-5 h-5 transition-all ${
                                agent.isFavorite
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-500 hover:text-amber-400"
                              }`}
                            />
                          </button>

                          {/* Status Indicator */}
                          <div className="absolute top-4 left-4">
                            <div className={`w-3 h-3 rounded-full ${
                              agent.isWorking ? "bg-amber-500 animate-pulse" : "bg-green-500 animate-pulse"
                            }`} />
                          </div>

                          {/* Agent Info */}
                          <div className="flex flex-col items-center text-center">
                            {/* 3D Animated Emoji */}
                            <motion.div
                              className="text-6xl mb-4"
                              animate={
                                agent.isWorking
                                  ? {
                                      rotateZ: [0, -5, 5, -5, 5, 0],
                                      scale: [1, 1.05, 1],
                                    }
                                  : {
                                      rotateY: [0, 10, -10, 0],
                                      y: [0, -5, 0],
                                    }
                              }
                              transition={{
                                duration: agent.isWorking ? 2 : 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              whileHover={
                                agent.isWorking
                                  ? {}
                                  : {
                                      scale: 1.2,
                                      rotateZ: [0, -10, 10, 0],
                                      transition: { duration: 0.5 },
                                    }
                              }
                            >
                              {agent.emoji}
                            </motion.div>

                            <h3 className="text-white font-bold text-xl mb-2">
                              {agent.name}
                            </h3>
                            <p className="text-slate-400 text-sm mb-3">{agent.role}</p>

                            {/* Working Status or Last Used Time */}
                            {agent.isWorking ? (
                              <div className="text-xs">
                                <div className="flex items-center gap-2 text-amber-400 mb-2">
                                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                  <span className="font-semibold">작업 진행중</span>
                                </div>
                                {agent.currentTask && (
                                  <p className="text-slate-500 text-xs">{agent.currentTask}</p>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500">
                                최근 활동: {getTimeAgo(agent.lastUsed)}
                              </div>
                            )}
                          </div>

                          {/* Knowledge Badge */}
                          {agent.knowledge && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                              <span className="text-xs text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded-full">
                                학습 완료
                              </span>
                            </div>
                          )}

                          {/* Hover Effect */}
                          {!agent.isWorking && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300 pointer-events-none" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Agent를 클릭하여 명령을 전달하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTaskComplete={handleTaskComplete}
      />
    </div>
  );
}