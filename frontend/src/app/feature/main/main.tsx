export default function MainPage() {
  return (
    <>
      <header className="kob-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
          <div className="kob-title kob-text-green text-2xl">
            KEYBOARD ON-BOARD!
          </div>
          <input className="kob-input max-w-sm" placeholder="Search switches..." />
          <button className="kob-btn">ADD TO RIG</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <div className="kob-card">
          <div className="kob-card__label">LIMITED DROP</div>
          <div className="mt-1 text-lg font-black">Arcade Keycap Set</div>
          <div className="kob-card__price mt-2">$129</div>
          <div className="mt-3 flex gap-2">
            <span className="kob-badge">NEW</span>
            <span className="kob-badge kob-badge--hot">HOT</span>
          </div>
          <div className="mt-4">
            <button className="kob-btn kob-btn--cyan">DEPLOY TO DESK</button>
          </div>
        </div>
      </main>
    </>
  );
}
