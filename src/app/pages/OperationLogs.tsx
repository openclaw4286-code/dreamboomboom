import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "../components/ui/card";
import { FileText, Clock, User } from "lucide-react";

export default function OperationLogs() {
  const logs = [
    {
      id: 1,
      agent: "작전 AI Agent",
      action: "작전 계획 수립 지원",
      timestamp: new Date(2026, 2, 10, 14, 30),
      status: "completed",
      duration: "15분",
    },
    {
      id: 2,
      agent: "정보 AI Agent",
      action: "정보 분석 보고서 작성",
      timestamp: new Date(2026, 2, 10, 13, 15),
      status: "completed",
      duration: "23분",
    },
    {
      id: 3,
      agent: "군수 AI Agent",
      action: "보급품 현황 점검",
      timestamp: new Date(2026, 2, 10, 11, 45),
      status: "completed",
      duration: "8분",
    },
    {
      id: 4,
      agent: "인사 AI Agent",
      action: "인사 발령 처리",
      timestamp: new Date(2026, 2, 9, 16, 20),
      status: "completed",
      duration: "12분",
    },
    {
      id: 5,
      agent: "정훈 AI Agent",
      action: "정신교육 자료 준비",
      timestamp: new Date(2026, 2, 9, 10, 30),
      status: "completed",
      duration: "18분",
    },
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">작전 기록</h1>
              <p className="text-sm text-slate-400">Operation Logs</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">최근 활동 기록</h2>
              <p className="text-slate-400">AI Agent의 작업 이력을 확인하세요</p>
            </div>

            <div className="space-y-4">
              {logs.map((log) => (
                <Card
                  key={log.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-white font-semibold mb-1">{log.action}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{log.agent}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {log.timestamp.toLocaleDateString('ko-KR')} {log.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full shrink-0">
                            {log.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}