import React, { useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface AuthContextInterface {
  auth: boolean;
  login: (response: any) => void;
  logout: (response: any) => void;
}

export const AuthContext = React.createContext<AuthContextInterface | null>(null);

export function AuthProvider({ children }: any) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AuthConsumer() {
  return useContext(AuthContext);
}
