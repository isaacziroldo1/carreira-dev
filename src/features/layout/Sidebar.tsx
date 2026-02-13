import type { ViewName } from "../../app/types";

type SidebarProps = {
  view: ViewName;
  theme: "light" | "dark";
  onViewChange: (view: ViewName) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
};

export function Sidebar({ view, theme, onViewChange, onToggleTheme, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand"><p className="eyebrow">Consultorio</p><h1>AgendaPro</h1></div>
      <nav className="menu">
        <button className={`menu-item ${view === "relatorio" ? "is-active" : ""}`} onClick={() => onViewChange("relatorio")}>Relatorio</button>
        <button className={`menu-item ${view === "pacientes" ? "is-active" : ""}`} onClick={() => onViewChange("pacientes")}>Pacientes</button>
        <button className={`menu-item ${view === "novo" ? "is-active" : ""}`} onClick={() => onViewChange("novo")}>Novo Agendamento</button>
        <button className={`menu-item ${view === "agenda" ? "is-active" : ""}`} onClick={() => onViewChange("agenda")}>Agenda</button>
      </nav>
      <button className="btn btn-secondary" onClick={onToggleTheme}>{theme === "dark" ? "Tema claro" : "Tema escuro"}</button>
      <button className="btn btn-secondary" onClick={onLogout}>Sair</button>
    </aside>
  );
}
