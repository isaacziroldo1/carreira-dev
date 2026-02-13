const TOKEN_KEY = "agenda.jwt";

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Erro inesperado" }));
    throw new Error(body.message || "Erro na API");
  }
  return response.json();
}

export { TOKEN_KEY, api };
