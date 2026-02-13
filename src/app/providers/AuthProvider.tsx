import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthSession,
  clearAuthSession,
  loadAuthSession,
  refreshToken,
  saveAuthSession,
  shouldRefreshSession,
} from "@/common/lib/auth.lib";

interface AuthContextValue {
  session: AuthSession | null;
  currentUser: AuthSession["user"] | null;
  currentUserId: string | null;
  currentUserName: string | null;
  isAuthed: boolean;
  isRefreshing: boolean;
  isInitializing: boolean;
  login: (next: AuthSession) => void;
  logout: () => void;
  attemptRefresh: () => Promise<void>;
  resolveUserName: (userId: string) => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuthState(): AuthContextValue {
  // Load session sync từ localStorage (chỉ 1 lần)
  const [session, setSession] = useState<AuthSession | null>(() => {
    return loadAuthSession();
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  // isInitializing chỉ = true nếu cần refresh token lúc khởi động
  // Nếu không có session hoặc session còn valid → không cần init
  const [isInitializing, setIsInitializing] = useState(false);

  const login = useCallback((next: AuthSession) => {
    setSession(next);
    saveAuthSession(next);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const attemptRefresh = useCallback(async () => {
    if (!session || !shouldRefreshSession(session)) return;

    setIsRefreshing(true);
    try {
      const refreshed = await refreshToken({
        refreshToken: session.refreshToken,
      });
      setSession(refreshed);
      saveAuthSession(refreshed);
    } catch (error) {
      console.error("Refresh token failed", error);
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [logout, session]);

  // Init auth state một lần khi mount - chỉ refresh token nếu cần
  useEffect(() => {
    const initAuth = async () => {
      // Load session từ localStorage (đã được load trong useState initializer)
      const currentSession = loadAuthSession();

      // Chỉ refresh nếu session tồn tại VÀ cần refresh
      if (currentSession && shouldRefreshSession(currentSession)) {
        setIsInitializing(true);
        setIsRefreshing(true);
        try {
          const refreshed = await refreshToken({
            refreshToken: currentSession.refreshToken,
          });
          setSession(refreshed);
          saveAuthSession(refreshed);
        } catch (error) {
          console.error("Refresh token failed during init", error);
          // Không logout ngay, giữ session cũ
        } finally {
          setIsRefreshing(false);
          setIsInitializing(false);
        }
      }
      // Nếu không cần refresh, không cần làm gì - session đã sẵn sàng
    };

    initAuth();
  }, []); // Chỉ chạy một lần khi mount

  // Refresh token định kỳ (sau khi đã init xong)
  useEffect(() => {
    if (isInitializing) return; // Chờ init xong

    const id = setInterval(() => {
      attemptRefresh();
    }, 60_000);

    return () => clearInterval(id);
  }, [attemptRefresh, isInitializing]);

  const currentUser = session?.user ?? null;
  const currentUserId = currentUser?.id ?? null;
  const currentUserName = currentUser?.name ?? null;

  const resolveUserName = useCallback(
    (userId: string) => {
      if (userId === currentUserId && currentUserName) return currentUserName;
      return "Thành viên";
    },
    [currentUserId, currentUserName]
  );

  const isAuthed = useMemo(
    () => Boolean(currentUserId && currentUserName),
    [currentUserId, currentUserName]
  );

  return {
    session,
    currentUser,
    currentUserId,
    currentUserName,
    isAuthed,
    isRefreshing,
    isInitializing,
    login,
    logout,
    attemptRefresh,
    resolveUserName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
