import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, Users, Shield, MapPin, Menu } from "lucide-react";
import { useMobileMenu } from "../components/MobileMenuContext";

export default function UnitManagement() {
  const openMenu = useMobileMenu();

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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={openMenu}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-0.5">부대 관리</h1>
              <p className="text-sm text-slate-400">Unit Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-4 md:pt-6 pb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-slate-400">총 부대</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{units.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-4 md:pt-6 pb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-slate-400">총 인원</p>
                    <p className="text-xl md:text-2xl font-bold text-white">
                      {units.reduce((sum, unit) => sum + unit.personnel, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-4 md:pt-6 pb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-slate-400">정상 운영</p>
                    <p className="text-xl md:text-2xl font-bold text-white">100%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-4 md:pt-6 pb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-slate-400">배치 지역</p>
                    <p className="text-xl md:text-2xl font-bold text-white">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unit List */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">부대 현황</h2>
            {units.map((unit, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-white text-lg md:text-xl">{unit.name}</CardTitle>
                        <CardDescription className="text-slate-400">
                          지휘관: {unit.commander}
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm shrink-0 ${unit.color}`}>
                      {unit.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-400 truncate">
                        병력:{" "}
                        <span className="text-white font-medium">{unit.personnel}명</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-400 truncate">
                        위치:{" "}
                        <span className="text-white font-medium">{unit.location}</span>
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
  );
}
