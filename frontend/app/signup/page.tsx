import LogoSquare from "components/logo-square";
import Link from "next/link";

export const metadata = {
  title: "Sign Up",
  description: "Create your keyboard-only account.",
};

export default function SignupPage() {
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
              キーボードだけの居場所をつくる
            </p>
          </div>
        </div>

        <h1 className="kob-title text-xl">新規登録</h1>
        <p className="mt-2 text-sm text-neutral-400">
          画像だけのタイムラインへようこそ。
        </p>

        <form className="mt-6 space-y-4">
          <label className="block text-sm text-neutral-300">
            ユーザー名
            <input
              type="text"
              name="name"
              placeholder="Keeb Lover"
              className="kob-input mt-2"
              autoComplete="name"
            />
          </label>
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
              autoComplete="new-password"
            />
          </label>
          <button type="submit" className="kob-btn w-full">
            登録する
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
          <Link href="/login" className="hover:text-white">
            既にアカウントを持っている
          </Link>
          <Link href="/keyboards" className="hover:text-white">
            キーボード一覧へ
          </Link>
        </div>
      </div>
    </div>
  );
}
