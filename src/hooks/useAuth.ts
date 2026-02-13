import { useEffect, useState, type FormEvent } from "react";
import { api, TOKEN_KEY } from "../app/api";
import type { AuthState, UseAuthResult } from "../app/types";

export function useAuth(): UseAuthResult {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginFeedback, setLoginFeedback] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuth({ status: "logged_out" });
      return;
    }

    api<{ user: string }>("/api/auth/me")
      .then((res) => setAuth({ status: "logged_in", user: res.user }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuth({ status: "logged_out" });
      });
  }, []);

  async function handleLogin(e: FormEvent): Promise<void> {
    e.preventDefault();
    setLoginFeedback("");
    try {
      const res = await api<{ token: string; user: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      localStorage.setItem(TOKEN_KEY, res.token);
      setAuth({ status: "logged_in", user: res.user });
      setLoginPass("");
    } catch (err) {
      setLoginFeedback(err instanceof Error ? err.message : "Falha no login");
    }
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    setAuth({ status: "logged_out" });
  }

  return {
    auth,
    loginUser,
    loginPass,
    loginFeedback,
    isLoggedIn: auth.status === "logged_in",
    setLoginUser,
    setLoginPass,
    handleLogin,
    logout,
  };
}
