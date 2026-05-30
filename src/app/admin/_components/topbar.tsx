import { logoutAction } from "../actions";

export function Topbar({ username }: { username: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="text-sm font-medium text-slate-700">관리자 콘솔</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            <span className="text-slate-400">로그인:</span> {username}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
