import { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (sessionUser) {
        setUser(sessionUser);
        await fetchRole(sessionUser.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      if (sessionUser) {
        setUser(sessionUser);
        fetchRole(sessionUser.id);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      listener.subscription?.unsubscribe?.();
    };
  }, []);

  async function fetchRole(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) setRole(data.role);
  }

  const login = (userRole) => {
    setRole(userRole);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
