import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/auth.service';
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('tss_token'),
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('tss_token');
      if (token) {
        try {
          const user = await authService.getMe();
          setState({ user, token, isAuthenticated: true });
        } catch {
          authService.logout();
          setState({ user: null, token: null, isAuthenticated: false });
        }
      }
      setLoading(false);
    };
    init();
  }, []);
  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    localStorage.setItem('tss_token', token);
    setState({ user, token, isAuthenticated: true });
  };
  const logout = () => {
    authService.logout();
    setState({ user: null, token: null, isAuthenticated: false });
  };
  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
