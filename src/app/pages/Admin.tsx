import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Shield, Eye, EyeOff, CheckCircle2, LogOut, Key, Bot, Menu } from "lucide-react";
import {
  adminLogin,
  adminCheckSession,
  adminGetToken,
  adminSetToken,
  adminGetModel,
  adminSetModel,
  adminLogout,
  AVAILABLE_MODELS,
} from "../utils/githubApi";
import { useMobileMenu } from "../components/MobileMenuContext";

const SESSION_KEY = "solomon-admin-session";

export default function Admin() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Token management
  const [newToken, setNewToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [maskedToken, setMaskedToken] = useState("");
  const [tokenConfigured, setTokenConfigured] = useState(false);
  const [tokenSaved, setTokenSaved] = useState(false);

  // Model management
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4o-mini");

  const openMenu = useMobileMenu();

  // 세션 복원
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      adminCheckSession(saved).then((valid) => {
        if (valid) {
          setSessionId(saved);
          loadAdminData(saved);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadAdminData = async (sid: string) => {
    try {
      const [tokenData, modelData] = await Promise.all([
        adminGetToken(sid),
        adminGetModel(sid),
      ]);
      setTokenConfigured(tokenData.configured);
      setMaskedToken(tokenData.masked);
      setSelectedModel(modelData.model);
    } catch {
      // session expired
      handleLogout();
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    try {
      const sid = await adminLogin(password);
      setSessionId(sid);
      sessionStorage.setItem(SESSION_KEY, sid);
      setPassword("");
      await loadAdminData(sid);
    } catch (e: any) {
      setLoginError(e.message);
    }
  };

  const handleLogout = async () => {
    if (sessionId) await adminLogout(sessionId);
    setSessionId(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const handleSaveToken = async () => {
    if (!sessionId || !newToken.trim()) return;
    try {
      await adminSetToken(sessionId, newToken);
      setTokenSaved(true);
      setNewToken("");
      await loadAdminData(sessionId);
      setTimeout(() => setTokenSaved(false), 2000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSaveModel = async (model: string) => {
    if (!sessionId) return;
    setSelectedModel(model);
    await adminSetModel(sessionId, model);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-400">로딩 중...</div>
      </div>
    );
  }

  // 로그인 화면
  if (!sessionId) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
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
                <h1 className="text-xl md:text-2xl font-bold text-white mb-0.5">관리자</h1>
                <p className="text-sm text-slate-400">Admin Panel</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-800/50 border-red-500/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-white text-xl">관리자 인증</CardTitle>
              <CardDescription className="text-slate-400">
                관리자 비밀번호를 입력하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">비밀번호</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="관리자 비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {loginError && (
                <p className="text-sm text-red-400">{loginError}</p>
              )}
              <Button
                onClick={handleLogin}
                disabled={!password.trim()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                로그인
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={openMenu}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white mb-0.5">관리자</h1>
                <p className="text-sm text-slate-400">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* AI Token 관리 */}
          <Card className="bg-slate-800/50 border-red-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <CardTitle className="text-white text-base md:text-lg">
                    AI 토큰 관리
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    GitHub Models API 토큰을 설정합니다. 토큰은 서버에만 저장됩니다.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 현재 상태 */}
              <div className="rounded-lg bg-slate-900/60 border border-slate-600 p-3 md:p-4">
                <p className="text-sm text-slate-400 mb-1">현재 상태</p>
                {tokenConfigured ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">설정됨</span>
                    <span className="text-slate-500 text-xs font-mono">{maskedToken}</span>
                  </div>
                ) : (
                  <p className="text-amber-400 text-sm">미설정 - 토큰을 입력해주세요</p>
                )}
              </div>

              {/* 토큰 발급 안내 */}
              <div className="rounded-lg bg-slate-900/60 border border-slate-600 p-3 md:p-4 text-sm text-slate-300 space-y-2">
                <p className="font-semibold text-red-300">토큰 발급 방법:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-xs md:text-sm">
                  <li>GitHub.com → 프로필 → Settings</li>
                  <li>Developer settings → Personal access tokens</li>
                  <li>Fine-grained tokens → Generate new token</li>
                  <li>
                    Permissions → Account permissions →{" "}
                    <span className="text-red-300 font-medium">Models: Read</span> 선택
                  </li>
                  <li>Generate token 클릭 후 토큰 복사</li>
                </ol>
              </div>

              {/* 새 토큰 입력 */}
              <div className="space-y-2">
                <Label className="text-slate-300">
                  {tokenConfigured ? "새 토큰으로 변경" : "토큰 입력"}
                </Label>
                <div className="relative">
                  <Input
                    type={showToken ? "text" : "password"}
                    placeholder="github_pat_..."
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
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

              <Button
                onClick={handleSaveToken}
                disabled={!newToken.trim()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {tokenSaved ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 저장 완료
                  </span>
                ) : (
                  "토큰 저장"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 모델 설정 */}
          <Card className="bg-slate-800/50 border-red-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <CardTitle className="text-white text-base md:text-lg">
                    AI 모델 설정
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    모든 사용자에게 적용되는 AI 모델을 선택합니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <select
                value={selectedModel}
                onChange={(e) => handleSaveModel(e.target.value)}
                className="w-full rounded-md border border-slate-600 bg-slate-900 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
