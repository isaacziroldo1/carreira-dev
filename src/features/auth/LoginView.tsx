import type { FormEvent } from "react";

type LoginViewProps = {
  loginUser: string;
  loginPass: string;
  loginFeedback: string;
  onSubmit: (e: FormEvent) => void;
  onLoginUserChange: (value: string) => void;
  onLoginPassChange: (value: string) => void;
};

export function LoginView({
  loginUser,
  loginPass,
  loginFeedback,
  onSubmit,
  onLoginUserChange,
  onLoginPassChange,
}: LoginViewProps) {
  return (
    <section className="login-shell" aria-label="Tela de login">
      <div className="login-card">
        <h1>AgendaPro Consultorio</h1>
        <p className="login-subtitle">Acesso restrito para equipe autorizada.</p>
        <form className="login-form" onSubmit={onSubmit}>
          <label>
            Usuario
            <input value={loginUser} onChange={(e) => onLoginUserChange(e.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={loginPass} onChange={(e) => onLoginPassChange(e.target.value)} required />
          </label>
          <p className="feedback">{loginFeedback}</p>
          <button className="btn btn-primary" type="submit">Entrar</button>
        </form>
      </div>
    </section>
  );
}
