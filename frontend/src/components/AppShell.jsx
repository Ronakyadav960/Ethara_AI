import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppShell = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="panel overflow-hidden">
          <div className="flex flex-col gap-6 bg-gradient-to-r from-ink via-slate-800 to-moss px-6 py-6 text-white md:flex-row md:items-end md:justify-between md:px-8">
            <div>
              <Link to="/dashboard" className="font-display text-3xl tracking-wide">
                Ethara PM
              </Link>
              <h1 className="mt-4 font-display text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">{subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 text-sm md:items-end">
              <div>
                <div className="font-semibold">{user?.name}</div>
                <div className="text-slate-200">{user?.role}</div>
              </div>
              <button type="button" onClick={logout} className="button-secondary border-white/20 bg-white/10 text-white hover:border-white hover:text-white">
                Logout
              </button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3 px-6 py-4 md:px-8">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-ink text-white" : "bg-sand text-ink"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-ink text-white" : "bg-sand text-ink"
                }`
              }
            >
              Projects
            </NavLink>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
};

export default AppShell;
