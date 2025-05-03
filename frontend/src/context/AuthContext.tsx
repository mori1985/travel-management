import { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  setToken: () => {},
  setRole: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const updateRole = (newRole: string | null) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('role', newRole);
    } else {
      localStorage.removeItem('role');
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, setToken: updateToken, setRole: updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};