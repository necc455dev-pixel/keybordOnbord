import LogoSquare from "components/logo-square";
import Link from "next/link";

export const metadata = {
  title: "Login",
  description: "Sign in to keep your keyboard feed personal.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-(--breakpoint-2xl) items-center justify-center px-4 py-12">
      <div className="kob-card kob-dots w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="kob-border-neon flex h-12 w-12 items-center justify-center rounded-full bg-black/40">
            <LogoSquare />
          </div>
          <div>
            <p className="text-lg font-semibold">Keyboard Onboard</p>
            <p className="text-xs text-neutral-400">
              写真だけのキーボード体験
            </p>
          </div>
        </div>

        <h1 className="kob-title text-xl">ログイン</h1>
        <p className="mt-2 text-sm text-neutral-400">
          余白と写真に集中するためのサインイン。
        </p>

        <form className="mt-6 space-y-4">
          <label className="block text-sm text-neutral-300">
            メールアドレス
            <input
              type="email"
              name="email"
              placeholder="you@keyboard.com"
              className="kob-input mt-2"
              autoComplete="email"
            />
          </label>
          <label className="block text-sm text-neutral-300">
            パスワード
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="kob-input mt-2"
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="kob-btn w-full">
            ログインする
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
          <Link href="/keyboards" className="hover:text-white">
            キーボードを見に行く
          </Link>
          <Link href="/user" className="hover:text-white">
            初めての方へ
          </Link>
        </div>
      </div>
    </div>
  );
}
