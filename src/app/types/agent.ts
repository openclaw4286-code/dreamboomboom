export interface Agent {
  id: string;
  name: string;
  rank: string;
  role: string;
  emoji: string;
  color: string;
  knowledge: string;
  lastUsed?: Date;
  isFavorite: boolean;
  isWorking: boolean;
  currentTask?: string;
  position: {
    row: number;
    col: number;
  };
}

export const defaultAgents: Agent[] = [
  {
    id: "2",
    name: "인사 AI Agent",
    rank: "소령",
    role: "인력관리 및 복지",
    emoji: "👥",
    color: "bg-green-100 text-green-700",
    knowledge: "",
    lastUsed: undefined,
    isFavorite: false,
    isWorking: false,
    position: { row: 0, col: 1 },
  },
  {
    id: "3",
    name: "군법 AI Agent",
    rank: "소령",
    role: "법률 및 규정",
    emoji: "⚖️",
    color: "bg-purple-100 text-purple-700",
    knowledge: "",
    lastUsed: undefined,
    isFavorite: false,
    isWorking: false,
    position: { row: 0, col: 2 },
  },
  {
    id: "4",
    name: "작전 AI Agent",
    rank: "중령",
    role: "작전계획 및 지휘",
    emoji: "🎯",
    color: "bg-red-100 text-red-700",
    knowledge: "",
    lastUsed: undefined,
    isFavorite: false,
    isWorking: false,
    position: { row: 1, col: 0 },
  },
  {
    id: "5",
    name: "정보 AI Agent",
    rank: "소령",
    role: "정보수집 및 분석",
    emoji: "🔍",
    color: "bg-indigo-100 text-indigo-700",
    knowledge: "",
    lastUsed: undefined,
    isFavorite: false,
    isWorking: false,
    position: { row: 1, col: 1 },
  },
  {
    id: "6",
    name: "군수 AI Agent",
    rank: "소령",
    role: "보급 및 지원",
    emoji: "📦",
    color: "bg-amber-100 text-amber-700",
    knowledge: "",
    lastUsed: undefined,
    isFavorite: false,
    isWorking: false,
    position: { row: 1, col: 2 },
  },
  {
    id: "7",
    name: "배차 AI Agent",
    rank: "소령",
    role: "차량 및 수송 관리",
    emoji: "🚗",
    color: "bg-teal-100 text-teal-700",
    knowledge: "",
    lastUsed: undefined,
    isFavorite: false,
    isWorking: false,
    position: { row: 2, col: 0 },
  },
];