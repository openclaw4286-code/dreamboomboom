import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Bell, Moon, Globe, Shield, Bot, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import {
  GITHUB_TOKEN_KEY,
  GITHUB_MODEL_KEY,
  AVAILABLE_MODELS,
} from "../utils/githubApi";

export default function Settings() {
  const [githubToken, setGithubToken] = useState(
    () => localStorage.getItem(GITHUB_TOKEN_KEY) || ""
  );
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem(GITHUB_MODEL_KEY) || "openai/gpt-4o-mini"
  );
  const [showToken, setShowToken] = useState(false);
  const [tokenSaved, setTokenSaved] = useState(false);

  const handleSaveToken = () => {
    localStorage.setItem(GITHUB_TOKEN_KEY, githubToken);
    localStorage.setItem(GITHUB_MODEL_KEY, selectedModel);
    setTokenSaved(true);
    setTimeout(() => setTokenSaved(false), 2000);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">설정</h1>
              <p className="text-sm text-slate-400">Settings</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* GitHub Copilot API */}
            <Card className="bg-slate-800/50 border-indigo-500/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <div>
                    <CardTitle className="text-white">GitHub Copilot AI 설정</CardTitle>
                    <CardDescription className="text-slate-400">
                      GitHub Models API 연동을 위한 토큰을 설정합니다
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg bg-slate-900/60 border border-slate-600 p-4 text-sm text-slate-300 space-y-2">
                  <p className="font-semibold text-indigo-300">토큰 발급 방법:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>GitHub.com → 오른쪽 상단 프로필 → Settings</li>
                    <li>왼쪽 하단 Developer settings → Personal access tokens</li>
                    <li>Fine-grained tokens → Generate new token</li>
                    <li>Permissions → Account permissions → <span className="text-indigo-300 font-medium">Models: Read</span> 선택</li>
                    <li>Generate token 클릭 후 토큰 복사</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">GitHub Personal Access Token</Label>
                  <div className="relative">
                    <Input
                      type={showToken ? "text" : "password"}
                      placeholder="github_pat_..."
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">AI 모델 선택</Label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full rounded-md border border-slate-600 bg-slate-900 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {AVAILABLE_MODELS.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleSaveToken}
                  disabled={!githubToken.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {tokenSaved ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> 저장 완료
                    </span>
                  ) : (
                    "저장"
                  )}
                </Button>

                {githubToken && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    토큰이 설정되어 있습니다. AI 에이전트 채팅이 활성화됩니다.
                  </p>
                )}
                {!githubToken && (
                  <p className="text-xs text-amber-400">
                    ⚠️ 토큰 미설정 시 에이전트가 고정 응답을 반환합니다.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-400" />
                  <div>
                    <CardTitle className="text-white">알림 설정</CardTitle>
                    <CardDescription className="text-slate-400">
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
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <div>
                    <CardTitle className="text-white">화면 설정</CardTitle>
                    <CardDescription className="text-slate-400">
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
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <div>
                    <CardTitle className="text-white">언어 설정</CardTitle>
                    <CardDescription className="text-slate-400">
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
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <div>
                    <CardTitle className="text-white">개인정보 보호</CardTitle>
                    <CardDescription className="text-slate-400">
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
    </div>
  );
}
