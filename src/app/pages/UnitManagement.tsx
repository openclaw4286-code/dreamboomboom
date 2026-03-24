import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, Users, Shield, MapPin } from "lucide-react";

export default function UnitManagement() {
  const units = [
    {
      name: "제1대대",
      commander: "김중령",
      personnel: 250,
      location: "서울 용산구",
      status: "정상",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "제2대대",
      commander: "이중령",
      personnel: 230,
      location: "경기 평택시",
      status: "정상",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "제3대대",
      commander: "박중령",
      personnel: 245,
      location: "강원 춘천시",
      status: "정상",
      color: "bg-green-100 text-green-700",
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
              <h1 className="text-2xl font-bold text-white mb-1">부대 관리</h1>
              <p className="text-sm text-slate-400">Unit Management</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">총 부대</p>
                      <p className="text-2xl font-bold text-white">{units.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">총 인원</p>
                      <p className="text-2xl font-bold text-white">
                        {units.reduce((sum, unit) => sum + unit.personnel, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">정상 운영</p>
                      <p className="text-2xl font-bold text-white">100%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">배치 지역</p>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Unit List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">부대 현황</h2>
              {units.map((unit, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{unit.name}</CardTitle>
                          <CardDescription className="text-slate-400">
                            지휘관: {unit.commander}
                          </CardDescription>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full ${unit.color}`}>
                        {unit.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          병력: <span className="text-white font-medium">{unit.personnel}명</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          위치: <span className="text-white font-medium">{unit.location}</span>
                        </span>
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
