import { Link } from "react-router-dom";

const AuthFormLayout = ({ title, subtitle, footerText, footerLink, footerLabel, children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-panel lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-br from-ink via-slate-800 to-clay p-8 text-white md:p-12">
          <div className="font-display text-4xl">Ethara PM</div>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-200">
            Coordinate projects, track delivery, and control access with clear admin and member workflows.
          </p>
          <div className="mt-10 grid gap-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <div className="text-sm font-semibold">Role-based workflow</div>
              <div className="mt-2 text-sm text-slate-200">Admins control projects and assignments. Members focus on execution.</div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <div className="text-sm font-semibold">Task visibility</div>
              <div className="mt-2 text-sm text-slate-200">Dashboard metrics surface completed, pending, and overdue work instantly.</div>
            </div>
          </div>
        </div>
        <div className="bg-[#fffaf4] p-8 md:p-12">
          <h1 className="font-display text-4xl text-ink">{title}</h1>
          <p className="mt-3 text-sm text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-slate-600">
            {footerText}{" "}
            <Link to={footerLink} className="font-semibold text-clay">
              {footerLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
