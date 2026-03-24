import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Statistics() {
  const agentUsageData = [
    { name: "작전 AI Agent", count: 45 },
    { name: "정보 AI Agent", count: 38 },
    { name: "군수 AI Agent", count: 32 },
    { name: "인사 AI Agent", count: 28 },
    { name: "정훈 AI Agent", count: 25 },
    { name: "군법 AI Agent", count: 22 },
  ];

  const weeklyData = [
    { day: "월", operations: 12 },
    { day: "화", operations: 19 },
    { day: "수", operations: 15 },
    { day: "목", operations: 22 },
    { day: "금", operations: 18 },
    { day: "토", operations: 8 },
    { day: "일", operations: 6 },
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">통계</h1>
              <p className="text-sm text-slate-400">Statistics</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Agent Usage Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Agent별 활용도</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Operations */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">주간 작업 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="operations"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-2">총 작업 수</p>
                    <p className="text-4xl font-bold text-white">190</p>
                    <p className="text-xs text-green-400 mt-2">+12% 지난주 대비</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-2">평균 응답 시간</p>
                    <p className="text-4xl font-bold text-white">1.2초</p>
                    <p className="text-xs text-green-400 mt-2">-0.3초 개선</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-2">만족도</p>
                    <p className="text-4xl font-bold text-white">98%</p>
                    <p className="text-xs text-green-400 mt-2">+2% 지난주 대비</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}