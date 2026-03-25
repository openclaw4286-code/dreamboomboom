import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Bell, Moon, Globe, Shield, Bot, CheckCircle2, AlertCircle, Menu } from "lucide-react";
import { checkTokenStatus } from "../utils/githubApi";
import { useMobileMenu } from "../components/MobileMenuContext";

export default function Settings() {
  const [tokenConfigured, setTokenConfigured] = useState<boolean | null>(null);
  const openMenu = useMobileMenu();

  useEffect(() => {
    checkTokenStatus().then(setTokenConfigured);
  }, []);

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
              <h1 className="text-xl md:text-2xl font-bold text-white mb-0.5">설정</h1>
              <p className="text-sm text-slate-400">Settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* AI Status */}
          <Card className="bg-slate-800/50 border-indigo-500/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <CardTitle className="text-white text-base md:text-lg">
                    AI 상태
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    AI 에이전트 연결 상태
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tokenConfigured === null ? (
                <p className="text-slate-400 text-sm">확인 중...</p>
              ) : tokenConfigured ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">AI 활성화됨</span>
                  <span className="text-slate-500 text-sm">- 에이전트 채팅을 사용할 수 있습니다</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-medium">AI 비활성화</span>
                  <span className="text-slate-500 text-sm">- 관리자에게 문의하세요</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <CardTitle className="text-white text-base md:text-lg">알림 설정</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    시스템 알림을 관리합니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notification-push" className="text-slate-300">
                  푸시 알림
                </Label>
                <Switch id="notification-push" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notification-email" className="text-slate-300">
                  이메일 알림
                </Label>
                <Switch id="notification-email" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notification-sound" className="text-slate-300">
                  소리 알림
                </Label>
                <Switch id="notification-sound" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <CardTitle className="text-white text-base md:text-lg">화면 설정</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    테마 및 표시 옵션을 설정합니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-slate-300">
                  다크 모드
                </Label>
                <Switch id="dark-mode" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-view" className="text-slate-300">
                  컴팩트 뷰
                </Label>
                <Switch id="compact-view" />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <CardTitle className="text-white text-base md:text-lg">언어 설정</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    표시 언어를 선택합니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                >
                  한국어
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  English
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <CardTitle className="text-white text-base md:text-lg">개인정보 보호</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    데이터 및 개인정보 설정
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="text-slate-300">
                  사용 통계 수집
                </Label>
                <Switch id="analytics" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save" className="text-slate-300">
                  자동 저장
                </Label>
                <Switch id="auto-save" defaultChecked />
              </div>
              <div className="pt-4 border-t border-slate-700">
                <Button variant="destructive" className="w-full">
                  모든 데이터 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
